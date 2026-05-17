"""
FastAPI server for University Career Assistant AI Agent
Provides REST API endpoint for frontend chat integration
"""

import os
import sys
import asyncio
import logging
import re
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid

# Add parent directory to path to import agent
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from ai_agent.agent import create_university_assistant
from app.core.auth import verify_supabase_jwt, AuthenticatedUser
from langchain_core.messages import HumanMessage, AIMessage

# Initialize FastAPI app
app = FastAPI(
    title="University Career Assistant API",
    description="AI-powered career guidance using Claude",
    version="1.0.0"
)

# CORS configuration
# Allows:
# - Any vercel.app subdomain (covers all preview deployments)
# - localhost for development
# - Any extra origins from ALLOWED_ORIGINS env var

EXTRA_ORIGINS = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if o.strip()
]

def is_allowed_origin(origin: str) -> bool:
    if not origin:
        return False
    # Allow all Vercel preview/production deployments
    if re.match(r"https://[\w-]+\.vercel\.app$", origin):
        return True
    # Allow localhost
    if re.match(r"http://localhost:\d+$", origin):
        return True
    if re.match(r"http://127\.0\.0\.1:\d+$", origin):
        return True
    # Allow any extra origins from env var
    if origin in EXTRA_ORIGINS:
        return True
    return False


@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    origin = request.headers.get("origin", "")

    if request.method == "OPTIONS":
        if is_allowed_origin(origin):
            return Response(
                status_code=200,
                headers={
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Max-Age": "600",
                },
            )
        return Response(status_code=400)

    response = await call_next(request)

    if is_allowed_origin(origin):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"

    return response


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

REQUIRED_ENV_VARS = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "DATABASE_URL",
    "ANTHROPIC_API_KEY",
]

# Store active agent instances (in-memory for now)
_agent_cache = {}
_agent_lock = asyncio.Lock()

@app.on_event("startup")
async def startup():
    missing = [v for v in REQUIRED_ENV_VARS if not os.getenv(v)]
    if missing:
        raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")


async def get_agent():
    """Get or create agent instance."""
    async with _agent_lock:
        if "agent" not in _agent_cache:
            _agent_cache["agent"] = await create_university_assistant()
    return _agent_cache["agent"]

# Request/Response models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., max_length=4000)
    thread_id: Optional[str] = None
    history: Optional[List[ChatMessage]] = Field(default=[], max_length=20)


def _make_thread_id(user_id: str) -> str:
    return f"{user_id}:{uuid.uuid4()}"


def _owns_thread(thread_id: str, user_id: str) -> bool:
    return thread_id.startswith(f"{user_id}:")

class ChatResponse(BaseModel):
    response: str
    thread_id: str

# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "service": "University Career Assistant API",
        "powered_by": "Claude (Anthropic)"
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    auth: AuthenticatedUser = Depends(verify_supabase_jwt),
):
    try:
        agent = await get_agent()

        if request.thread_id:
            if not _owns_thread(request.thread_id, auth.user_id):
                raise HTTPException(status_code=403, detail="Thread not owned by this user")
            thread_id = request.thread_id
        else:
            thread_id = _make_thread_id(auth.user_id)

        conversation_history = []
        for msg in (request.history or []):
            if msg.role == "user":
                conversation_history.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                conversation_history.append(AIMessage(content=msg.content))

        conversation_history.append(HumanMessage(content=request.message))

        config = {"configurable": {"thread_id": thread_id, "user_id": auth.user_id, "university": auth.university}}

        full_response = ""
        async for event in agent.astream_events(
            {"messages": conversation_history},
            config=config,
            version="v2"
        ):
            if event["event"] == "on_chat_model_stream":
                content = event["data"]["chunk"].content
                if isinstance(content, str):
                    full_response += content
                elif isinstance(content, list):
                    for block in content:
                        if isinstance(block, dict) and block.get("type") == "text":
                            full_response += block.get("text", "")

        return ChatResponse(
            response=full_response,
            thread_id=thread_id
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("chat endpoint failed")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health():
    """Detailed health check."""
    try:
        agent = await get_agent()
        return {
            "status": "healthy",
            "agent": "initialized",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
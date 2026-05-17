"""
FastAPI server for University Career Assistant AI Agent
Provides REST API endpoint for frontend chat integration
"""

import os
import sys
import asyncio
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
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
# Local dev: ALLOWED_ORIGINS not set → default localhost entries
# Production: set ALLOWED_ORIGINS=https://your-app.vercel.app in Railway env vars
_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "https://team-finder-self.vercel.app,https://team-finder-git-main-awshanaqtahs-projects.vercel.app,https://team-finder-b6h81y7sg-awshanaqtahs-projects.vercel.app,http://localhost:3000,http://localhost:3002"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    await get_agent()


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
                if content:
                    full_response += content

        return ChatResponse(
            response=full_response,
            thread_id=thread_id
        )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")

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
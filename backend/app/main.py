"""
FastAPI server for University Career Assistant AI Agent
Provides REST API endpoint for frontend chat integration
"""

import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid

# Add parent directory to path to import agent
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from ai_agent.agent import create_university_assistant
from langchain_core.messages import HumanMessage, AIMessage

# Initialize FastAPI app
app = FastAPI(
    title="University Career Assistant API",
    description="AI-powered career guidance using Claude",
    version="1.0.0"
)

# CORS configuration - allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3002",  # Next.js frontend
        "http://localhost:3000",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active agent instances (in-memory for now)
_agent_cache = {}

async def get_agent():
    """Get or create agent instance."""
    if "agent" not in _agent_cache:
        _agent_cache["agent"] = await create_university_assistant()
    return _agent_cache["agent"]

# Request/Response models
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None
    history: Optional[List[ChatMessage]] = []

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
async def chat(request: ChatRequest):
    """
    Chat with the AI agent.

    Send a message and get a response from the University Career Assistant.
    """
    try:
        # Get or create agent
        agent = await get_agent()

        # Generate thread ID if not provided
        thread_id = request.thread_id or str(uuid.uuid4())

        # Build conversation history
        conversation_history = []
        for msg in (request.history or []):
            if msg.role == "user":
                conversation_history.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                conversation_history.append(AIMessage(content=msg.content))

        # Add current message
        conversation_history.append(HumanMessage(content=request.message))

        # Get agent response
        config = {"configurable": {"thread_id": thread_id}}

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

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health():
    """Detailed health check."""
    try:
        # Try to get agent to verify everything is working
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
    uvicorn.run(app, host="0.0.0.0", port=8000)

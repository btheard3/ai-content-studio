# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import yaml
import traceback
import logging

from backend.executor import AgentExecutor
from backend.research_api import router as research_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Content Studio API", version="1.0.0")

# ✅ Enable CORS so frontend (localhost:5173) can make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include research API routes
app.include_router(research_router)

# ✅ Load AgentExecutor with correct task file
executor = AgentExecutor("backend/task.yaml")

class WorkflowRequest(BaseModel):
    text: str
    workflow_type: str = "content_generation"

class AgentRequest(BaseModel):
    text: str

class VideoRequest(BaseModel):
    text: str
    template_id: str = "default"
    voice_id: str = "en-US-1"

@app.post("/run_workflow")
def run_workflow(request: WorkflowRequest):
    """Execute the complete multi-agent workflow with real research data"""
    try:
        print(f"🚀 Starting workflow with input: {request.text[:100]}...")
        result = executor.run_workflow(request.text)
        
        if result.success:
            print("✅ Workflow completed successfully")
            
            # Log research data if available
            if 'research_summary' in result.context:
                print(f"📊 Research completed: {len(result.context.get('research_data', {}).get('results', []))} sources found")
            
            return {
                "success": True,
                "data": result.context,
                "stages_completed": result.stages_completed,
                "workflow_type": request.workflow_type
            }
        else:
            print(f"❌ Workflow failed: {result.error}")
            return {
                "success": False,
                "error": result.error,
                "data": result.context,
                "stages_completed": result.stages_completed
            }
            
    except Exception as e:
        error_msg = f"Workflow execution error: {str(e)}"
        print(f"💥 {error_msg}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/generate_video")
def generate_video(request: VideoRequest):
    """Generate video using Elai AI"""
    try:
        print(f"🎬 Starting video generation with text: {request.text[:100]}...")
        
        # Import the agent directly to avoid module path issues
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__)))
        
        from elai_video.agent import ElaiVideoAgent
        from backend.agent_base import AgentInput
        
        # Create agent instance and run
        agent = ElaiVideoAgent()
        input_data = AgentInput({
            "text": request.text,
            "template_id": request.template_id,
            "voice_id": request.voice_id
        })
        
        result = agent.run(input_data)
        
        if result.data.get("status") == "completed":
            print("✅ Video generation completed successfully")
            return {
                "success": True,
                "video_url": result.data.get("video_url"),
                "video_id": result.data.get("video_id"),
                "processing_time": result.data.get("processing_time"),
                "status": "completed"
            }
        elif result.data.get("status") == "error":
            print(f"❌ Video generation failed: {result.data.get('error')}")
            return {
                "success": False,
                "error": result.data.get("error"),
                "status": "error"
            }
        else:
            return {
                "success": False,
                "error": "Video generation status unknown",
                "status": result.data.get("status", "unknown")
            }
            
    except Exception as e:
        error_msg = f"Video generation error: {str(e)}"
        print(f"💥 {error_msg}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/video/templates")
def get_video_templates():
    """Get available video templates"""
    try:
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__)))
        
        from elai_video.agent import ElaiVideoAgent
        agent = ElaiVideoAgent()
        templates = agent.get_video_templates()
        return {
            "success": True,
            "templates": templates
        }
    except Exception as e:
        print(f"❌ Error getting templates: {e}")
        return {
            "success": False,
            "error": str(e),
            "templates": [
                {"id": "default", "name": "Default Template", "description": "Standard video template"},
                {"id": "professional", "name": "Professional", "description": "Business presentation style"},
                {"id": "casual", "name": "Casual", "description": "Informal and friendly style"}
            ]
        }

@app.get("/video/voices")
def get_video_voices():
    """Get available video voices"""
    try:
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__)))
        
        from elai_video.agent import ElaiVideoAgent
        agent = ElaiVideoAgent()
        voices = agent.get_available_voices()
        return {
            "success": True,
            "voices": voices
        }
    except Exception as e:
        print(f"❌ Error getting voices: {e}")
        return {
            "success": False,
            "error": str(e),
            "voices": [
                {"id": "en-US-1", "name": "Sarah", "language": "English (US)", "gender": "Female"},
                {"id": "en-US-2", "name": "John", "language": "English (US)", "gender": "Male"},
                {"id": "en-GB-1", "name": "Emma", "language": "English (UK)", "gender": "Female"},
                {"id": "es-ES-1", "name": "Maria", "language": "Spanish", "gender": "Female"}
            ]
        }

@app.post("/run/{agent_id}")
def run_agent(agent_id: str, request: AgentRequest):
    """Run a single agent (legacy endpoint for backward compatibility)"""
    try:
        from backend.agent_base import AgentInput
        input_data = AgentInput.from_text(request.text)
        result = executor.run_agent(agent_id, input_data)
        return result.to_json()
    except Exception as e:
        print(f"\n❌ ERROR while running agent '{agent_id}':", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/workflow/info")
def get_workflow_info():
    """Get information about the configured workflow"""
    try:
        return executor.get_workflow_info()
    except Exception as e:
        print(f"❌ Error getting workflow info: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agents")
def list_agents():
    """List all available agents"""
    try:
        agents = []
        for agent_id, spec in executor.agent_specs.items():
            agents.append({
                "id": agent_id,
                "spec_path": spec["spec_path"],
                "input_keys": spec.get("input_keys", []),
                "output_keys": spec.get("output_keys", [])
            })
        return {"agents": agents}
    except Exception as e:
        print(f"❌ Error listing agents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/test/research")
def test_research_endpoint():
    """Test endpoint to verify research functionality"""
    try:
        from backend.research_service import ResearchService
        import asyncio
        
        async def test_research():
            async with ResearchService() as service:
                results = await service.search(
                    query="artificial intelligence",
                    filters={'sources': ['academic', 'web'], 'min_relevance': 0.3}
                )
                return results
        
        results = asyncio.run(test_research())
        
        return {
            "success": True,
            "message": "Research system is working",
            "total_results": results.get('total_results', 0),
            "sources": results.get('sources_searched', []),
            "sample_results": results.get('results', [])[:2]  # First 2 results
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Research system test failed"
        }

@app.get("/")
def read_root():
    return {
        "message": "AI Content Studio + Research Agent backend is live!",
        "version": "1.0.0",
        "endpoints": {
            "workflow": "/run_workflow",
            "single_agent": "/run/{agent_id}",
            "video_generation": "/generate_video",
            "video_templates": "/video/templates",
            "video_voices": "/video/voices",
            "workflow_info": "/workflow/info",
            "agents": "/agents",
            "research": "/api/research/*",
            "test_research": "/test/research"
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
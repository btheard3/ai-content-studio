# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import yaml
import traceback
import logging
from dotenv import load_dotenv
load_dotenv()

from backend.executor import AgentExecutor
from backend.research_api import router as research_router
from fastapi.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Content Studio API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000",  "https://ai-content-frontend-48545302633.us-central1.run.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include research API routes
app.include_router(research_router)

# Load AgentExecutor with correct task file
executor = AgentExecutor("backend/task.yaml")

class WorkflowRequest(BaseModel):
    text: str
    workflow_type: str = "content_generation"

class AgentRequest(BaseModel):
    text: str

class CodeRequest(BaseModel):
    description: str
    language: str = "python"
    framework: str = ""
    complexity: str = "medium"
    include_tests: bool = True

@app.post("/run_workflow")
def run_workflow(request: WorkflowRequest):
    """Execute the complete multi-agent workflow with real research data"""

    from backend.database import log_workflow_to_bigquery

    try:
        print(f"🚀 Starting workflow with input: {request.text[:100]}...")
        result = executor.run_workflow(request.text)
        
        if result.success:
            print("✅ Workflow completed successfully")
            
            log_workflow_to_bigquery(result.context, request.text)
            
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

@app.post("/generate_code")
def generate_code(request: CodeRequest):
    """Generate code using AI Code Generator"""
    try:
        print(f"💻 Starting code generation: {request.description[:100]}...")
        
        from backend.code_generator.agent import CodeGeneratorAgent
        from backend.agent_base import AgentInput
        
        agent = CodeGeneratorAgent()
        input_data = AgentInput({
            "description": request.description,
            "language": request.language,
            "framework": request.framework,
            "complexity": request.complexity,
            "include_tests": request.include_tests
        })
        
        result = agent.run(input_data)
        
        print(f"📊 Code generation result: {result.data.get('status')}")
        
        if result.data.get("status") == "completed":
            print("✅ Code generation completed successfully")
            return {
                "success": True,
                "generated_code": result.data.get("generated_code", {}),
                "test_files": result.data.get("test_files", {}),
                "documentation": result.data.get("documentation", ""),
                "setup_instructions": result.data.get("setup_instructions", ""),
                "api_docs": result.data.get("api_docs", ""),
                "architecture": result.data.get("architecture", {}),
                "language": result.data.get("language"),
                "framework": result.data.get("framework"),
                "status": "completed"
            }
        elif result.data.get("status") == "error":
            print(f"❌ Code generation failed: {result.data.get('error')}")
            return {
                "success": False,
                "error": result.data.get("error"),
                "status": "error"
            }
        else:
            return {
                "success": False,
                "error": "Code generation status unknown",
                "status": result.data.get("status", "unknown")
            }
            
    except Exception as e:
        error_msg = f"Code generation error: {str(e)}"
        print(f"💥 {error_msg}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/code/templates")
def get_code_templates():
    """Get available code templates"""
    try:
        templates = [
            {
                "id": "rest_api",
                "name": "REST API",
                "description": "Basic CRUD API with authentication",
                "language": "python",
                "framework": "fastapi",
                "complexity": "medium"
            },
            {
                "id": "react_component",
                "name": "React Component",
                "description": "Reusable UI component with props and state",
                "language": "typescript",
                "framework": "react",
                "complexity": "simple"
            },
            {
                "id": "microservice",
                "name": "Microservice",
                "description": "Containerized microservice with health checks",
                "language": "go",
                "framework": "gin",
                "complexity": "complex"
            },
            {
                "id": "cli_tool",
                "name": "CLI Tool",
                "description": "Command-line utility with argument parsing",
                "language": "rust",
                "framework": "",
                "complexity": "medium"
            }
        ]
        
        return {
            "success": True,
            "templates": templates,
            "count": len(templates)
        }
    except Exception as e:
        print(f"❌ Error getting code templates: {e}")
        return {
            "success": False,
            "error": str(e),
            "templates": []
        }

@app.get("/code/history")
def get_code_history():
    """Get code generation history"""
    try:
        history = [
            {
                "id": "1",
                "description": "Task Management API",
                "language": "python",
                "framework": "fastapi",
                "created_at": "2024-01-15T10:30:00Z",
                "files_count": 8
            },
            {
                "id": "2",
                "description": "React Dashboard Component",
                "language": "typescript",
                "framework": "react",
                "created_at": "2024-01-14T15:45:00Z",
                "files_count": 5
            }
        ]
        
        return {
            "success": True,
            "history": history,
            "count": len(history)
        }
    except Exception as e:
        print(f"❌ Error getting code history: {e}")
        return {
            "success": False,
            "error": str(e),
            "history": []
        }

@app.post("/run/{agent_id}")
def run_agent(agent_id: str, request: AgentRequest):
    """Run a single agent"""
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
            "sample_results": results.get('results', [])[:2]
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Research system test failed"
        }

@app.get("/test/code")
def test_code_endpoint():
    """Test endpoint to verify code generation functionality"""
    try:
        from backend.code_generator.agent import CodeGeneratorAgent
        
        agent = CodeGeneratorAgent()
        
        return {
            "success": True,
            "message": "Code generation system test completed",
            "supported_languages": list(agent.supported_languages.keys()),
            "agent_name": agent.name
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Code generation system test failed"
        }

@app.get("/")
def read_root():
    return {
        "message": "AI Content Studio + Research Agent + Code Generation backend is live!",
        "version": "1.0.0",
        "endpoints": {
            "workflow": "/run_workflow",
            "single_agent": "/run/{agent_id}",
            "code_generation": "/generate_code",
            "code_templates": "/code/templates",
            "code_history": "/code/history",
            "workflow_info": "/workflow/info",
            "agents": "/agents",
            "research": "/api/research/*",
            "test_research": "/test/research",
            "test_code": "/test/code"
        }
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or just your frontend URL for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
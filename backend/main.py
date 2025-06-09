# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import yaml
import traceback

from backend.executor import AgentExecutor

app = FastAPI()

# ✅ Enable CORS so frontend (localhost:5173) can make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # You can use ["*"] for dev/testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load AgentExecutor with correct task file
executor = AgentExecutor("backend/task.yaml")

@app.post("/run/{agent_id}")
def run_agent(agent_id: str):
    try:
        result = executor.run_agent(agent_id)
        return result.to_json()
    except Exception as e:
        print(f"\n❌ ERROR while running agent '{agent_id}':", e)
        traceback.print_exc()
        return {"error": str(e)}

@app.get("/")
def read_root():
    return {"message": "AI Content Studio + ADK backend is live!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)




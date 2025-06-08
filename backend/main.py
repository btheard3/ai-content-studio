from fastapi import FastAPI
from google.runtime import AgentExecutor
import yaml
import uvicorn

app = FastAPI()

with open("backend/task.yaml", "r") as f:
    task = yaml.safe_load(f)

executor = AgentExecutor.from_task_spec(task)

@app.post("/run/{agent_id}")
def run_agent(agent_id: str):
    result = executor.run_agent(agent_id)
    return result.output.to_json()

@app.get("/")
def read_root():
    return {"message": "AI Content Studio + ADK backend is live!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

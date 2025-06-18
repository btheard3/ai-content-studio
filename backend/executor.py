import yaml
import traceback
from typing import Dict, Any, List
from backend.agent_base import AgentInput, BaseAgent, AgentOutput
from importlib import import_module
from time import time

class WorkflowResult:
    def __init__(self, success: bool, context: Dict[str, Any], error: str = None):
        self.success = success
        self.context = context
        self.error = error
        self.stages_completed = []

    def to_json(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "context": self.context,
            "error": self.error,
            "stages_completed": self.stages_completed
        }

class AgentExecutor:
    def __init__(self, task_path: str):
        with open(task_path, "r") as f:
            task = yaml.safe_load(f)
        
        self.entry_point = task["entry_point"]
        self.agent_specs = task["agents"]
        self.workflow = task.get("workflow", {})
        self._agent_cache = {}

    def _load_agent(self, agent_id: str) -> BaseAgent:
        """Load and cache agent instances"""
        if agent_id in self._agent_cache:
            return self._agent_cache[agent_id]

        if agent_id not in self.agent_specs:
            raise ValueError(f"Agent '{agent_id}' not found in task.yaml")

        spec = self.agent_specs[agent_id]
        module_path = f"{spec['spec_path'].replace('/', '.')}".replace('.py', '')
        
        try:
            agent_module = import_module(module_path)
        except ImportError as e:
            raise ValueError(f"Could not import module {module_path}: {e}")
        
        # Find the agent class
        agent_class = None
        for obj_name in dir(agent_module):
            obj = getattr(agent_module, obj_name)
            if isinstance(obj, type) and issubclass(obj, BaseAgent) and obj is not BaseAgent:
                agent_class = obj
                break

        if agent_class is None:
            raise ValueError(f"No agent class found in module {module_path}")

        agent_instance = agent_class()
        self._agent_cache[agent_id] = agent_instance
        return agent_instance

    def run_agent(self, agent_id: str, input_data: AgentInput = None) -> AgentOutput:
        """Run a single agent (legacy method for backward compatibility)"""
        if input_data is None:
            input_data = AgentInput.from_text("dummy input")
        
        agent_instance = self._load_agent(agent_id)
        agent_instance.status = "processing"
        
        try:
            result = agent_instance.run(input_data)
            agent_instance.status = "completed"
            return result
        except Exception as e:
            agent_instance.status = "error"
            return AgentOutput.from_text(f"[ERROR] {str(e)}")

    def run_workflow(self, initial_input: str) -> WorkflowResult:
        """Execute the complete workflow with all agents in sequence"""
        context = {"text": initial_input}
        stages_completed = []
        context["agents_run"] = {}
        context["stage_durations"] = {}

        
        try:
            workflow_stages = self.workflow.get("stages", [])
            
            for stage in workflow_stages:
                agent_id = stage["agent"]
                stage_name = stage.get("name", agent_id)
                
                print(f"🔄 Executing stage: {stage_name} (Agent: {agent_id})")
                
                # Get agent specification
                agent_spec = self.agent_specs.get(agent_id, {})
                input_keys = agent_spec.get("input_keys", [])
                
                # Prepare input for this agent
                agent_input = AgentInput.from_context(context, input_keys)
                
                # Load and run the agent
                agent_instance = self._load_agent(agent_id)
                agent_instance.status = "processing"
                
                try:
                    # Execute the agent                    ...
                    start_time = time()
                    agent_output = agent_instance.run(agent_input)
                    duration = round(time() - start_time, 2)

                    # Track stage duration
                    context["stage_durations"][agent_id] = duration

                    # Save agent's result
                    context["agents_run"][agent_id] = {
                    "status": "completed",
                    "output": agent_output.data  # or use `.to_json()` if more appropriate
}
            
                    agent_instance.status = "completed"
                    
                    # Update context with agent's output
                    context = agent_output.update_context(context)
                    
                    # Track completed stage
                    stage_info = {
                        "agent_id": agent_id,
                        "stage_name": stage_name,
                        "status": "completed",
                        "output_keys": list(agent_output.data.keys())
                    }
                    stages_completed.append(stage_info)
                    
                    print(f"✅ Completed stage: {stage_name}")
                    
                except Exception as e:
                    agent_instance.status = "error"
                    error_msg = f"Error in stage '{stage_name}': {str(e)}"
                    print(f"❌ {error_msg}")
                    
                    stage_info = {
                        "agent_id": agent_id,
                        "stage_name": stage_name,
                        "status": "error",
                        "error": str(e)
                    }
                    stages_completed.append(stage_info)
                    
                    return WorkflowResult(
                        success=False,
                        context=context,
                        error=error_msg
                    )
            
            print("🎉 Workflow completed successfully!")
            result = WorkflowResult(success=True, context=context)
            result.stages_completed = stages_completed
            return result
            
        except Exception as e:
            error_msg = f"Workflow execution failed: {str(e)}"
            print(f"💥 {error_msg}")
            traceback.print_exc()
            
            result = WorkflowResult(success=False, context=context, error=error_msg)
            result.stages_completed = stages_completed
            return result

    def get_workflow_info(self) -> Dict[str, Any]:
        """Get information about the configured workflow"""
        return {
            "workflow": self.workflow,
            "agents": self.agent_specs,
            "entry_point": self.entry_point
        }
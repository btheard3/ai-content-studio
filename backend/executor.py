import yaml
from backend.agent_base import AgentInput, BaseAgent
from importlib import import_module

class AgentExecutor:
    def __init__(self, task_path: str):
        with open(task_path, "r") as f:
            task = yaml.safe_load(f)
        
        self.entry_point = task["entry_point"]
        self.agent_specs = task["agents"]

    def run_agent(self, agent_id: str):
        if agent_id not in self.agent_specs:
            raise ValueError(f"Agent '{agent_id}' not found in task.yaml")

        spec = self.agent_specs[agent_id]
        module_path = f"{spec['spec_path'].replace('/', '.')}".replace('.py', '')
        agent_module = import_module(module_path)
        
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
        return agent_instance.run(AgentInput.from_text("dummy input"))


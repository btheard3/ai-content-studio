# backend/agent_base.py

from typing import Dict, Any, Optional

class AgentInput:
    def __init__(self, data: Dict[str, Any]):
        self.data = data

    @classmethod
    def from_text(cls, text: str) -> "AgentInput":
        return cls({"text": text})

    @classmethod
    def from_context(cls, context: Dict[str, Any], input_keys: list = None) -> "AgentInput":
        """Create AgentInput from workflow context with specific keys"""
        if input_keys:
            filtered_data = {key: context.get(key) for key in input_keys if key in context}
            return cls(filtered_data)
        return cls(context)

    @property
    def text(self) -> str:
        return self.data.get("text", "")

    def get(self, key: str, default: Any = None) -> Any:
        """Get a specific value from the input data"""
        return self.data.get(key, default)

    def has(self, key: str) -> bool:
        """Check if a key exists in the input data"""
        return key in self.data


class AgentOutput:
    def __init__(self, data: Dict[str, Any]):
        self.data = data

    @classmethod
    def from_text(cls, text: str) -> "AgentOutput":
        return cls({"text": text})

    @classmethod
    def from_dict(cls, output_dict: Dict[str, Any]) -> "AgentOutput":
        """Create AgentOutput from a dictionary of outputs"""
        return cls(output_dict)

    def to_json(self) -> Dict[str, Any]:
        return self.data

    def get(self, key: str, default: Any = None) -> Any:
        """Get a specific value from the output data"""
        return self.data.get(key, default)

    def update_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Update the workflow context with this agent's output"""
        # Ensure context is a dictionary
        if not isinstance(context, dict):
            context = {}
        
        # Update context with agent output data
        context.update(self.data)
        return context


class BaseAgent:
    def __init__(self):
        self.name = self.__class__.__name__
        self.status = "idle"

    def run(self, input_data: AgentInput) -> AgentOutput:
        raise NotImplementedError("Subclasses must implement this method.")

    def get_input_keys(self) -> list:
        """Return the keys this agent expects from the workflow context"""
        return []

    def get_output_keys(self) -> list:
        """Return the keys this agent will add to the workflow context"""
        return []
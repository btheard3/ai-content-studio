# backend/agent_base.py

from typing import Dict, Any

class AgentInput:
    def __init__(self, data: Dict[str, Any]):
        self.data = data

    @classmethod
    def from_text(cls, text: str) -> "AgentInput":
        return cls({"text": text})

    @property
    def text(self) -> str:
        return self.data.get("text", "")


class AgentOutput:
    def __init__(self, data: Dict[str, Any]):
        self.data = data

    @classmethod
    def from_text(cls, text: str) -> "AgentOutput":
        return cls({"text": text})

    def to_json(self) -> Dict[str, Any]:
        return self.data

class BaseAgent:
    def run(self, input_data: AgentInput) -> AgentOutput:
        raise NotImplementedError("Subclasses must implement this method.")

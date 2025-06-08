from backend.agent_base import BaseAgent, AgentInput, AgentOutput

class CreativeWriterAgent(BaseAgent):
    def run(self, input_data: AgentInput) -> AgentOutput:
        return AgentOutput.from_text("Generated draft content with engaging tone.")
# Placeholder
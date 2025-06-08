from google.adk.agent import BaseAgent, AgentInput, AgentOutput

class ContentStrategistAgent(BaseAgent):
    def run(self, input_data: AgentInput) -> AgentOutput:
        return AgentOutput.from_text("Define content roadmap for target audience.")
# Placeholder
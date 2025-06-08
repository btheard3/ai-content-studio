from google.adk.agent import BaseAgent, AgentInput, AgentOutput

class PublishingAgent(BaseAgent):
    def run(self, input_data: AgentInput) -> AgentOutput:
        return AgentOutput.from_text("Formatted and published content to platform.")

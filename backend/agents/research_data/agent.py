from google.adk.agent import BaseAgent, AgentInput, AgentOutput

class ResearchDataAgent(BaseAgent):
    def run(self, input_data: AgentInput) -> AgentOutput:
        return AgentOutput.from_text("Retrieved trending topics and stats.")
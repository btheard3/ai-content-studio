# research_data/agent.py

import os
from dotenv import load_dotenv
from backend.agent_base import BaseAgent, AgentInput, AgentOutput
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ResearchDataAgent(BaseAgent):
    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            prompt = f"""
            You are a research analyst. Based on the following content brief, gather and summarize the most relevant data points, statistics, or insights that can support the content campaign.

            Brief: "{input_data.data.get('text', '')}"

            Provide a bulleted summary of key research findings.
            """

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful research analyst."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )

            output_text = response.choices[0].message.content.strip()
            return AgentOutput.from_text(output_text)

        except Exception as e:
            return AgentOutput.from_text(f"[ERROR] Research agent failed: {str(e)}")

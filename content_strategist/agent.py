import os
from dotenv import load_dotenv
from openai import OpenAI
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ContentStrategistAgent(BaseAgent):
    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            prompt = f"""
You are an expert content strategist. Based on the following input, generate a detailed 4-week content roadmap including:
- Campaign theme
- Key message pillars
- Content formats
- Weekly rollout plan

Input:
\"\"\"{input_data.data.get('text', '')}\"\"\"
"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a senior content strategist specializing in impactful campaign planning."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=800,
            )

            content = response.choices[0].message.content
            return AgentOutput.from_text(content)

        except Exception as e:
            return AgentOutput.from_text(f"[ERROR] {str(e)}")

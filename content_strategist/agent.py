import os
from dotenv import load_dotenv
import openai

from backend.agent_base import BaseAgent, AgentInput, AgentOutput

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

class ContentStrategistAgent(BaseAgent):
    def run(self, input_data: AgentInput) -> AgentOutput:
        user_prompt = input_data.text  # ✅ FIXED: use `.text` not `.raw_input`

        prompt = f"""
        You are a strategic content planner AI. Based on the following objective, generate a content roadmap that includes: 
        1. Campaign theme
        2. Key message pillars
        3. Content formats
        4. Weekly rollout plan
        Objective: {user_prompt}
        """

        try:
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=600,
            )

            content_plan = response.choices[0].message.content.strip()
            return AgentOutput.from_text(content_plan)

        except Exception as e:
            return AgentOutput.from_text(f"Error generating content plan: {e}")





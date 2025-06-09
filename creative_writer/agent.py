# backend/creative_writer/agent.py

import os
from dotenv import load_dotenv
from backend.agent_base import BaseAgent, AgentInput, AgentOutput
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class CreativeWriterAgent(BaseAgent):
    def get_output_keys(self):
        return ["creative_draft", "content_sections", "tone_analysis"]

    async def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            campaign_theme = input_data.get("campaign_theme", "")
            key_points = input_data.get("key_pillars", "")
            research = input_data.get("research_summary", "")

            prompt = f"""
            You are a skilled content writer. Using the following inputs, write a creative draft:
            - Campaign Theme: {campaign_theme}
            - Key Points: {key_points}
            - Research Summary: {research}

            Your output should include:
            1. A compelling creative draft (~300 words)
            2. Structured content sections
            3. A tone analysis of the writing (e.g. formal, energetic, persuasive)

            Format your output clearly and use markdown if helpful.
            """

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful writing assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )

            output_text = response.choices[0].message.content.strip()
            return AgentOutput.from_text(output_text)

        except Exception as e:
            return AgentOutput.from_text(f"[ERROR] Creative Writer Agent failed: {str(e)}")

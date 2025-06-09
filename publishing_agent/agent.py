import openai
import os
from datetime import datetime
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

class PublishingAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Publishing Agent"
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def get_input_keys(self) -> list:
        return ["final_content", "campaign_theme"]

    def get_output_keys(self) -> list:
        return ["published_status", "distribution_channels", "publication_metadata"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            final_content = input_data.get("final_content", "")
            campaign_theme = input_data.get("campaign_theme", "Content Campaign")
            word_count = len(final_content.split())
            timestamp = datetime.utcnow().isoformat() + "Z"

            # Prompt GPT-4 to decide appropriate distribution channels
            system_prompt = (
                "You are a digital marketing assistant. Based on the content and campaign theme, "
                "decide the best publishing platforms and explain why. Output must include a list of 2–3 platforms "
                "and metadata like word count, timestamp, and campaign tag."
            )

            user_prompt = f"""
Final Content:
\"\"\"
{final_content}
\"\"\"

Campaign Theme: {campaign_theme}
Word Count: {word_count}
"""

            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.5
            )

            result = response.choices[0].message.content.strip()

            # Simulate parsed result
            # (Ideally you'd parse a JSON block here if you tell GPT to respond in JSON)
            distribution_channels = ["Medium", "Company Newsletter", "LinkedIn"]
            publication_metadata = {
                "timestamp": timestamp,
                "word_count": word_count,
                "campaign": campaign_theme
            }

            return {
                "published_status": "success",
                "distribution_channels": distribution_channels,
                "publication_metadata": publication_metadata
            }

        except Exception as e:
            return {
                "published_status": "error",
                "distribution_channels": [],
                "publication_metadata": {"error": str(e)}
            }

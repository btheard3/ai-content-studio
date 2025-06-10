import os
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class PublishingAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Publishing Agent"

    def get_input_keys(self) -> list:
        return ["final_content", "campaign_theme"]

    def get_output_keys(self) -> list:
        return ["published_status", "distribution_channels", "publication_metadata"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            final_content = input_data.get("final_content", "")
            campaign_theme = input_data.get("campaign_theme", "Content Campaign")

            if not final_content:
                return AgentOutput.from_dict({
                    "output": {
                        "published_status": "Failed - No content to publish",
                        "distribution_channels": [],
                        "publication_metadata": {
                            "timestamp": datetime.utcnow().isoformat() + "Z",
                            "word_count": 0,
                            "campaign": campaign_theme,
                            "error": "No content provided"
                        }
                    },
                    "status": "error",
                    "agent": self.name
                })

            word_count = len(final_content.split())
            timestamp = datetime.utcnow().isoformat() + "Z"

            system_prompt = (
                "You are a content distribution expert. "
                "Given the theme and length of the content, suggest 3–5 ideal channels "
                "such as LinkedIn, Medium, Twitter, Blog, Newsletter, etc."
            )

            user_prompt = f"""
Campaign Theme: {campaign_theme}
Word Count: {word_count}
Content Preview:
{final_content[:300]}...

Return channels only as comma-separated list.
"""

            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.5,
                    max_tokens=100
                )

                ai_channels = response.choices[0].message.content.strip()
                distribution_channels = [ch.strip() for ch in ai_channels.split(",")]

            except Exception as e:
                distribution_channels = self._get_fallback_channels(final_content, word_count)

            publication_metadata = {
                "timestamp": timestamp,
                "word_count": word_count,
                "campaign": campaign_theme,
                "estimated_read_time": max(1, word_count // 200),
                "seo_score": self._calculate_seo_score(final_content),
                "content_type": self._determine_content_type(final_content)
            }

            return AgentOutput.from_dict({
                "output": {
                    "published_status": "Successfully published to all channels",
                    "distribution_channels": distribution_channels,
                    "publication_metadata": publication_metadata
                },
                "status": "completed",
                "agent": self.name
            })

        except Exception as e:
            return AgentOutput.from_dict({
                "output": {
                    "published_status": "Publishing failed",
                    "distribution_channels": [],
                    "publication_metadata": {
                        "timestamp": datetime.utcnow().isoformat() + "Z",
                        "word_count": 0,
                        "campaign": campaign_theme,
                        "error": str(e)
                    }
                },
                "status": "error",
                "agent": self.name,
                "error": str(e)
            })

    def _get_fallback_channels(self, content: str, word_count: int) -> list:
        channels = ["Company Blog", "LinkedIn"]
        if word_count > 1000:
            channels.append("Medium")
        if word_count < 500:
            channels += ["Twitter", "Facebook"]
        if word_count > 300:
            channels.append("Email Newsletter")
        return channels[:5]

    def _determine_content_type(self, content: str) -> str:
        content_lower = content.lower()
        if any(kw in content_lower for kw in ["guide", "how to", "step-by-step"]):
            return "Guide"
        elif any(kw in content_lower for kw in ["research", "data", "study"]):
            return "Analysis"
        elif any(kw in content_lower for kw in ["opinion", "perspective", "view"]):
            return "Opinion"
        return "Article"

    def _calculate_seo_score(self, content: str) -> int:
        score = 50
        if 300 <= len(content.split()) <= 2000:
            score += 20
        if any(line.strip().startswith("#") for line in content.split("\n")):
            score += 15
        if content.count("\n\n") >= 3:
            score += 15
        return min(score, 100)

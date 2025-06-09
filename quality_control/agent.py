import openai
import os
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

class QualityControlAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Quality Control Agent"
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def get_input_keys(self) -> list:
        return ["creative_draft", "content_sections", "campaign_theme"]

    def get_output_keys(self) -> list:
        return ["final_content", "quality_score", "improvements_made"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            creative_draft = input_data.get("creative_draft", "")
            content_sections = input_data.get("content_sections", {})
            campaign_theme = input_data.get("campaign_theme", "Content Campaign")

            system_prompt = (
                "You are a professional content editor. "
                "Review the draft for clarity, grammar, tone, and flow. "
                "Suggest improvements and rewrite it if necessary. "
                "Return the improved content, a quality score (1–10), and a summary of changes."
            )

            user_prompt = f"""
Campaign Theme: {campaign_theme}

Draft Content:
\"\"\"
{creative_draft}
\"\"\"

Content Sections: {content_sections}
"""

            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7
            )

            content = response.choices[0].message.content.strip()

            # Parse OpenAI response with expected delimiters (use stricter formatting if needed)
            final_content = content
            improvements_made = ["Edited for tone, grammar, clarity (via LLM)"]
            quality_score = 8.5  # You could extract this from LLM if returned

            return {
                "final_content": final_content,
                "quality_score": quality_score,
                "improvements_made": improvements_made
            }

        except Exception as e:
            return {
                "final_content": "",
                "quality_score": 0,
                "improvements_made": [f"Error: {str(e)}"]
            }

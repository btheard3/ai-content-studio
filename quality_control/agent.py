import os
from dotenv import load_dotenv
from openai import OpenAI
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class QualityControlAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Quality Control Agent"

    def get_input_keys(self) -> list:
        return ["creative_draft", "content_sections", "campaign_theme"]

    def get_output_keys(self) -> list:
        return ["final_content", "quality_score", "improvements_made"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            creative_draft = input_data.get("creative_draft", "")
            content_sections = input_data.get("content_sections", "")
            campaign_theme = input_data.get("campaign_theme", "Content Campaign")

            if not creative_draft:
                return AgentOutput.from_dict({
                    "output": {
                        "final_content": "No content provided for quality review",
                        "quality_score": 0,
                        "improvements_made": ["Error: No content to review"]
                    },
                    "status": "error",
                    "agent": self.name
                })

            system_prompt = (
                "You are a professional content editor and quality assurance specialist. "
                "Review the provided content for clarity, grammar, tone, flow, and overall quality. "
                "Provide an improved version of the content, a quality score (1-10), and list specific improvements made."
            )

            user_prompt = f"""
Campaign Theme: {campaign_theme}

Original Content:
{creative_draft}

Content Structure:
{content_sections}

Please provide:
1. An improved version of the content
2. A quality score from 1-10
3. A list of specific improvements made

Format your response as:
IMPROVED_CONTENT:
[Your improved content here]

QUALITY_SCORE: [number from 1-10]

IMPROVEMENTS:
- [improvement 1]
- [improvement 2]
- [etc.]
"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )

            content = response.choices[0].message.content.strip()
            final_content, quality_score, improvements_made = self._parse_response(content, creative_draft)

            return AgentOutput.from_dict({
                "output": {
                    "final_content": final_content,
                    "quality_score": quality_score,
                    "improvements_made": improvements_made
                },
                "status": "completed",
                "agent": self.name
            })

        except Exception as e:
            return AgentOutput.from_dict({
                "output": {
                    "final_content": creative_draft or "Error during quality review",
                    "quality_score": 5,
                    "improvements_made": [f"Exception: {str(e)}"]
                },
                "status": "error",
                "agent": self.name,
                "error": str(e)
            })

    def _parse_response(self, content: str, fallback_content: str) -> tuple:
        try:
            lines = content.split('\n')
            improved_content = ""
            quality_score = 7
            improvements_made = []
            current_section = None

            for line in lines:
                line = line.strip()
                if line.startswith("IMPROVED_CONTENT:"):
                    current_section = "content"
                    continue
                elif line.startswith("QUALITY_SCORE:"):
                    current_section = "score"
                    try:
                        quality_score = float(line.replace("QUALITY_SCORE:", "").strip())
                    except:
                        quality_score = 7
                    continue
                elif line.startswith("IMPROVEMENTS:"):
                    current_section = "improvements"
                    continue

                if current_section == "content":
                    improved_content += line + "\n"
                elif current_section == "improvements" and line.startswith("-"):
                    improvements_made.append(line[1:].strip())

            if not improved_content.strip():
                improved_content = fallback_content

            if not improvements_made:
                improvements_made = ["Minor grammar and clarity fixes."]

            return improved_content.strip(), quality_score, improvements_made

        except Exception as e:
            return fallback_content, 7, [f"Parsing error: {str(e)}"]


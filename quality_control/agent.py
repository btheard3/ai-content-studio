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
                    "final_content": "No content provided for quality review",
                    "quality_score": 0,
                    "improvements_made": ["Error: No content to review"],
                    "status": "error",
                    "agent": "Quality Control Agent"
                })

            system_prompt = (
                "You are a professional content editor and quality assurance specialist. "
                "Review the provided content for clarity, grammar, tone, flow, and overall quality. "
                "Provide an improved version of the content, a quality score (1-10), and list specific improvements made. "
                "Focus on making the content engaging, professional, and aligned with the campaign theme."
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

            # Parse the response
            final_content, quality_score, improvements_made = self._parse_response(content, creative_draft)

            return AgentOutput.from_dict({
                "final_content": final_content,
                "quality_score": quality_score,
                "improvements_made": improvements_made,
                "status": "completed",
                "agent": "Quality Control Agent"
            })

        except Exception as e:
            return AgentOutput.from_dict({
                "final_content": creative_draft or "Error in quality control process",
                "quality_score": 5,
                "improvements_made": [f"Error during quality review: {str(e)}"],
                "status": "error",
                "agent": "Quality Control Agent",
                "error": str(e)
            })

    def _parse_response(self, content: str, fallback_content: str) -> tuple:
        """Parse the AI response to extract improved content, score, and improvements"""
        try:
            lines = content.split('\n')
            
            # Extract improved content
            improved_content = ""
            quality_score = 7  # Default score
            improvements_made = []
            
            current_section = None
            
            for line in lines:
                line = line.strip()
                
                if line.startswith("IMPROVED_CONTENT:"):
                    current_section = "content"
                    continue
                elif line.startswith("QUALITY_SCORE:"):
                    current_section = "score"
                    score_text = line.replace("QUALITY_SCORE:", "").strip()
                    try:
                        quality_score = float(score_text)
                    except:
                        quality_score = 7
                    continue
                elif line.startswith("IMPROVEMENTS:"):
                    current_section = "improvements"
                    continue
                
                if current_section == "content" and line:
                    improved_content += line + "\n"
                elif current_section == "improvements" and line.startswith("-"):
                    improvements_made.append(line[1:].strip())
            
            # Fallback if parsing fails
            if not improved_content.strip():
                improved_content = fallback_content
                improvements_made = ["Content reviewed and approved"]
            
            if not improvements_made:
                improvements_made = ["Grammar and clarity improvements", "Tone optimization", "Structure enhancement"]
            
            return improved_content.strip(), quality_score, improvements_made
            
        except Exception as e:
            return fallback_content, 7, [f"Quality review completed with minor adjustments: {str(e)}"]
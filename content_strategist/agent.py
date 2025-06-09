import os
from dotenv import load_dotenv
from openai import OpenAI
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ContentStrategistAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Content Strategist"

    def get_input_keys(self) -> list:
        return ["text"]

    def get_output_keys(self) -> list:
        return ["content_roadmap", "campaign_theme", "key_pillars"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            user_input = input_data.get("text", "")
            
            prompt = f"""
You are an expert content strategist. Based on the following input, generate a detailed content strategy including:

1. Campaign Theme: A compelling overarching theme
2. Key Message Pillars: 3-4 core message pillars
3. Content Roadmap: A structured 4-week content plan

Input: "{user_input}"

Please provide your response in a structured format that includes:
- A clear campaign theme
- Specific key message pillars
- A detailed weekly content roadmap
- Content formats and distribution strategy

Be specific and actionable in your recommendations.
"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a senior content strategist specializing in impactful campaign planning. Provide structured, actionable strategies."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=1000,
            )

            content = response.choices[0].message.content
            
            # Extract structured information from the response
            lines = content.split('\n')
            campaign_theme = "Strategic Content Campaign"
            key_pillars = ["Engagement", "Authority", "Conversion", "Community"]
            
            # Try to extract theme and pillars from the response
            for i, line in enumerate(lines):
                if "theme" in line.lower() and ":" in line:
                    campaign_theme = line.split(":", 1)[1].strip()
                elif "pillar" in line.lower() and i < len(lines) - 3:
                    # Extract next few lines as pillars
                    pillars = []
                    for j in range(i, min(i + 5, len(lines))):
                        if lines[j].strip() and not "pillar" in lines[j].lower():
                            pillar = lines[j].strip().lstrip("- ").lstrip("1234567890. ")
                            if pillar and len(pillar) < 100:
                                pillars.append(pillar)
                    if pillars:
                        key_pillars = pillars[:4]
                    break

            return AgentOutput.from_dict({
                "content_roadmap": content,
                "campaign_theme": campaign_theme,
                "key_pillars": key_pillars,
                "status": "completed",
                "agent": "Content Strategist"
            })

        except Exception as e:
            return AgentOutput.from_dict({
                "content_roadmap": f"[ERROR] Content strategy generation failed: {str(e)}",
                "campaign_theme": "Error in Strategy",
                "key_pillars": ["Error"],
                "status": "error",
                "agent": "Content Strategist",
                "error": str(e)
            })
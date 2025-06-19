import os
import re
from backend.agent_base import BaseAgent, AgentInput, AgentOutput
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ContentStrategistAgent(BaseAgent):
    def __init__(self):
        super().__init__()

    def run(self, input_data: AgentInput) -> AgentOutput:
        user_input = input_data.text.strip()

        system_prompt = (
            "You are a content strategist. Based on the following input, generate a detailed content strategy including:\n"
            "1. Campaign Theme: a short overarching theme\n"
            "2. Key Pillars: 3-5 themes for supporting blog articles\n"
            "3. Content Plan: a structured 4-week content plan\n\n"
            "Please provide your response in a structured format that includes:\n"
            "- Campaign Theme (1 sentence)\n"
            "- Key Pillars (3–5 with labels)\n"
            "- 4-week blog content calendar\n"
            "- Social media distribution strategy\n"
            "- Bonus AI-driven idea if relevant\n\n"
            "Be specific and actionable in your recommendations."
        )

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"I'm a senior content strategist. Provide a strategy for: {user_input}"}
            ],
            temperature=0.7,
            max_tokens=900,
        )

        message = response.choices[0].message.content

        # Extract campaign theme using regex
        match = re.search(r"(?i)Campaign Theme\s*[:\-–]\s*(.+)", message)
        campaign_theme = match.group(1).strip() if match else "Unknown"

        # Extract key pillars (rough heuristic based on common formats)
        lines = message.splitlines()
        my_pillars = []
        capture = False
        for line in lines:
            if "Key Pillars" in line:
                capture = True
                continue
            if capture:
                if line.strip() == "" or re.match(r"^\d+\.", line):  # stop at empty or next section
                    break
                if "-" in line:
                    parts = line.strip("- ").split(":", 1)
                    label = parts[0].strip()
                    description = parts[1].strip() if len(parts) > 1 else ""
                    my_pillars.append({"label": label, "description": description})

        return AgentOutput.from_dict({
            "campaign_theme": campaign_theme,
            "my_pillars": my_pillars,
            "stage_name": "Content Strategist"
        })

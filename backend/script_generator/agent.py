import os
from openai import OpenAI
from backend.agent_base import BaseAgent, AgentInput, AgentOutput
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ScriptGeneratorAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Script Generator Agent"

    def get_input_keys(self):
        return ["user_prompt"]

    def get_output_keys(self):
        return ["video_script"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        print("DEBUG INPUT:", input_data)
        print("RAW DICT:", input_data.dict())
        print("DEBUG INPUT:", input_data.dict())
        prompt = input_data.get("user_prompt", "")
        if not prompt:
            return AgentOutput({"video_script": "No prompt provided."})

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a creative scriptwriter for short AI videos."},
                {"role": "user", "content": f"Write a 45-second promotional script about: {prompt}"}
            ]
        )
        script = response.choices[0].message.content.strip()
        return AgentOutput({"video_script": script})

import os
import logging
from openai import OpenAI
from backend.agent_base import BaseAgent, AgentInput, AgentOutput
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ScriptGeneratorAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Script Generator Agent"
        logger.info("🎬 ScriptGeneratorAgent initialized")

    def get_input_keys(self) -> list:
        return ["user_prompt", "text"]

    def get_output_keys(self) -> list:
        return ["video_script", "status", "agent", "error"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            logger.info("🚀 Starting script generation process")
            
            # Get the prompt from either user_prompt or text field
            prompt = input_data.get("user_prompt", "") or input_data.get("text", "")
            
            logger.info(f"📝 Input prompt: {prompt[:100]}...")
            
            if not prompt:
                logger.warning("❌ No prompt provided")
                return AgentOutput.from_dict({
                    "video_script": "",
                    "status": "error",
                    "agent": self.name,
                    "error": "No prompt provided for script generation"
                })

            logger.info("🤖 Calling OpenAI GPT-4 for script generation...")
            
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a creative scriptwriter for short promotional videos. Create engaging, professional scripts that are perfect for AI video generation. Keep scripts between 30-60 seconds when spoken."
                    },
                    {
                        "role": "user", 
                        "content": f"Write a compelling 45-second promotional video script about: {prompt}\n\nMake it engaging, professional, and suitable for AI video generation. Include a strong hook, clear value proposition, and call to action."
                    }
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            script = response.choices[0].message.content.strip()
            
            logger.info(f"✅ Script generated successfully: {len(script)} characters")
            logger.info(f"📄 Script preview: {script[:100]}...")
            
            return AgentOutput.from_dict({
                "video_script": script,
                "status": "completed",
                "agent": self.name
            })

        except Exception as e:
            logger.error(f"💥 Script generation failed: {str(e)}")
            return AgentOutput.from_dict({
                "video_script": "",
                "status": "error",
                "agent": self.name,
                "error": str(e)
            })
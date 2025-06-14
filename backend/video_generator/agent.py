import os
import requests
import logging
from typing import Dict, Any
from dotenv import load_dotenv
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

load_dotenv()
logger = logging.getLogger(__name__)

class VideoGeneratorAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Elai Video Generator"
        self.api_key = os.getenv("ELAI_API_KEY")
        self.base_url = "https://api.elai.io/api"
        logger.info("🎬 Elai VideoGeneratorAgent initialized")

    def get_input_keys(self) -> list:
        return ["video_script", "title"]

    def get_output_keys(self) -> list:
        return ["video_url", "video_id", "status", "error", "agent"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        script = input_data.get("video_script", "").strip()
        title = input_data.get("title", "AI Generated Video")

        if not self.api_key:
            return self._error("Elai API key not set.")

        if not script:
            return self._error("No script provided for video generation.")

        try:
            logger.info("📡 Sending script to Elai API...")
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "title": title,
                "script": script,
                "template": "default",  # Optional: customize with your Elai template name
            }

            response = requests.post(f"{self.base_url}/v1/videos", json=payload, headers=headers)
            data = response.json()

            if response.status_code == 201 and data.get("id"):
                return AgentOutput.from_dict({
                    "video_url": data.get("url", ""),
                    "video_id": data["id"],
                    "status": "processing",
                    "error": "",
                    "agent": self.name
                })
            else:
                return self._error(f"Elai API Error: {data.get('message', 'Unknown error')}")

        except Exception as e:
            return self._error(str(e))

    def _error(self, message: str) -> AgentOutput:
        logger.error(f"❌ {message}")
        return AgentOutput.from_dict({
            "video_url": "",
            "video_id": "",
            "status": "error",
            "error": message,
            "agent": self.name
        })

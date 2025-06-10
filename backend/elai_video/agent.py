import os
import requests
import time
from dotenv import load_dotenv
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

load_dotenv()

class ElaiVideoAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Elai Video Agent"
        self.api_key = os.getenv("ELAI_API_KEY")
        self.base_url = "https://apis.elai.io/api/v1"

    def get_input_keys(self) -> list:
        return ["text"]

    def get_output_keys(self) -> list:
        return ["video_url", "status", "video_id", "processing_time"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            text = input_data.get("text", "")
            
            if not text:
                return AgentOutput.from_dict({
                    "video_url": "",
                    "status": "error",
                    "error": "No text provided for video generation",
                    "agent": self.name
                })

            if not self.api_key:
                return AgentOutput.from_dict({
                    "video_url": "",
                    "status": "error",
                    "error": "ELAI_API_KEY not found in environment variables",
                    "agent": self.name
                })

            # Create video generation request
            video_response = self._create_video(text)
            
            if video_response.get("success"):
                video_id = video_response.get("video_id")
                
                # Poll for completion
                final_result = self._poll_video_status(video_id)
                
                return AgentOutput.from_dict({
                    "video_url": final_result.get("video_url", ""),
                    "status": final_result.get("status", "completed"),
                    "video_id": video_id,
                    "processing_time": final_result.get("processing_time", 0),
                    "agent": self.name
                })
            else:
                return AgentOutput.from_dict({
                    "video_url": "",
                    "status": "error",
                    "error": video_response.get("error", "Failed to create video"),
                    "agent": self.name
                })

        except Exception as e:
            return AgentOutput.from_dict({
                "video_url": "",
                "status": "error",
                "error": str(e),
                "agent": self.name
            })

    def _create_video(self, text: str) -> dict:
        """Create a video using Elai API"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Basic video creation payload
            payload = {
                "templateId": "default",  # You may need to adjust this based on available templates
                "script": text,
                "voice": {
                    "provider": "elai",
                    "voiceId": "en-US-1"  # Default English voice
                },
                "settings": {
                    "resolution": "1080p",
                    "format": "mp4"
                }
            }
            
            response = requests.post(
                f"{self.base_url}/videos",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 201 or response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "video_id": data.get("id") or data.get("videoId"),
                    "status": data.get("status", "processing")
                }
            else:
                return {
                    "success": False,
                    "error": f"API Error: {response.status_code} - {response.text}"
                }
                
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Request failed: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }

    def _poll_video_status(self, video_id: str, max_wait_time: int = 300) -> dict:
        """Poll video status until completion or timeout"""
        start_time = time.time()
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        while time.time() - start_time < max_wait_time:
            try:
                response = requests.get(
                    f"{self.base_url}/videos/{video_id}",
                    headers=headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    status = data.get("status", "processing")
                    
                    if status == "completed":
                        return {
                            "status": "completed",
                            "video_url": data.get("videoUrl") or data.get("url"),
                            "processing_time": int(time.time() - start_time)
                        }
                    elif status == "failed" or status == "error":
                        return {
                            "status": "error",
                            "error": data.get("error", "Video generation failed"),
                            "processing_time": int(time.time() - start_time)
                        }
                    
                    # Still processing, wait before next poll
                    time.sleep(10)
                else:
                    return {
                        "status": "error",
                        "error": f"Status check failed: {response.status_code}",
                        "processing_time": int(time.time() - start_time)
                    }
                    
            except Exception as e:
                return {
                    "status": "error",
                    "error": f"Status polling failed: {str(e)}",
                    "processing_time": int(time.time() - start_time)
                }
        
        # Timeout reached
        return {
            "status": "timeout",
            "error": "Video generation timed out",
            "processing_time": max_wait_time
        }

    def get_video_templates(self) -> list:
        """Get available video templates from Elai API"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.base_url}/templates",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json().get("templates", [])
            else:
                return []
                
        except Exception:
            return []

    def get_available_voices(self) -> list:
        """Get available voices from Elai API"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.base_url}/voices",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json().get("voices", [])
            else:
                return []
                
        except Exception:
            return []
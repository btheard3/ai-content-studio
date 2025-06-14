import os
import requests
import time
import logging
from typing import Dict, Any, Optional
from dotenv import load_dotenv
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

load_dotenv()
logger = logging.getLogger(__name__)

class ElaiVideoAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Elai Video Generator"
        self.api_key = os.getenv("ELAI_API_KEY")
        self.base_url = "https://apis.elai.io/api"
        logger.info("🎬 ElaiVideoAgent initialized")

    def get_input_keys(self) -> list:
        return ["text", "template_id", "voice_id", "title"]

    def get_output_keys(self) -> list:
        return ["video_url", "video_id", "status", "processing_time", "template_used", "voice_used", "demo_mode", "message"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        start_time = time.time()
        
        try:
            text = input_data.get("text", "").strip()
            title = input_data.get("title", "AI Generated Video")
            template_id = input_data.get("template_id")
            voice_id = input_data.get("voice_id")
            
            logger.info(f"🚀 Starting Elai video generation: {title}")
            logger.info(f"📝 Script length: {len(text)} characters")
            
            if not self.api_key:
                logger.error("❌ Elai API key not configured")
                return self._error("Elai API key not set. Please configure ELAI_API_KEY in environment variables.")

            if not text:
                logger.warning("❌ No script provided")
                return self._error("No script provided for video generation.")

            # Create video with Elai API
            video_data = self._create_video(text, title, template_id, voice_id)
            
            if not video_data:
                return self._error("Failed to create video with Elai API")
            
            video_id = video_data.get("id")
            if not video_id:
                return self._error("No video ID returned from Elai API")
            
            logger.info(f"✅ Video created with ID: {video_id}")
            
            # Poll for video completion
            video_url = self._poll_video_status(video_id)
            
            processing_time = time.time() - start_time
            
            if video_url:
                logger.info(f"🎉 Video generation completed in {processing_time:.2f} seconds")
                return AgentOutput.from_dict({
                    "video_url": video_url,
                    "video_id": video_id,
                    "status": "completed",
                    "processing_time": processing_time,
                    "template_used": template_id or "default",
                    "voice_used": voice_id or "default",
                    "demo_mode": False,
                    "message": "Video generated successfully with Elai.io",
                    "agent": self.name
                })
            else:
                return self._error("Video processing timed out or failed")
                
        except Exception as e:
            processing_time = time.time() - start_time
            logger.error(f"💥 Video generation failed after {processing_time:.2f} seconds: {str(e)}")
            return self._error(str(e))

    def _create_video(self, script: str, title: str, template_id: Optional[str] = None, voice_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Create a video using Elai API"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Updated payload to match Elai.io API requirements
            payload = {
                "name": title,  # Changed from "title" to "name"
                "script": script,
                "template": template_id or "default"  # Use template instead of template_id
            }
            
            # Add voice if provided
            if voice_id:
                payload["voice"] = voice_id
            
            logger.info(f"📡 Sending request to Elai API: {self.base_url}/v1/videos")
            logger.info(f"📦 Payload: {payload}")
            
            response = requests.post(
                f"{self.base_url}/v1/videos",
                json=payload,
                headers=headers,
                timeout=30
            )
            
            logger.info(f"📊 Response status: {response.status_code}")
            logger.info(f"📊 Response content: {response.text}")
            
            if response.status_code == 201:
                data = response.json()
                logger.info(f"✅ Video creation successful: {data}")
                return data
            elif response.status_code == 200:
                # Some APIs return 200 instead of 201
                data = response.json()
                logger.info(f"✅ Video creation successful: {data}")
                return data
            else:
                logger.error(f"❌ Elai API error: {response.status_code} - {response.text}")
                return None
                
        except requests.exceptions.Timeout:
            logger.error("⏰ Request to Elai API timed out")
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f"🌐 Network error: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"💥 Unexpected error creating video: {str(e)}")
            return None

    def _poll_video_status(self, video_id: str, max_attempts: int = 30, delay: int = 10) -> Optional[str]:
        """Poll Elai API until video is ready"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            logger.info(f"🔄 Starting to poll video status for ID: {video_id}")
            
            for attempt in range(max_attempts):
                logger.info(f"📡 Polling attempt {attempt + 1}/{max_attempts}")
                
                response = requests.get(
                    f"{self.base_url}/v1/videos/{video_id}",
                    headers=headers,
                    timeout=15
                )
                
                if response.status_code == 200:
                    data = response.json()
                    status = data.get("status", "").lower()
                    
                    logger.info(f"📊 Video status: {status}")
                    
                    if status == "completed":
                        video_url = data.get("video_url") or data.get("url") or data.get("download_url")
                        if video_url:
                            logger.info(f"🎉 Video ready: {video_url}")
                            return video_url
                        else:
                            logger.warning("⚠️ Video completed but no URL provided")
                    elif status in ["failed", "error"]:
                        logger.error(f"❌ Video generation failed with status: {status}")
                        return None
                    elif status in ["processing", "pending", "queued", "in_progress"]:
                        logger.info(f"⏳ Video still processing... waiting {delay} seconds")
                        time.sleep(delay)
                    else:
                        logger.warning(f"🤔 Unknown status: {status}")
                        time.sleep(delay)
                else:
                    logger.error(f"❌ Error polling video status: {response.status_code} - {response.text}")
                    time.sleep(delay)
            
            logger.warning(f"⏰ Polling timed out after {max_attempts} attempts")
            return None
            
        except Exception as e:
            logger.error(f"💥 Error polling video status: {str(e)}")
            return None

    def _error(self, message: str) -> AgentOutput:
        """Return error output"""
        logger.error(f"❌ {message}")
        return AgentOutput.from_dict({
            "video_url": "",
            "video_id": "",
            "status": "error",
            "processing_time": 0,
            "template_used": "",
            "voice_used": "",
            "demo_mode": False,
            "message": message,
            "error": message,
            "agent": self.name
        })

    def get_video_templates(self) -> list:
        """Get available video templates from Elai API"""
        try:
            if not self.api_key:
                return self._get_fallback_templates()
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.base_url}/v1/templates",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                templates = response.json()
                logger.info(f"📋 Retrieved {len(templates)} templates from Elai")
                return templates
            else:
                logger.warning(f"⚠️ Failed to get templates: {response.status_code}")
                return self._get_fallback_templates()
                
        except Exception as e:
            logger.error(f"❌ Error getting templates: {str(e)}")
            return self._get_fallback_templates()

    def get_available_voices(self) -> list:
        """Get available voices from Elai API"""
        try:
            if not self.api_key:
                return self._get_fallback_voices()
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.base_url}/v1/voices",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                voices = response.json()
                logger.info(f"🎤 Retrieved {len(voices)} voices from Elai")
                return voices
            else:
                logger.warning(f"⚠️ Failed to get voices: {response.status_code}")
                return self._get_fallback_voices()
                
        except Exception as e:
            logger.error(f"❌ Error getting voices: {str(e)}")
            return self._get_fallback_voices()

    def _get_fallback_templates(self) -> list:
        """Fallback templates when API is unavailable"""
        return [
            {"id": "default", "name": "Default Template", "description": "Standard video template"},
            {"id": "professional", "name": "Professional", "description": "Business presentation style"},
            {"id": "casual", "name": "Casual", "description": "Informal and friendly style"},
            {"id": "educational", "name": "Educational", "description": "Learning and tutorial style"}
        ]

    def _get_fallback_voices(self) -> list:
        """Fallback voices when API is unavailable"""
        return [
            {"id": "en-US-1", "name": "Sarah", "language": "English (US)", "gender": "Female"},
            {"id": "en-US-2", "name": "John", "language": "English (US)", "gender": "Male"},
            {"id": "en-GB-1", "name": "Emma", "language": "English (UK)", "gender": "Female"},
            {"id": "es-ES-1", "name": "Maria", "language": "Spanish", "gender": "Female"}
        ]

    def clear_cache(self):
        """Clear any cached data"""
        logger.info("🧹 Cache cleared for Elai Video Agent")
        pass
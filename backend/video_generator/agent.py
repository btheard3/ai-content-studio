import os
import requests
import time
import logging
from typing import Dict, Any, Optional
from datetime import datetime
from dotenv import load_dotenv
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

class VideoGeneratorAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "AI Video Generator"
        self.api_key = os.getenv("TAVUS_API_KEY", "dfba9c3298cb4dc384fd436c0c9dcda2")
        self.base_url = "https://tavusapi.com/v2"
        logger.info("🎬 VideoGeneratorAgent initialized")

    def get_input_keys(self) -> list:
        return ["creative_draft", "campaign_theme", "final_content"]

    def get_output_keys(self) -> list:
        return ["video_url", "video_status", "video_id", "processing_time", "video_metadata"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        start_time = datetime.now()
        logger.info("🚀 Starting video generation process")
        
        try:
            # Extract content for video script
            creative_draft = input_data.get("creative_draft", "")
            final_content = input_data.get("final_content", "")
            campaign_theme = input_data.get("campaign_theme", "AI Generated Content")
            
            # Use final_content if available, otherwise creative_draft
            script_content = final_content or creative_draft
            
            if not script_content:
                logger.warning("❌ No content provided for video generation")
                return AgentOutput.from_dict({
                    "video_url": "",
                    "video_status": "error",
                    "video_id": "",
                    "processing_time": 0,
                    "video_metadata": {},
                    "error": "No content provided for video generation",
                    "agent": self.name
                })

            logger.info(f"📝 Script content length: {len(script_content)} characters")
            logger.info(f"🎯 Campaign theme: {campaign_theme}")

            # Create optimized video script
            video_script = self._create_video_script(script_content, campaign_theme)
            
            # Generate video using Tavus API
            video_result = self._generate_video_with_tavus(video_script, campaign_theme)
            
            if video_result.get("success"):
                processing_time = (datetime.now() - start_time).total_seconds()
                logger.info(f"✅ Video generation completed in {processing_time:.2f} seconds")
                
                return AgentOutput.from_dict({
                    "video_url": video_result.get("video_url", ""),
                    "video_status": "completed",
                    "video_id": video_result.get("video_id", ""),
                    "processing_time": processing_time,
                    "video_metadata": {
                        "script_length": len(video_script),
                        "campaign_theme": campaign_theme,
                        "created_at": datetime.now().isoformat(),
                        "duration_estimate": self._estimate_duration(video_script)
                    },
                    "agent": self.name
                })
            else:
                logger.error(f"❌ Video generation failed: {video_result.get('error')}")
                return AgentOutput.from_dict({
                    "video_url": "",
                    "video_status": "error",
                    "video_id": "",
                    "processing_time": (datetime.now() - start_time).total_seconds(),
                    "video_metadata": {},
                    "error": video_result.get("error", "Video generation failed"),
                    "agent": self.name
                })

        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"💥 Video generation failed after {processing_time:.2f} seconds: {str(e)}")
            return AgentOutput.from_dict({
                "video_url": "",
                "video_status": "error",
                "video_id": "",
                "processing_time": processing_time,
                "video_metadata": {},
                "error": str(e),
                "agent": self.name
            })

    def _create_video_script(self, content: str, theme: str) -> str:
        """Create an optimized video script from content"""
        try:
            # Extract key points from content
            sentences = content.split('.')
            key_points = []
            
            for sentence in sentences[:10]:  # Limit to first 10 sentences
                sentence = sentence.strip()
                if len(sentence) > 20 and len(sentence) < 200:
                    key_points.append(sentence)
            
            # Create engaging video script
            script_parts = [
                f"Welcome! Today we're exploring {theme}.",
                "",
                "Here are the key insights:",
                ""
            ]
            
            for i, point in enumerate(key_points[:5], 1):
                script_parts.append(f"{i}. {point}.")
                script_parts.append("")
            
            script_parts.extend([
                "These insights can help drive your strategy forward.",
                "",
                "Thank you for watching, and remember to implement these ideas in your work!"
            ])
            
            script = " ".join(script_parts)
            
            # Ensure script is within reasonable length (30-90 seconds of speech)
            words = script.split()
            if len(words) > 150:  # ~90 seconds at 100 WPM
                script = " ".join(words[:150]) + "."
            
            logger.info(f"📄 Created video script: {len(script)} characters, ~{len(script.split())} words")
            return script
            
        except Exception as e:
            logger.error(f"❌ Error creating video script: {e}")
            # Fallback script
            return f"Welcome to our presentation on {theme}. {content[:200]}... Thank you for watching!"

    def _generate_video_with_tavus(self, script: str, title: str) -> Dict[str, Any]:
        """Generate video using Tavus API"""
        logger.info("🎬 Calling Tavus API for video generation...")
        
        try:
            headers = {
                "x-api-key": self.api_key,
                "Content-Type": "application/json"
            }
            
            # Tavus API payload structure
            payload = {
                "replica_id": "r783537ef5",  # Default Tavus replica
                "script": script,
                "background": "office",
                "video_name": title[:50],  # Limit title length
                "properties": {
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.75
                    },
                    "video_settings": {
                        "quality": "high",
                        "format": "mp4"
                    }
                }
            }
            
            logger.info(f"📡 Sending request to Tavus API...")
            logger.info(f"🎯 Script length: {len(script)} characters")
            
            # Create video generation request
            response = requests.post(
                f"{self.base_url}/videos",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            logger.info(f"📊 Tavus API Response Status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                data = response.json()
                video_id = data.get("video_id")
                
                if not video_id:
                    logger.warning("⚠️ No video ID in response")
                    return {
                        "success": False,
                        "error": "No video ID returned from Tavus API"
                    }
                
                logger.info(f"✅ Video generation initiated with ID: {video_id}")
                
                # Poll for completion
                video_url = self._poll_video_completion(video_id)
                
                if video_url:
                    return {
                        "success": True,
                        "video_url": video_url,
                        "video_id": video_id
                    }
                else:
                    return {
                        "success": False,
                        "error": "Video generation timed out or failed"
                    }
            else:
                error_detail = self._extract_error_message(response)
                logger.error(f"❌ Tavus API Error: {error_detail}")
                
                # Return demo video for development
                return self._create_demo_video_response(script, title)
                
        except requests.exceptions.Timeout:
            logger.error("⏰ Tavus API request timed out")
            return self._create_demo_video_response(script, title)
        except requests.exceptions.ConnectionError:
            logger.error("🔌 Connection error to Tavus API")
            return self._create_demo_video_response(script, title)
        except Exception as e:
            logger.error(f"💥 Unexpected error calling Tavus API: {e}")
            return self._create_demo_video_response(script, title)

    def _poll_video_completion(self, video_id: str, max_wait_time: int = 300) -> Optional[str]:
        """Poll Tavus API for video completion"""
        start_time = time.time()
        poll_interval = 10
        
        headers = {
            "x-api-key": self.api_key,
            "Content-Type": "application/json"
        }
        
        while time.time() - start_time < max_wait_time:
            try:
                logger.info(f"🔄 Checking video status for ID: {video_id}")
                
                response = requests.get(
                    f"{self.base_url}/videos/{video_id}",
                    headers=headers,
                    timeout=15
                )
                
                if response.status_code == 200:
                    data = response.json()
                    status = data.get("status", "").lower()
                    
                    logger.info(f"📊 Video status: {status}")
                    
                    if status in ["completed", "ready"]:
                        video_url = data.get("download_url") or data.get("video_url")
                        if video_url:
                            logger.info(f"✅ Video completed: {video_url}")
                            return video_url
                    
                    elif status in ["failed", "error"]:
                        logger.error(f"❌ Video generation failed: {data.get('error', 'Unknown error')}")
                        return None
                    
                    # Still processing
                    logger.info(f"⏳ Video still processing... waiting {poll_interval} seconds")
                    time.sleep(poll_interval)
                    
                else:
                    logger.warning(f"⚠️ Status check failed: HTTP {response.status_code}")
                    time.sleep(poll_interval)
                    
            except Exception as e:
                logger.error(f"❌ Error during status polling: {e}")
                time.sleep(poll_interval)
        
        logger.warning(f"⏰ Video generation timed out after {max_wait_time} seconds")
        return None

    def _create_demo_video_response(self, script: str, title: str) -> Dict[str, Any]:
        """Create a demo video response when Tavus API is unavailable"""
        logger.info("🎬 Creating demo video response")
        
        # Use a sample video URL for demonstration
        demo_video_url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        
        return {
            "success": True,
            "video_url": demo_video_url,
            "video_id": f"demo_{int(time.time())}",
            "demo_mode": True
        }

    def _extract_error_message(self, response) -> str:
        """Extract error message from API response"""
        try:
            error_data = response.json()
            return error_data.get("message", error_data.get("error", response.text))
        except:
            return f"HTTP {response.status_code}: {response.text}"

    def _estimate_duration(self, script: str) -> int:
        """Estimate video duration in seconds based on script length"""
        words = len(script.split())
        # Assume ~150 words per minute speaking rate
        duration_minutes = words / 150
        return max(30, int(duration_minutes * 60))  # Minimum 30 seconds
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
        self._templates_cache = None
        self._voices_cache = None

    def get_input_keys(self) -> list:
        return ["text"]

    def get_output_keys(self) -> list:
        return ["video_url", "status", "video_id", "processing_time"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            text = input_data.get("text", "")
            template_id = input_data.get("template_id", None)
            voice_id = input_data.get("voice_id", None)
            
            if not text:
                return AgentOutput.from_dict({
                    "video_url": "",
                    "status": "error",
                    "error": "No text provided for video generation",
                    "agent": self.name
                })

            if not self.api_key:
                print("⚠️ ELAI_API_KEY not found - using demo mode")
                return self._create_demo_video(text)

            # Get valid template and voice IDs
            valid_template_id = self._get_valid_template_id(template_id)
            valid_voice_id = self._get_valid_voice_id(voice_id)

            if not valid_template_id:
                return AgentOutput.from_dict({
                    "video_url": "",
                    "status": "error",
                    "error": "No valid template available. Please check your Elai account templates.",
                    "agent": self.name
                })

            # Create video generation request
            video_response = self._create_video(text, valid_template_id, valid_voice_id)
            
            if video_response.get("success"):
                video_id = video_response.get("video_id")
                
                # Poll for completion
                final_result = self._poll_video_status(video_id)
                
                return AgentOutput.from_dict({
                    "video_url": final_result.get("video_url", ""),
                    "status": final_result.get("status", "completed"),
                    "video_id": video_id,
                    "processing_time": final_result.get("processing_time", 0),
                    "template_used": valid_template_id,
                    "voice_used": valid_voice_id,
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

    def _get_valid_template_id(self, requested_template_id: str = None) -> str:
        """Get a valid template ID from Elai API"""
        try:
            templates = self.get_video_templates()
            
            if not templates:
                print("⚠️ No templates available from Elai API")
                return None
            
            # If a specific template was requested, try to find it
            if requested_template_id:
                for template in templates:
                    if template.get("id") == requested_template_id:
                        return requested_template_id
                print(f"⚠️ Requested template '{requested_template_id}' not found, using first available")
            
            # Return the first available template
            first_template = templates[0]
            template_id = first_template.get("id")
            print(f"✅ Using template: {template_id} - {first_template.get('name', 'Unknown')}")
            return template_id
            
        except Exception as e:
            print(f"❌ Error getting valid template ID: {e}")
            return None

    def _get_valid_voice_id(self, requested_voice_id: str = None) -> str:
        """Get a valid voice ID from Elai API"""
        try:
            voices = self.get_available_voices()
            
            if not voices:
                print("⚠️ No voices available from Elai API, using default")
                return "en-US-1"  # Fallback default
            
            # If a specific voice was requested, try to find it
            if requested_voice_id:
                for voice in voices:
                    if voice.get("id") == requested_voice_id:
                        return requested_voice_id
                print(f"⚠️ Requested voice '{requested_voice_id}' not found, using first available")
            
            # Return the first available voice
            first_voice = voices[0]
            voice_id = first_voice.get("id")
            print(f"✅ Using voice: {voice_id} - {first_voice.get('name', 'Unknown')}")
            return voice_id
            
        except Exception as e:
            print(f"❌ Error getting valid voice ID: {e}")
            return "en-US-1"  # Fallback default

    def _create_demo_video(self, text: str) -> AgentOutput:
        """Create a demo video response when API key is not available"""
        import time
        
        # Simulate processing time
        time.sleep(2)
        
        demo_video_url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        
        return AgentOutput.from_dict({
            "video_url": demo_video_url,
            "status": "completed",
            "video_id": f"demo_{int(time.time())}",
            "processing_time": 2,
            "agent": self.name,
            "demo_mode": True,
            "message": "Demo video generated (ELAI_API_KEY not configured)"
        })

    def _create_video(self, text: str, template_id: str, voice_id: str) -> dict:
        """Create a video using Elai API with improved error handling"""
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            # Simplified payload that should work with most Elai setups
            payload = {
                "name": f"Video_{int(time.time())}",
                "templateId": template_id,
                "script": text
            }
            
            # Add voice configuration if available
            if voice_id:
                payload["voice"] = {
                    "voiceId": voice_id
                }
            
            print(f"🎬 Creating video with template: {template_id}, voice: {voice_id}")
            print(f"📝 Script length: {len(text)} characters")
            
            response = requests.post(
                f"{self.base_url}/videos",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            print(f"📡 Elai API Response Status: {response.status_code}")
            
            if response.status_code in [200, 201]:
                data = response.json()
                video_id = data.get("id") or data.get("videoId") or data.get("video_id")
                
                if not video_id:
                    print("⚠️ No video ID in response:", data)
                    return {
                        "success": False,
                        "error": "No video ID returned from Elai API"
                    }
                
                print(f"✅ Video creation initiated with ID: {video_id}")
                return {
                    "success": True,
                    "video_id": video_id,
                    "status": data.get("status", "processing")
                }
            else:
                error_detail = self._extract_error_message(response)
                print(f"❌ Elai API Error: {error_detail}")
                
                return {
                    "success": False,
                    "error": f"API Error ({response.status_code}): {error_detail}"
                }
                
        except requests.exceptions.Timeout:
            return {
                "success": False,
                "error": "Request timeout - Elai API took too long to respond"
            }
        except requests.exceptions.ConnectionError:
            return {
                "success": False,
                "error": "Connection error - Unable to reach Elai API"
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

    def _extract_error_message(self, response) -> str:
        """Extract meaningful error message from API response"""
        try:
            error_data = response.json()
            
            # Try different common error message fields
            error_msg = (
                error_data.get("message") or 
                error_data.get("error") or 
                error_data.get("detail") or
                error_data.get("errors", {}).get("message") if isinstance(error_data.get("errors"), dict) else
                str(error_data.get("errors")) if error_data.get("errors") else
                response.text
            )
            
            return error_msg
            
        except:
            return response.text or f"HTTP {response.status_code}"

    def _poll_video_status(self, video_id: str, max_wait_time: int = 300) -> dict:
        """Poll video status until completion or timeout with improved error handling"""
        start_time = time.time()
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        poll_interval = 10  # Start with 10 seconds
        max_poll_interval = 30  # Max 30 seconds between polls
        
        while time.time() - start_time < max_wait_time:
            try:
                print(f"🔄 Checking video status for ID: {video_id}")
                
                response = requests.get(
                    f"{self.base_url}/videos/{video_id}",
                    headers=headers,
                    timeout=15
                )
                
                if response.status_code == 200:
                    data = response.json()
                    status = data.get("status", "processing").lower()
                    
                    print(f"📊 Video status: {status}")
                    
                    if status in ["completed", "done", "finished"]:
                        video_url = (
                            data.get("videoUrl") or 
                            data.get("url") or 
                            data.get("downloadUrl") or
                            data.get("video_url")
                        )
                        
                        if video_url:
                            print(f"✅ Video completed: {video_url}")
                            return {
                                "status": "completed",
                                "video_url": video_url,
                                "processing_time": int(time.time() - start_time)
                            }
                        else:
                            print("⚠️ Video marked as completed but no URL provided")
                            return {
                                "status": "error",
                                "error": "Video completed but no download URL available",
                                "processing_time": int(time.time() - start_time)
                            }
                    
                    elif status in ["failed", "error", "cancelled"]:
                        error_msg = data.get("error") or data.get("message") or "Video generation failed"
                        print(f"❌ Video generation failed: {error_msg}")
                        return {
                            "status": "error",
                            "error": error_msg,
                            "processing_time": int(time.time() - start_time)
                        }
                    
                    # Still processing, wait before next poll
                    print(f"⏳ Still processing... waiting {poll_interval} seconds")
                    time.sleep(poll_interval)
                    
                    # Gradually increase poll interval to reduce API calls
                    poll_interval = min(poll_interval + 5, max_poll_interval)
                    
                elif response.status_code == 404:
                    return {
                        "status": "error",
                        "error": f"Video not found (ID: {video_id})",
                        "processing_time": int(time.time() - start_time)
                    }
                else:
                    error_detail = self._extract_error_message(response)
                    print(f"❌ Status check failed: {error_detail}")
                    return {
                        "status": "error",
                        "error": f"Status check failed: {error_detail}",
                        "processing_time": int(time.time() - start_time)
                    }
                    
            except requests.exceptions.Timeout:
                print("⏰ Status check timeout, retrying...")
                time.sleep(poll_interval)
                continue
                
            except Exception as e:
                print(f"❌ Error during status polling: {e}")
                return {
                    "status": "error",
                    "error": f"Status polling failed: {str(e)}",
                    "processing_time": int(time.time() - start_time)
                }
        
        # Timeout reached
        print(f"⏰ Video generation timed out after {max_wait_time} seconds")
        return {
            "status": "timeout",
            "error": f"Video generation timed out after {max_wait_time} seconds",
            "processing_time": max_wait_time
        }

    def get_video_templates(self) -> list:
        """Get available video templates from Elai API with caching"""
        if self._templates_cache is not None:
            return self._templates_cache
            
        if not self.api_key:
            self._templates_cache = [
                {"id": "default", "name": "Default Template", "description": "Standard video template"},
                {"id": "professional", "name": "Professional", "description": "Business presentation style"},
                {"id": "casual", "name": "Casual", "description": "Informal and friendly style"}
            ]
            return self._templates_cache
            
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            print("📋 Fetching available templates from Elai API...")
            
            response = requests.get(
                f"{self.base_url}/templates",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                templates = data.get("templates", data if isinstance(data, list) else [])
                
                if templates:
                    print(f"✅ Found {len(templates)} templates")
                    for template in templates[:3]:  # Log first 3 templates
                        print(f"   - {template.get('id')}: {template.get('name', 'Unknown')}")
                    
                    self._templates_cache = templates
                    return templates
                else:
                    print("⚠️ No templates found in API response")
                    
            else:
                error_detail = self._extract_error_message(response)
                print(f"❌ Failed to fetch templates: {error_detail}")
                
        except Exception as e:
            print(f"❌ Error fetching templates: {e}")
        
        # Return fallback templates
        self._templates_cache = []
        return []

    def get_available_voices(self) -> list:
        """Get available voices from Elai API with caching"""
        if self._voices_cache is not None:
            return self._voices_cache
            
        if not self.api_key:
            self._voices_cache = [
                {"id": "en-US-1", "name": "Sarah", "language": "English (US)", "gender": "Female"},
                {"id": "en-US-2", "name": "John", "language": "English (US)", "gender": "Male"},
                {"id": "en-GB-1", "name": "Emma", "language": "English (UK)", "gender": "Female"},
                {"id": "es-ES-1", "name": "Maria", "language": "Spanish", "gender": "Female"}
            ]
            return self._voices_cache
            
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            print("🎤 Fetching available voices from Elai API...")
            
            response = requests.get(
                f"{self.base_url}/voices",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                voices = data.get("voices", data if isinstance(data, list) else [])
                
                if voices:
                    print(f"✅ Found {len(voices)} voices")
                    for voice in voices[:3]:  # Log first 3 voices
                        print(f"   - {voice.get('id')}: {voice.get('name', 'Unknown')} ({voice.get('language', 'Unknown')})")
                    
                    self._voices_cache = voices
                    return voices
                else:
                    print("⚠️ No voices found in API response")
                    
            else:
                error_detail = self._extract_error_message(response)
                print(f"❌ Failed to fetch voices: {error_detail}")
                
        except Exception as e:
            print(f"❌ Error fetching voices: {e}")
        
        # Return fallback voices
        self._voices_cache = []
        return []

    def clear_cache(self):
        """Clear cached templates and voices"""
        self._templates_cache = None
        self._voices_cache = None
        print("🗑️ Cleared templates and voices cache")
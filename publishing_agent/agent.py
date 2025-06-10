import os
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class PublishingAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Publishing Agent"

    def get_input_keys(self) -> list:
        return ["final_content", "campaign_theme"]

    def get_output_keys(self) -> list:
        return ["published_status", "distribution_channels", "publication_metadata"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            final_content = input_data.get("final_content", "")
            campaign_theme = input_data.get("campaign_theme", "Content Campaign")
            
            if not final_content:
                return AgentOutput.from_dict({
                    "published_status": "Failed - No content to publish",
                    "distribution_channels": [],
                    "publication_metadata": {
                        "timestamp": datetime.utcnow().isoformat() + "Z",
                        "word_count": 0,
                        "campaign": campaign_theme,
                        "error": "No content provided"
                    },
                    "status": "error",
                    "agent": "Publishing Agent"
                })

            word_count = len(final_content.split())
            timestamp = datetime.utcnow().isoformat() + "Z"

            # Use AI to determine optimal distribution channels
            system_prompt = (
                "You are a digital marketing and content distribution expert. "
                "Based on the content type, theme, and characteristics, recommend the best "
                "distribution channels and publishing strategy. Consider content length, "
                "target audience, and content format."
            )

            user_prompt = f"""
Content Theme: {campaign_theme}
Word Count: {word_count}
Content Preview: {final_content[:300]}...

Recommend 3-5 optimal distribution channels for this content.
Consider: LinkedIn, Medium, Company Blog, Newsletter, Twitter, Facebook, Instagram, YouTube, etc.

Respond with just the channel names, separated by commas.
"""

            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.5,
                    max_tokens=100
                )

                ai_channels = response.choices[0].message.content.strip()
                distribution_channels = [channel.strip() for channel in ai_channels.split(',')]
                
            except Exception as e:
                # Fallback channels based on content characteristics
                distribution_channels = self._get_fallback_channels(final_content, word_count)

            # Simulate publishing process
            published_status = "Successfully published to all channels"
            
            publication_metadata = {
                "timestamp": timestamp,
                "word_count": word_count,
                "campaign": campaign_theme,
                "content_type": self._determine_content_type(final_content),
                "estimated_read_time": max(1, word_count // 200),  # Reading time in minutes
                "seo_score": self._calculate_seo_score(final_content),
                "engagement_prediction": "High" if word_count > 500 else "Medium"
            }

            return AgentOutput.from_dict({
                "published_status": published_status,
                "distribution_channels": distribution_channels,
                "publication_metadata": publication_metadata,
                "status": "completed",
                "agent": "Publishing Agent"
            })

        except Exception as e:
            return AgentOutput.from_dict({
                "published_status": f"Publishing failed: {str(e)}",
                "distribution_channels": ["Error - No channels available"],
                "publication_metadata": {
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "word_count": 0,
                    "campaign": campaign_theme,
                    "error": str(e)
                },
                "status": "error",
                "agent": "Publishing Agent",
                "error": str(e)
            })

    def _get_fallback_channels(self, content: str, word_count: int) -> list:
        """Determine fallback distribution channels based on content characteristics"""
        channels = []
        
        # Base channels for most content
        channels.extend(["Company Blog", "LinkedIn"])
        
        # Add channels based on word count
        if word_count > 1000:
            channels.append("Medium")
        
        if word_count < 500:
            channels.extend(["Twitter", "Facebook"])
        
        # Add newsletter for substantial content
        if word_count > 300:
            channels.append("Email Newsletter")
        
        return channels[:5]  # Limit to 5 channels

    def _determine_content_type(self, content: str) -> str:
        """Determine content type based on content characteristics"""
        content_lower = content.lower()
        
        if any(word in content_lower for word in ['guide', 'how to', 'tutorial', 'step']):
            return "Guide"
        elif any(word in content_lower for word in ['analysis', 'research', 'study', 'data']):
            return "Analysis"
        elif any(word in content_lower for word in ['news', 'update', 'announcement']):
            return "News"
        elif any(word in content_lower for word in ['opinion', 'think', 'believe', 'perspective']):
            return "Opinion"
        else:
            return "Article"

    def _calculate_seo_score(self, content: str) -> int:
        """Calculate a basic SEO score based on content characteristics"""
        score = 50  # Base score
        
        # Check for good length
        word_count = len(content.split())
        if 300 <= word_count <= 2000:
            score += 20
        
        # Check for headings (simple heuristic)
        if any(line.strip().startswith('#') for line in content.split('\n')):
            score += 15
        
        # Check for good structure (paragraphs)
        paragraphs = content.split('\n\n')
        if len(paragraphs) >= 3:
            score += 15
        
        return min(100, score)
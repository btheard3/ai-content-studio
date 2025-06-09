from datetime import datetime, timedelta
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

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

            # Simulate publishing process
            publication_time = datetime.now()
            
            # Define distribution channels
            distribution_channels = [
                {
                    "platform": "Company Blog",
                    "status": "published",
                    "url": "https://company.com/blog/strategic-content-guide",
                    "scheduled_time": publication_time.isoformat()
                },
                {
                    "platform": "LinkedIn",
                    "status": "scheduled",
                    "url": "https://linkedin.com/company/posts/123456",
                    "scheduled_time": (publication_time + timedelta(hours=2)).isoformat()
                },
                {
                    "platform": "Twitter",
                    "status": "scheduled",
                    "url": "https://twitter.com/company/status/123456",
                    "scheduled_time": (publication_time + timedelta(hours=4)).isoformat()
                },
                {
                    "platform": "Email Newsletter",
                    "status": "scheduled",
                    "url": "internal://newsletter/campaign/456",
                    "scheduled_time": (publication_time + timedelta(days=1)).isoformat()
                }
            ]

            # Generate publication metadata
            publication_metadata = {
                "content_id": f"content_{int(publication_time.timestamp())}",
                "title": f"Strategic Guide: {campaign_theme}",
                "publication_date": publication_time.isoformat(),
                "content_type": "strategic_guide",
                "word_count": len(final_content.split()),
                "estimated_reading_time": max(1, len(final_content.split()) // 200),
                "seo_keywords": [
                    campaign_theme.lower(),
                    "strategy",
                    "business guide",
                    "implementation"
                ],
                "tags": ["strategy", "business", "guide", "content"],
                "author": "AI Content Studio",
                "status": "published",
                "analytics_tracking": {
                    "google_analytics": "enabled",
                    "social_tracking": "enabled",
                    "conversion_tracking": "enabled"
                }
            }

            # Create publishing summary
            published_status = f"""
✅ Content Successfully Published!

📊 Publication Summary:
• Title: {publication_metadata['title']}
• Published: {publication_time.strftime('%Y-%m-%d %H:%M:%S')}
• Word Count: {publication_metadata['word_count']} words
• Reading Time: ~{publication_metadata['estimated_reading_time']} minutes

🚀 Distribution Status:
• Blog: Published immediately
• LinkedIn: Scheduled for {(publication_time + timedelta(hours=2)).strftime('%H:%M')}
• Twitter: Scheduled for {(publication_time + timedelta(hours=4)).strftime('%H:%M')}
• Newsletter: Scheduled for tomorrow

📈 Tracking & Analytics:
• Google Analytics: Active
• Social Media Tracking: Enabled
• Conversion Tracking: Configured

🎯 Next Steps:
• Monitor engagement metrics
• Respond to comments and shares
• Analyze performance after 24-48 hours
• Plan follow-up content based on results
"""

            return AgentOutput.from_dict({
                "published_status": published_status,
                "distribution_channels": distribution_channels,
                "publication_metadata": publication_metadata,
                "status": "completed",
                "agent": "Publishing Agent"
            })

        except Exception as e:
            return AgentOutput.from_dict({
                "published_status": f"[ERROR] Publishing failed: {str(e)}",
                "distribution_channels": [],
                "publication_metadata": {"error": "Publishing failed"},
                "status": "error",
                "agent": "Publishing Agent",
                "error": str(e)
            })
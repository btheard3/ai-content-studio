import random
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

class ResearchDataAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Research & Data Agent"

    def get_input_keys(self) -> list:
        return ["content_roadmap", "campaign_theme"]

    def get_output_keys(self) -> list:
        return ["research_summary", "trending_topics", "statistics"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            content_roadmap = input_data.get("content_roadmap", "")
            campaign_theme = input_data.get("campaign_theme", "General Content")
            
            # Mock research data generation (in a real implementation, this would call APIs)
            trending_topics = [
                "AI and Machine Learning trends",
                "Sustainable business practices",
                "Remote work optimization",
                "Digital transformation strategies",
                "Customer experience innovation"
            ]
            
            # Generate mock statistics
            statistics = {
                "market_size": f"${random.randint(10, 500)}B market opportunity",
                "growth_rate": f"{random.randint(15, 45)}% YoY growth",
                "engagement_rate": f"{random.randint(3, 12)}% average engagement",
                "conversion_potential": f"{random.randint(2, 8)}% conversion rate",
                "audience_size": f"{random.randint(100, 900)}M potential reach"
            }
            
            # Generate research summary
            research_summary = f"""
Research Summary for: {campaign_theme}

Key Findings:
• Market shows strong growth potential with {statistics['growth_rate']} growth
• Target audience size estimated at {statistics['audience_size']} users
• Current engagement rates average {statistics['engagement_rate']} in this space
• Conversion opportunities around {statistics['conversion_potential']}

Trending Topics Analysis:
{chr(10).join([f"• {topic}" for topic in trending_topics[:3]])}

Competitive Landscape:
• High competition in traditional channels
• Emerging opportunities in video and interactive content
• Voice search optimization becoming critical
• Mobile-first approach essential

Recommendations:
• Focus on authentic storytelling
• Leverage user-generated content
• Implement data-driven personalization
• Optimize for multiple content formats

Data Sources: Industry reports, social media analytics, search trends, competitor analysis
"""

            return AgentOutput.from_dict({
                "research_summary": research_summary,
                "trending_topics": trending_topics,
                "statistics": statistics,
                "status": "completed",
                "agent": "Research & Data Agent"
            })

        except Exception as e:
            return AgentOutput.from_dict({
                "research_summary": f"[ERROR] Research data collection failed: {str(e)}",
                "trending_topics": ["Error in research"],
                "statistics": {"error": "Data collection failed"},
                "status": "error",
                "agent": "Research & Data Agent",
                "error": str(e)
            })
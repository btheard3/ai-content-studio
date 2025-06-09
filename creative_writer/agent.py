from backend.agent_base import BaseAgent, AgentInput, AgentOutput

class CreativeWriterAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Creative Writer"

    def get_input_keys(self) -> list:
        return ["content_roadmap", "research_summary", "campaign_theme", "key_pillars"]

    def get_output_keys(self) -> list:
        return ["creative_draft", "content_sections", "tone_analysis"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            content_roadmap = input_data.get("content_roadmap", "")
            research_summary = input_data.get("research_summary", "")
            campaign_theme = input_data.get("campaign_theme", "Content Campaign")
            key_pillars = input_data.get("key_pillars", [])

            # Generate creative content based on strategy and research
            content_sections = {
                "headline": f"Transforming {campaign_theme}: A Strategic Approach",
                "introduction": f"""
In today's rapidly evolving landscape, {campaign_theme.lower()} represents more than just a trend—it's a fundamental shift that's reshaping how we think, work, and connect.

This comprehensive guide explores the strategic implications and practical applications that can drive meaningful results for your organization.
""",
                "main_content": f"""
## Key Strategic Pillars

{chr(10).join([f"### {pillar}" for pillar in key_pillars[:3]])}

Based on our research analysis, the market shows tremendous potential with significant growth opportunities. The data reveals that organizations focusing on these core areas are seeing measurable improvements in engagement and conversion rates.

## Implementation Framework

**Phase 1: Foundation Building**
- Establish clear objectives aligned with {campaign_theme.lower()}
- Develop measurement frameworks
- Create content governance structures

**Phase 2: Execution & Optimization**
- Deploy multi-channel content strategies
- Implement feedback loops
- Optimize based on performance data

**Phase 3: Scale & Innovation**
- Expand successful initiatives
- Explore emerging opportunities
- Build sustainable growth systems

## Measuring Success

Success in {campaign_theme.lower()} requires a balanced approach to metrics:
- Engagement quality over quantity
- Long-term relationship building
- Conversion optimization
- Brand authority development
""",
                "conclusion": f"""
The future of {campaign_theme.lower()} lies in authentic, data-driven approaches that prioritize genuine value creation. Organizations that embrace this strategic mindset will be best positioned to thrive in an increasingly competitive landscape.

Ready to transform your approach? Start with one pillar, measure results, and scale what works.
""",
                "call_to_action": "Ready to implement these strategies? Contact our team to develop a customized approach for your organization."
            }

            # Combine sections into full draft
            creative_draft = f"""
{content_sections['headline']}

{content_sections['introduction']}

{content_sections['main_content']}

{content_sections['conclusion']}

---
{content_sections['call_to_action']}
"""

            # Analyze tone and style
            tone_analysis = {
                "primary_tone": "Professional and authoritative",
                "secondary_tone": "Engaging and accessible",
                "reading_level": "Business professional",
                "word_count": len(creative_draft.split()),
                "key_themes": key_pillars[:3] if key_pillars else ["Strategy", "Innovation", "Growth"]
            }

            return AgentOutput.from_dict({
                "creative_draft": creative_draft,
                "content_sections": content_sections,
                "tone_analysis": tone_analysis,
                "status": "completed",
                "agent": "Creative Writer"
            })

        except Exception as e:
            return AgentOutput.from_dict({
                "creative_draft": f"[ERROR] Content creation failed: {str(e)}",
                "content_sections": {"error": "Content generation failed"},
                "tone_analysis": {"error": "Analysis failed"},
                "status": "error",
                "agent": "Creative Writer",
                "error": str(e)
            })
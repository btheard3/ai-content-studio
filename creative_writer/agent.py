import os
from dotenv import load_dotenv
from openai import OpenAI
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
            # Extract input data
            campaign_theme = input_data.get("campaign_theme", "")
            key_pillars = input_data.get("key_pillars", [])
            research_summary = input_data.get("research_summary", "")
            content_roadmap = input_data.get("content_roadmap", "")

            # Create comprehensive prompt for creative writing
            prompt = f"""
You are an expert creative writer tasked with creating engaging, high-quality content based on the following inputs:

Campaign Theme: {campaign_theme}
Key Message Pillars: {', '.join(key_pillars) if isinstance(key_pillars, list) else str(key_pillars)}
Research Summary: {research_summary}
Content Roadmap: {content_roadmap}

Please create a comprehensive creative piece that includes:

1. CREATIVE DRAFT (300-500 words):
Write an engaging, well-structured piece of content that incorporates the campaign theme and key pillars. Make it compelling, informative, and actionable. Use storytelling techniques, vivid language, and clear structure.

2. CONTENT SECTIONS:
Break down the content into structured sections with clear headings and purposes:
- Introduction/Hook
- Main Body Points (2-3 key sections)
- Supporting Evidence/Examples
- Call to Action/Conclusion

3. TONE ANALYSIS:
Analyze the writing style and tone used:
- Primary tone (e.g., professional, conversational, authoritative)
- Target audience level
- Emotional appeal used
- Writing techniques employed
- Readability assessment

Format your response as follows:
CREATIVE_DRAFT:
[Your main creative content here]

CONTENT_SECTIONS:
[Structured breakdown of the content sections]

TONE_ANALYSIS:
[Analysis of the writing style and tone]
"""

            # Generate content using OpenAI
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a professional creative writer specializing in business content, marketing copy, and strategic communications. You create engaging, well-structured content that resonates with target audiences."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500,
            )

            content = response.choices[0].message.content
            
            # Parse the structured response
            creative_draft, content_sections, tone_analysis = self._parse_response(content)

            return AgentOutput.from_dict({
                "creative_draft": creative_draft,
                "content_sections": content_sections,
                "tone_analysis": tone_analysis,
                "status": "completed",
                "agent": "Creative Writer"
            })

        except Exception as e:
            # Provide fallback content in case of errors
            fallback_draft = self._create_fallback_content(input_data)
            
            return AgentOutput.from_dict({
                "creative_draft": fallback_draft,
                "content_sections": "Error occurred during content section generation. Please try again.",
                "tone_analysis": "Unable to analyze tone due to processing error.",
                "status": "error",
                "agent": "Creative Writer",
                "error": str(e)
            })

    def _parse_response(self, content: str) -> tuple:
        """Parse the AI response into structured components"""
        try:
            # Split content by section markers
            sections = content.split("CREATIVE_DRAFT:")
            if len(sections) > 1:
                remaining = sections[1]
                
                # Extract creative draft
                content_split = remaining.split("CONTENT_SECTIONS:")
                creative_draft = content_split[0].strip()
                
                if len(content_split) > 1:
                    remaining = content_split[1]
                    
                    # Extract content sections and tone analysis
                    tone_split = remaining.split("TONE_ANALYSIS:")
                    content_sections = tone_split[0].strip()
                    tone_analysis = tone_split[1].strip() if len(tone_split) > 1 else "Tone analysis not available."
                else:
                    content_sections = "Content sections not available."
                    tone_analysis = "Tone analysis not available."
            else:
                # Fallback if parsing fails
                creative_draft = content[:500] + "..." if len(content) > 500 else content
                content_sections = "Content sections not available."
                tone_analysis = "Tone analysis not available."
                
            return creative_draft, content_sections, tone_analysis
            
        except Exception as e:
            return (
                "Error parsing creative content. Please try again.",
                "Content sections unavailable due to parsing error.",
                "Tone analysis unavailable due to parsing error."
            )

    def _create_fallback_content(self, input_data: AgentInput) -> str:
        """Create fallback content when AI generation fails"""
        campaign_theme = input_data.get("campaign_theme", "Strategic Content")
        
        return f"""
# {campaign_theme}: A Strategic Approach

In today's rapidly evolving business landscape, organizations must adapt and innovate to stay competitive. This strategic guide explores key insights and actionable recommendations for success.

## Key Insights

Our research reveals several critical factors that drive success in modern business environments. These insights form the foundation for strategic decision-making and long-term growth.

## Strategic Recommendations

1. **Focus on Innovation**: Embrace new technologies and methodologies
2. **Customer-Centric Approach**: Prioritize customer needs and experiences
3. **Data-Driven Decisions**: Leverage analytics for informed choices
4. **Agile Implementation**: Maintain flexibility in execution

## Conclusion

By implementing these strategic approaches, organizations can position themselves for sustained success and growth in an increasingly competitive marketplace.

*Note: This is fallback content generated due to a processing error. Please try regenerating for enhanced results.*
"""
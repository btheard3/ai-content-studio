import os
import re
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

Format your response EXACTLY as follows:

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
                        "content": "You are a professional creative writer specializing in business content, marketing copy, and strategic communications. You create engaging, well-structured content that resonates with target audiences. Always follow the exact format requested with clear section markers."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500,
            )

            content = response.choices[0].message.content
            
            # Parse the structured response using regex
            creative_draft, content_sections, tone_analysis = self._parse_response_with_regex(content)

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

    def _parse_response_with_regex(self, content: str) -> tuple:
        """Parse the AI response using regex patterns for robust extraction"""
        try:
            # Define regex patterns for each section
            creative_draft_pattern = r'CREATIVE_DRAFT:\s*(.*?)(?=CONTENT_SECTIONS:|$)'
            content_sections_pattern = r'CONTENT_SECTIONS:\s*(.*?)(?=TONE_ANALYSIS:|$)'
            tone_analysis_pattern = r'TONE_ANALYSIS:\s*(.*?)$'
            
            # Extract creative draft
            creative_match = re.search(creative_draft_pattern, content, re.DOTALL | re.IGNORECASE)
            creative_draft = creative_match.group(1).strip() if creative_match else self._extract_fallback_draft(content)
            
            # Extract content sections
            sections_match = re.search(content_sections_pattern, content, re.DOTALL | re.IGNORECASE)
            content_sections = sections_match.group(1).strip() if sections_match else self._generate_fallback_sections(creative_draft)
            
            # Extract tone analysis
            tone_match = re.search(tone_analysis_pattern, content, re.DOTALL | re.IGNORECASE)
            tone_analysis = tone_match.group(1).strip() if tone_match else self._generate_fallback_tone_analysis(creative_draft)
            
            # Validate and clean up extracted content
            creative_draft = self._clean_content(creative_draft)
            content_sections = self._clean_content(content_sections)
            tone_analysis = self._clean_content(tone_analysis)
            
            return creative_draft, content_sections, tone_analysis
            
        except Exception as e:
            print(f"Regex parsing error: {e}")
            return self._fallback_parsing(content)

    def _extract_fallback_draft(self, content: str) -> str:
        """Extract creative draft when regex fails"""
        # Try to find the first substantial paragraph
        lines = content.split('\n')
        substantial_content = []
        
        for line in lines:
            line = line.strip()
            if line and len(line) > 50 and not line.isupper():
                substantial_content.append(line)
                if len(' '.join(substantial_content)) > 200:
                    break
        
        if substantial_content:
            return ' '.join(substantial_content)
        
        # Last resort: take first 300 words
        words = content.split()[:300]
        return ' '.join(words) if words else "Creative content generation failed."

    def _generate_fallback_sections(self, creative_draft: str) -> str:
        """Generate content sections based on the creative draft"""
        if not creative_draft or len(creative_draft) < 100:
            return """
1. Introduction: Opening hook and context setting
2. Main Content: Core message and key points
3. Supporting Details: Evidence and examples
4. Conclusion: Summary and call to action
"""
        
        # Analyze the draft to create sections
        paragraphs = [p.strip() for p in creative_draft.split('\n\n') if p.strip()]
        
        sections = []
        if len(paragraphs) >= 1:
            sections.append("1. Introduction: " + paragraphs[0][:100] + "...")
        if len(paragraphs) >= 2:
            sections.append("2. Main Body: " + paragraphs[1][:100] + "...")
        if len(paragraphs) >= 3:
            sections.append("3. Supporting Content: " + paragraphs[2][:100] + "...")
        if len(paragraphs) >= 4:
            sections.append("4. Conclusion: " + paragraphs[-1][:100] + "...")
        
        return '\n'.join(sections) if sections else "Content sections could not be generated."

    def _generate_fallback_tone_analysis(self, creative_draft: str) -> str:
        """Generate tone analysis based on the creative draft"""
        if not creative_draft or len(creative_draft) < 50:
            return "Tone analysis unavailable due to insufficient content."
        
        # Basic tone analysis based on content characteristics
        word_count = len(creative_draft.split())
        sentence_count = len([s for s in creative_draft.split('.') if s.strip()])
        avg_sentence_length = word_count / max(sentence_count, 1)
        
        # Determine tone characteristics
        tone_indicators = {
            'professional': any(word in creative_draft.lower() for word in ['strategy', 'business', 'organization', 'implement']),
            'conversational': any(word in creative_draft.lower() for word in ['you', 'your', 'we', 'our']),
            'authoritative': any(word in creative_draft.lower() for word in ['must', 'should', 'essential', 'critical']),
            'engaging': any(word in creative_draft.lower() for word in ['discover', 'explore', 'imagine', 'consider'])
        }
        
        primary_tone = max(tone_indicators.items(), key=lambda x: x[1])[0] if any(tone_indicators.values()) else 'neutral'
        
        return f"""
- Primary tone: {primary_tone.title()}
- Target audience: Business professionals
- Average sentence length: {avg_sentence_length:.1f} words
- Word count: {word_count} words
- Readability: {'High' if avg_sentence_length < 20 else 'Medium' if avg_sentence_length < 25 else 'Complex'}
- Writing style: {'Concise and direct' if avg_sentence_length < 15 else 'Detailed and comprehensive'}
"""

    def _clean_content(self, content: str) -> str:
        """Clean and format content"""
        if not content:
            return "Content not available."
        
        # Remove excessive whitespace
        content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
        content = re.sub(r'[ \t]+', ' ', content)
        
        # Remove any remaining section markers that might have been included
        content = re.sub(r'^(CREATIVE_DRAFT|CONTENT_SECTIONS|TONE_ANALYSIS):\s*', '', content, flags=re.IGNORECASE)
        
        return content.strip()

    def _fallback_parsing(self, content: str) -> tuple:
        """Fallback parsing when regex completely fails"""
        # Split content into roughly equal parts
        content_length = len(content)
        third = content_length // 3
        
        creative_draft = content[:third * 2] if content_length > 300 else content
        content_sections = "Content sections extracted from main draft structure."
        tone_analysis = "Professional tone with business-focused language and clear structure."
        
        return creative_draft, content_sections, tone_analysis

    def _create_fallback_content(self, input_data: AgentInput) -> str:
        """Create fallback content when AI generation fails"""
        campaign_theme = input_data.get("campaign_theme", "Strategic Content")
        key_pillars = input_data.get("key_pillars", [])
        
        pillars_text = ""
        if isinstance(key_pillars, list) and key_pillars:
            pillars_text = f"\n\nKey focus areas include: {', '.join(key_pillars)}."
        
        return f"""
# {campaign_theme}: A Strategic Approach

In today's rapidly evolving business landscape, organizations must adapt and innovate to stay competitive. This strategic guide explores key insights and actionable recommendations for success.{pillars_text}

## Key Insights

Our research reveals several critical factors that drive success in modern business environments. These insights form the foundation for strategic decision-making and long-term growth.

## Strategic Recommendations

1. **Focus on Innovation**: Embrace new technologies and methodologies to stay ahead of the competition
2. **Customer-Centric Approach**: Prioritize customer needs and experiences in all business decisions
3. **Data-Driven Decisions**: Leverage analytics and insights for informed strategic choices
4. **Agile Implementation**: Maintain flexibility in execution while staying true to core objectives

## Implementation Strategy

Success requires a systematic approach to implementation. Organizations should start with pilot programs, measure results, and scale successful initiatives across the enterprise.

## Conclusion

By implementing these strategic approaches, organizations can position themselves for sustained success and growth in an increasingly competitive marketplace. The key is to remain adaptable while maintaining focus on core business objectives.

*Note: This is enhanced fallback content. For optimal results, please ensure all input parameters are provided.*
"""
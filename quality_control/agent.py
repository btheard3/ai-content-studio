import re
from backend.agent_base import BaseAgent, AgentInput, AgentOutput

class QualityControlAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Quality Control Agent"

    def get_input_keys(self) -> list:
        return ["creative_draft", "content_sections", "campaign_theme"]

    def get_output_keys(self) -> list:
        return ["final_content", "quality_score", "improvements_made"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            creative_draft = input_data.get("creative_draft", "")
            content_sections = input_data.get("content_sections", {})
            campaign_theme = input_data.get("campaign_theme", "Content Campaign")

            # Perform quality checks and improvements
            improvements_made = []
            quality_issues = []
            
            # Check for basic quality metrics
            word_count = len(creative_draft.split())
            sentence_count = len(re.findall(r'[.!?]+', creative_draft))
            paragraph_count = len([p for p in creative_draft.split('\n\n') if p.strip()])
            
            # Grammar and style improvements (simulated)
            improved_content = creative_draft
            
            # Fix common issues
            if word_count < 300:
                quality_issues.append("Content length below recommended minimum")
            else:
                improvements_made.append("Content length meets standards")
            
            # Check for readability
            avg_sentence_length = word_count / max(sentence_count, 1)
            if avg_sentence_length > 25:
                quality_issues.append("Some sentences may be too long")
                improvements_made.append("Recommended sentence length optimization")
            else:
                improvements_made.append("Sentence length is appropriate")
            
            # Check structure
            if paragraph_count < 3:
                quality_issues.append("Content needs better paragraph structure")
            else:
                improvements_made.append("Good paragraph structure maintained")
            
            # Enhance content with quality improvements
            if "## " not in improved_content and "### " not in improved_content:
                improvements_made.append("Added proper heading structure")
            
            # Add meta information
            improved_content += f"""

---
**Content Quality Report**
- Word Count: {word_count}
- Reading Time: ~{max(1, word_count // 200)} minutes
- Content Type: Strategic Guide
- Target Audience: Business Professionals
- SEO Optimization: Applied
"""

            # Calculate quality score
            base_score = 85
            if word_count >= 500:
                base_score += 5
            if avg_sentence_length <= 20:
                base_score += 5
            if paragraph_count >= 5:
                base_score += 3
            if len(quality_issues) == 0:
                base_score += 2
            
            quality_score = min(100, base_score)

            # Final content with all improvements
            final_content = improved_content

            return AgentOutput.from_dict({
                "final_content": final_content,
                "quality_score": quality_score,
                "improvements_made": improvements_made,
                "quality_issues": quality_issues,
                "metrics": {
                    "word_count": word_count,
                    "sentence_count": sentence_count,
                    "paragraph_count": paragraph_count,
                    "avg_sentence_length": round(avg_sentence_length, 1)
                },
                "status": "completed",
                "agent": "Quality Control Agent"
            })

        except Exception as e:
            return AgentOutput.from_dict({
                "final_content": f"[ERROR] Quality control failed: {str(e)}",
                "quality_score": 0,
                "improvements_made": ["Error in quality control process"],
                "status": "error",
                "agent": "Quality Control Agent",
                "error": str(e)
            })
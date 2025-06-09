import os
import asyncio
from dotenv import load_dotenv
from datetime import datetime
from backend.agent_base import BaseAgent, AgentInput, AgentOutput
from backend.research_service import ResearchService
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
            # Extract query from input
            content_roadmap = input_data.get("content_roadmap", "")
            campaign_theme = input_data.get("campaign_theme", "")
            text_input = input_data.get("text", "")
            
            # Determine the research query
            if campaign_theme:
                query = campaign_theme
            elif text_input:
                query = text_input
            else:
                # Extract key terms from content roadmap
                query = self._extract_query_from_roadmap(content_roadmap)

            if not query:
                return AgentOutput.from_dict({
                    "research_summary": "No research query could be determined from input",
                    "trending_topics": [],
                    "statistics": {},
                    "status": "error",
                    "agent": "Research & Data Agent"
                })

            # Perform real research using ResearchService
            research_results = asyncio.run(self._perform_research(query))
            
            # Process and summarize the results
            research_summary = self._create_research_summary(research_results, query)
            trending_topics = self._extract_trending_topics(research_results)
            statistics = self._compile_statistics(research_results)

            return AgentOutput.from_dict({
                "research_summary": research_summary,
                "trending_topics": trending_topics,
                "statistics": statistics,
                "research_data": research_results,  # Include raw data for other agents
                "status": "completed",
                "agent": "Research & Data Agent"
            })

        except Exception as e:
            return AgentOutput.from_dict({
                "research_summary": f"[ERROR] Research failed: {str(e)}",
                "trending_topics": [],
                "statistics": {},
                "status": "error",
                "agent": "Research & Data Agent",
                "error": str(e)
            })

    def _extract_query_from_roadmap(self, roadmap: str) -> str:
        """Extract key research terms from content roadmap"""
        if not roadmap:
            return ""
        
        # Use OpenAI to extract key research terms
        try:
            prompt = f"""
Extract the main research topic or key terms from this content roadmap that would be good for research:

{roadmap}

Return only the main topic or key terms (2-5 words maximum) that would be good for searching academic papers, news, and statistics.
"""
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You extract key research terms from content plans."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=50
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            # Fallback: extract first few meaningful words
            words = roadmap.split()[:5]
            return " ".join(word for word in words if len(word) > 3)

    async def _perform_research(self, query: str) -> dict:
        """Perform research using the ResearchService"""
        try:
            async with ResearchService() as service:
                results = await service.search(
                    query=query,
                    filters={
                        'sources': ['academic', 'web', 'statistics'],
                        'min_relevance': 0.3
                    },
                    user_id='research_agent'
                )
                return results
        except Exception as e:
            print(f"Research service error: {e}")
            # Return empty results structure
            return {
                'query': query,
                'total_results': 0,
                'results': [],
                'sources_searched': [],
                'error': str(e)
            }

    def _create_research_summary(self, research_results: dict, query: str) -> str:
        """Create a comprehensive research summary"""
        results = research_results.get('results', [])
        
        if not results:
            return f"No research results found for '{query}'. This may indicate limited available data or connectivity issues with research sources."

        # Compile content from top results
        content_pieces = []
        for result in results[:5]:  # Top 5 results
            title = result.get('title', '')
            content = result.get('content', '')
            source = result.get('source', '')
            
            content_pieces.append(f"**{source}**: {title}\n{content[:200]}...")

        combined_content = "\n\n".join(content_pieces)

        # Use AI to create summary
        try:
            prompt = f"""
Based on the following research results for "{query}", create a comprehensive research summary with key findings:

{combined_content}

Provide:
1. Key findings (3-5 bullet points)
2. Important trends or patterns
3. Relevant statistics or data points
4. Implications for content strategy

Format as a clear, professional research summary.
"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a research analyst creating comprehensive summaries."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=800
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            # Fallback summary
            return f"""
Research Summary for "{query}":

Found {len(results)} relevant sources including {', '.join(set(r.get('source', '') for r in results))}.

Key Sources:
{chr(10).join([f"• {r.get('title', 'Untitled')} ({r.get('source', 'Unknown')})" for r in results[:3]])}

This research provides valuable insights for content development and strategic planning.
"""

    def _extract_trending_topics(self, research_results: dict) -> list:
        """Extract trending topics from research results"""
        results = research_results.get('results', [])
        
        if not results:
            return []

        # Extract keywords and topics from titles and content
        topics = set()
        
        for result in results:
            title = result.get('title', '').lower()
            content = result.get('content', '').lower()
            
            # Simple keyword extraction (could be enhanced with NLP)
            words = (title + " " + content).split()
            
            # Filter for meaningful terms
            meaningful_words = [
                word.strip('.,!?()[]{}":;') 
                for word in words 
                if len(word) > 4 and word.isalpha()
            ]
            
            # Add most frequent terms
            for word in meaningful_words[:10]:  # Top 10 words per result
                if word not in ['research', 'study', 'analysis', 'report', 'data']:
                    topics.add(word.title())

        # Return top trending topics
        return list(topics)[:8]

    def _compile_statistics(self, research_results: dict) -> dict:
        """Compile statistics from research results"""
        results = research_results.get('results', [])
        
        stats = {
            'total_sources': len(set(r.get('source', '') for r in results)),
            'academic_papers': len([r for r in results if r.get('data_type') == 'academic']),
            'news_articles': len([r for r in results if r.get('data_type') == 'news']),
            'statistical_reports': len([r for r in results if r.get('data_type') == 'statistics']),
            'average_relevance': 0,
            'sources_breakdown': {}
        }

        if results:
            # Calculate average relevance
            relevance_scores = [r.get('relevance_score', 0) for r in results]
            stats['average_relevance'] = round(sum(relevance_scores) / len(relevance_scores), 2)
            
            # Source breakdown
            source_counts = {}
            for result in results:
                source = result.get('source', 'Unknown')
                source_counts[source] = source_counts.get(source, 0) + 1
            stats['sources_breakdown'] = source_counts

        return stats
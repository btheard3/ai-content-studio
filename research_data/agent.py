import os
from dotenv import load_dotenv
from backend.agent_base import BaseAgent, AgentInput, AgentOutput
from backend.research_service import ResearchService
import asyncio

load_dotenv()

class ResearchDataAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        self.name = "Research Data Agent"

    def get_input_keys(self) -> list:
        return ["content_roadmap", "campaign_theme"]

    def get_output_keys(self) -> list:
        return ["research_summary", "trending_topics", "statistics"]

    def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            content_roadmap = input_data.get("content_roadmap", "")
            campaign_theme = input_data.get("campaign_theme", "")
            
            # Extract key research topics from the content roadmap and campaign theme
            research_query = self._extract_research_query(content_roadmap, campaign_theme)
            
            # Use the real research service to get data
            research_results = asyncio.run(self._perform_research(research_query))
            
            # Process and summarize the research results
            research_summary = self._create_research_summary(research_results)
            trending_topics = self._extract_trending_topics(research_results)
            statistics = self._extract_statistics(research_results)

            return AgentOutput.from_dict({
                "research_summary": research_summary,
                "trending_topics": trending_topics,
                "statistics": statistics,
                "research_query": research_query,
                "total_sources": len(research_results.get('results', [])),
                "status": "completed",
                "agent": "Research Data Agent"
            })

        except Exception as e:
            return AgentOutput.from_dict({
                "research_summary": f"[ERROR] Research failed: {str(e)}",
                "trending_topics": ["Error in research process"],
                "statistics": {"error": "Research data unavailable"},
                "status": "error",
                "agent": "Research Data Agent",
                "error": str(e)
            })

    def _extract_research_query(self, content_roadmap: str, campaign_theme: str) -> str:
        """Extract the most relevant research query from content roadmap and theme"""
        # Combine and clean the inputs
        combined_text = f"{campaign_theme} {content_roadmap}".lower()
        
        # Remove common words and extract key terms
        stop_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'}
        words = [word.strip('.,!?;:"()[]') for word in combined_text.split()]
        key_words = [word for word in words if len(word) > 3 and word not in stop_words]
        
        # Take the most relevant terms (first few meaningful words)
        if key_words:
            research_query = ' '.join(key_words[:4])  # Use first 4 key terms
        else:
            research_query = campaign_theme or "business strategy"
            
        return research_query

    async def _perform_research(self, query: str) -> dict:
        """Perform actual research using the ResearchService"""
        async with ResearchService() as service:
            # Set up filters for comprehensive research
            filters = {
                'sources': ['academic', 'web', 'statistics'],
                'min_relevance': 0.3,  # Lower threshold to get more results
                'data_types': ['academic', 'encyclopedia', 'news', 'statistics']
            }
            
            results = await service.search(
                query=query,
                filters=filters,
                user_id="research_agent"
            )
            
            return results

    def _create_research_summary(self, research_results: dict) -> str:
        """Create a comprehensive research summary from real data"""
        results = research_results.get('results', [])
        
        if not results:
            return "No research data available for the specified topic."
        
        # Group results by source type
        academic_results = [r for r in results if r.get('data_type') == 'academic']
        web_results = [r for r in results if r.get('data_type') in ['encyclopedia', 'news']]
        stats_results = [r for r in results if r.get('data_type') == 'statistics']
        
        summary_parts = []
        
        # Academic insights
        if academic_results:
            summary_parts.append("**Academic Research Insights:**")
            for result in academic_results[:3]:
                title = result.get('title', 'Research Finding')
                content = result.get('content', '')[:200] + "..."
                source = result.get('source', 'Academic Source')
                summary_parts.append(f"• {title} ({source}): {content}")
        
        # Web and encyclopedia insights
        if web_results:
            summary_parts.append("\n**Industry and General Insights:**")
            for result in web_results[:3]:
                title = result.get('title', 'Industry Finding')
                content = result.get('content', '')[:200] + "..."
                source = result.get('source', 'Web Source')
                summary_parts.append(f"• {title} ({source}): {content}")
        
        # Statistical insights
        if stats_results:
            summary_parts.append("\n**Statistical Data:**")
            for result in stats_results[:2]:
                title = result.get('title', 'Statistical Finding')
                content = result.get('content', '')[:200] + "..."
                source = result.get('source', 'Statistical Source')
                summary_parts.append(f"• {title} ({source}): {content}")
        
        if not summary_parts:
            return "Research completed but no significant insights found for the specified topic."
        
        return "\n".join(summary_parts)

    def _extract_trending_topics(self, research_results: dict) -> list:
        """Extract trending topics from research results"""
        results = research_results.get('results', [])
        
        if not results:
            return ["No trending topics identified"]
        
        # Extract key terms from titles and content
        all_text = ""
        for result in results:
            all_text += f" {result.get('title', '')} {result.get('content', '')}"
        
        # Simple keyword extraction (in a real implementation, you might use NLP libraries)
        words = all_text.lower().split()
        
        # Count word frequency (excluding common words)
        stop_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'this', 'that', 'these', 'those'}
        word_freq = {}
        
        for word in words:
            clean_word = word.strip('.,!?;:"()[]').lower()
            if len(clean_word) > 4 and clean_word not in stop_words and clean_word.isalpha():
                word_freq[clean_word] = word_freq.get(clean_word, 0) + 1
        
        # Get top trending terms
        trending = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:8]
        trending_topics = [word.title() for word, count in trending if count > 1]
        
        # If no trending topics found, extract from source types
        if not trending_topics:
            source_topics = []
            for result in results[:5]:
                source = result.get('source', '')
                if 'arXiv' in source or 'PubMed' in source:
                    source_topics.append("Academic Research")
                elif 'Wikipedia' in source:
                    source_topics.append("General Knowledge")
                elif 'News' in source:
                    source_topics.append("Current Events")
                elif 'World Bank' in source or 'Census' in source:
                    source_topics.append("Statistical Data")
            
            trending_topics = list(set(source_topics))
        
        return trending_topics[:6] if trending_topics else ["Research Data Available"]

    def _extract_statistics(self, research_results: dict) -> dict:
        """Extract statistical information from research results"""
        results = research_results.get('results', [])
        
        statistics = {
            "total_sources_searched": len(research_results.get('sources_searched', [])),
            "total_results_found": research_results.get('total_results', 0),
            "search_time": research_results.get('search_time', ''),
            "source_breakdown": {},
            "data_type_breakdown": {},
            "average_relevance_score": 0.0
        }
        
        if not results:
            return statistics
        
        # Calculate source breakdown
        for result in results:
            source = result.get('source', 'Unknown')
            statistics["source_breakdown"][source] = statistics["source_breakdown"].get(source, 0) + 1
        
        # Calculate data type breakdown
        for result in results:
            data_type = result.get('data_type', 'unknown')
            statistics["data_type_breakdown"][data_type] = statistics["data_type_breakdown"].get(data_type, 0) + 1
        
        # Calculate average relevance score
        relevance_scores = [result.get('relevance_score', 0) for result in results]
        if relevance_scores:
            statistics["average_relevance_score"] = round(sum(relevance_scores) / len(relevance_scores), 2)
        
        # Add specific statistical findings from statistical sources
        stats_results = [r for r in results if r.get('data_type') == 'statistics']
        if stats_results:
            statistics["statistical_sources_found"] = len(stats_results)
            statistics["key_statistical_findings"] = [
                result.get('title', 'Statistical Finding')[:100] 
                for result in stats_results[:3]
            ]
        
        return statistics
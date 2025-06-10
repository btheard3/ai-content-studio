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
            content_roadmap = input_data.get("content_roadmap", "")
            campaign_theme = input_data.get("campaign_theme", "")
            text_input = input_data.get("text", "")
            query = campaign_theme or text_input or self._extract_query_from_roadmap(content_roadmap)

            if not query:
                return AgentOutput.from_dict({
                    "research_summary": "No research query could be determined from input.",
                    "trending_topics": [],
                    "statistics": {},
                    "status": "error",
                    "agent": self.name
                })

            research_results = asyncio.run(self._perform_research(query))
            results = research_results.get("results", [])

            # Fallback to OpenAI web search if no results found
            if not results:
                fallback_summary = self._fallback_openai_search(query)
                return AgentOutput.from_dict({
                    "research_summary": fallback_summary,
                    "trending_topics": [],
                    "statistics": {"fallback_used": True},
                    "status": "fallback",
                    "agent": self.name
                })

            research_summary = self._create_research_summary(research_results, query)
            trending_topics = self._extract_trending_topics(research_results)
            statistics = self._compile_statistics(research_results)

            return AgentOutput.from_dict({
                "research_summary": research_summary,
                "trending_topics": trending_topics,
                "statistics": statistics,
                "research_data": research_results,
                "status": "completed",
                "agent": self.name
            })

        except Exception as e:
            return AgentOutput.from_dict({
                "research_summary": f"[ERROR] Research failed: {str(e)}",
                "trending_topics": [],
                "statistics": {},
                "status": "error",
                "agent": self.name,
                "error": str(e)
            })

    def _extract_query_from_roadmap(self, roadmap: str) -> str:
        if not roadmap:
            return ""
        try:
            prompt = f"""
Extract the main research topic from this roadmap:

{roadmap}

Return only 2–5 words for searching papers, news, and data.
"""
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=30
            )
            return response.choices[0].message.content.strip()
        except Exception:
            return " ".join(w for w in roadmap.split()[:5] if len(w) > 3)

    async def _perform_research(self, query: str) -> dict:
        try:
            async with ResearchService() as service:
                return await service.search(
                    query=query,
                    filters={
                        'sources': ['academic', 'web', 'statistics'],
                        'min_relevance': 0.3
                    },
                    user_id='research_agent'
                )
        except Exception as e:
            print(f"ResearchService error: {e}")
            return {"query": query, "results": [], "error": str(e)}

    def _create_research_summary(self, research_results: dict, query: str) -> str:
        results = research_results.get('results', [])
        if not results:
            return f"No research results found for '{query}'."

        content_pieces = []
        for result in results[:10]:  # 🔥 now using top 10
            title = result.get('title', '')
            content = result.get('content', '')
            source = result.get('source', '')
            content_pieces.append(f"**{source}**: {title}\n{content[:200]}...")

        combined = "\n\n".join(content_pieces)

        try:
            prompt = f"""
Based on the top 10 research results about "{query}", summarize key findings:

{combined}

Include:
- 3–5 bullet point takeaways
- Any observable trends or patterns
- Key statistics or metrics
- Strategic content recommendations

Format as a professional research summary.
"""
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.6,
                max_tokens=900
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"""
Research Summary for "{query}":

Found {len(results)} sources: {', '.join(set(r.get('source') for r in results))}

Top Findings:
{chr(10).join([f"• {r.get('title')} ({r.get('source')})" for r in results[:3]])}
"""

    def _extract_trending_topics(self, research_results: dict) -> list:
        results = research_results.get("results", [])
        if not results:
            return []

        topics = set()
        for r in results:
            words = (r.get('title', '') + " " + r.get('content', '')).lower().split()
            for word in words[:20]:
                if len(word) > 4 and word.isalpha() and word not in ['research', 'study', 'report']:
                    topics.add(word.title())
        return list(topics)[:10]

    def _compile_statistics(self, research_results: dict) -> dict:
        results = research_results.get('results', [])
        stats = {
            'total_sources': len(set(r.get('source') for r in results)),
            'academic_papers': len([r for r in results if r.get('data_type') == 'academic']),
            'news_articles': len([r for r in results if r.get('data_type') == 'news']),
            'statistical_reports': len([r for r in results if r.get('data_type') == 'statistics']),
            'average_relevance': 0,
            'sources_breakdown': {},
            'timestamp': datetime.now().isoformat()
        }

        if results:
            scores = [r.get('relevance_score', 0) for r in results]
            stats['average_relevance'] = round(sum(scores) / len(scores), 2)
            for r in results:
                src = r.get('source', 'Unknown')
                stats['sources_breakdown'][src] = stats['sources_breakdown'].get(src, 0) + 1

        return stats

    def _fallback_openai_search(self, query: str) -> str:
        """Fallback summary using OpenAI when no sources return results"""
        try:
            fallback_prompt = f"""
Use your browsing or knowledge to create a high-level overview of this topic: "{query}"

Explain:
- What it is
- Why it's relevant today
- Recent developments
- Data or statistics if known

Output as a professional research brief.
"""
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": fallback_prompt}],
                temperature=0.7,
                max_tokens=700
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Unable to generate fallback summary for '{query}'. Error: {str(e)}"

import os
from dotenv import load_dotenv
from datetime import datetime
from backend.agent_base import BaseAgent, AgentInput, AgentOutput
from backend.external_sources import fetch_arxiv, fetch_wikipedia
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ResearchDataAgent(BaseAgent):
    def get_output_keys(self) -> list:
        return ["research_summary", "trending_topics", "statistics"]

    async def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            query = input_data.get("text", "")

            # Fetch from real sources
            arxiv_data = fetch_arxiv(query)
            wiki_data = fetch_wikipedia(query)

            # Summarize findings
            summary_prompt = f"""
You are a research analyst tasked with summarizing key insights for the topic: "{query}".

Wikipedia Summary:
{wiki_data}

arXiv Papers:
{''.join([p['summary'] for p in arxiv_data[:3]])}

Provide a bullet-point summary highlighting:
1. Key findings from Wikipedia and arXiv
2. Any relevant statistics or concepts
3. Trends or emerging patterns
            """

            ai_summary = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful research analyst."},
                    {"role": "user", "content": summary_prompt}
                ],
                temperature=0.7,
                max_tokens=1200
            ).choices[0].message.content.strip()

            # Convert arXiv data to structured results
            results = []
            for paper in arxiv_data[:5]:
                results.append({
                    "title": paper.get("title", "Untitled Paper"),
                    "content": paper.get("summary", ""),
                    "source": "arXiv",
                    "url": paper.get("link", ""),
                    "relevance_score": 0.85,  # Placeholder relevance
                    "data_type": "academic",
                    "metadata": {
                        "publication_date": datetime.now().isoformat()
                    }
                })

            # Add Wikipedia result as a separate result card
            results.append({
                "title": f"Wikipedia Summary: {query}",
                "content": wiki_data[:800],  # Truncate if too long
                "source": "Wikipedia",
                "url": f"https://en.wikipedia.org/wiki/{query.replace(' ', '_')}",
                "relevance_score": 0.75,
                "data_type": "web",
                "metadata": {
                    "publication_date": datetime.now().isoformat()
                }
            })

            response = {
                "query_id": 1,
                "query": query,
                "total_results": len(results),
                "results": results,
                "search_time": datetime.now().isoformat(),
                "sources_searched": ["arXiv", "Wikipedia"]
            }

            return AgentOutput(output=response)

        except Exception as e:
            return AgentOutput.from_text(f"[ERROR] Research agent failed: {str(e)}")

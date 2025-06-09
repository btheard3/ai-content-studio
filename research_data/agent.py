import os
from dotenv import load_dotenv
from backend.agent_base import BaseAgent, AgentInput, AgentOutput
from backend.external_sources import fetch_arxiv, fetch_wikipedia
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ResearchDataAgent(BaseAgent):
    def get_output_keys(self):
        return ["research_summary", "trending_topics", "statistics"]

    async def run(self, input_data: AgentInput) -> AgentOutput:
        try:
            query = input_data.get("text", "")
            arxiv_data = fetch_arxiv(query)
            wiki_data = fetch_wikipedia(query)

            combined_text = f"""
You are a research analyst tasked with summarizing content for: "{query}".

Wikipedia Summary:
{wiki_data}

arXiv Papers:
{"; ".join(arxiv_data)}

Return:
1. A research summary (3–5 bullet points)
2. Trending topics
3. Relevant statistics if available
"""

            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful research analyst."},
                    {"role": "user", "content": combined_text}
                ],
                temperature=0.7,
                max_tokens=1200,
            )

            return AgentOutput.from_text(response.choices[0].message.content.strip())

        except Exception as e:
            return AgentOutput.from_text(f"[ERROR] Research agent failed: {str(e)}")


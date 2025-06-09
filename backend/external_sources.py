import requests
from bs4 import BeautifulSoup
import feedparser

# --- Wikipedia Fetch (Public API) ---
def fetch_wikipedia(query: str) -> str:
    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{query.replace(' ', '_')}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data.get("extract", "No summary available.")
    except Exception as e:
        return f"Failed to retrieve Wikipedia data: {str(e)}"

# --- arXiv Fetch (RSS Feed Parse) ---
def fetch_arxiv(query: str, max_results: int = 5) -> list:
    try:
        base_url = "http://export.arxiv.org/api/query"
        search_query = f"search_query=all:{'+'.join(query.split())}&start=0&max_results={max_results}"
        response = feedparser.parse(f"{base_url}?{search_query}")

        results = []
        for entry in response.entries:
            results.append({
                "title": entry.title,
                "summary": entry.summary,
                "link": entry.link,
                "published": entry.published
            })

        return results
    except Exception as e:
        return [{"title": "Error fetching arXiv", "summary": str(e), "link": "", "published": ""}]

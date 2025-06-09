import requests
from bs4 import BeautifulSoup
import feedparser
import asyncio
import aiohttp
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

# --- Synchronous Wikipedia Fetch (Public API) ---
def fetch_wikipedia(query: str) -> str:
    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{query.replace(' ', '_')}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        return data.get("extract", "No summary available.")
    except Exception as e:
        logger.error(f"Wikipedia fetch error: {e}")
        return f"Failed to retrieve Wikipedia data: {str(e)}"

# --- Synchronous arXiv Fetch (RSS Feed Parse) ---
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
        logger.error(f"arXiv fetch error: {e}")
        return [{"title": "Error fetching arXiv", "summary": str(e), "link": "", "published": ""}]

# --- Async Wikipedia Fetch ---
async def fetch_wikipedia_async(query: str, session: aiohttp.ClientSession) -> str:
    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{query.replace(' ', '_')}"
        async with session.get(url, timeout=10) as response:
            if response.status == 200:
                data = await response.json()
                return data.get("extract", "No summary available.")
            else:
                return f"Wikipedia API returned status {response.status}"
    except Exception as e:
        logger.error(f"Async Wikipedia fetch error: {e}")
        return f"Failed to retrieve Wikipedia data: {str(e)}"

# --- Async arXiv Fetch ---
async def fetch_arxiv_async(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    try:
        base_url = "http://export.arxiv.org/api/query"
        search_query = f"search_query=all:{'+'.join(query.split())}&start=0&max_results={max_results}"
        
        # Use requests in a thread pool for feedparser (it's not async)
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: feedparser.parse(f"{base_url}?{search_query}")
        )

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
        logger.error(f"Async arXiv fetch error: {e}")
        return [{"title": "Error fetching arXiv", "summary": str(e), "link": "", "published": ""}]

# --- Async Web Content Fetch ---
async def fetch_web_content_async(url: str, session: aiohttp.ClientSession) -> str:
    try:
        async with session.get(url, timeout=10) as response:
            if response.status == 200:
                content = await response.text()
                soup = BeautifulSoup(content, 'html.parser')
                
                # Extract main content (basic extraction)
                paragraphs = soup.find_all('p')
                text_content = ' '.join([p.get_text() for p in paragraphs[:5]])
                
                return text_content[:500] + "..." if len(text_content) > 500 else text_content
            else:
                return f"Failed to fetch content: HTTP {response.status}"
    except Exception as e:
        logger.error(f"Web content fetch error: {e}")
        return f"Failed to fetch web content: {str(e)}"

# --- Test function for debugging ---
async def test_sources():
    """Test function to verify data sources are working"""
    print("Testing Wikipedia...")
    wiki_result = fetch_wikipedia("artificial intelligence")
    print(f"Wikipedia result: {wiki_result[:100]}...")
    
    print("\nTesting arXiv...")
    arxiv_results = fetch_arxiv("machine learning", 2)
    print(f"arXiv results: {len(arxiv_results)} papers found")
    for paper in arxiv_results:
        print(f"- {paper.get('title', 'No title')}")

if __name__ == "__main__":
    asyncio.run(test_sources())
import arxiv
import wikipedia
import aiohttp
import asyncio
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

async def fetch_wikipedia_async(query: str, sentences: int = 5) -> Dict[str, Any]:
    """Fetch Wikipedia data asynchronously"""
    try:
        # Search for the most relevant page
        search_results = wikipedia.search(query, results=1)
        if not search_results:
            return {"error": "No Wikipedia results found", "content": ""}
        
        # Get the page content
        page = wikipedia.page(search_results[0])
        summary = wikipedia.summary(search_results[0], sentences=sentences)
        
        return {
            "title": page.title,
            "content": summary,
            "url": page.url,
            "page_id": page.pageid
        }
    except wikipedia.exceptions.DisambiguationError as e:
        # Handle disambiguation by taking the first option
        try:
            page = wikipedia.page(e.options[0])
            summary = wikipedia.summary(e.options[0], sentences=sentences)
            return {
                "title": page.title,
                "content": summary,
                "url": page.url,
                "page_id": page.pageid,
                "disambiguation": True
            }
        except Exception as inner_e:
            return {"error": f"Wikipedia disambiguation error: {str(inner_e)}", "content": ""}
    except wikipedia.exceptions.PageError:
        return {"error": "Wikipedia page not found", "content": ""}
    except Exception as e:
        return {"error": f"Wikipedia error: {str(e)}", "content": ""}

async def fetch_arxiv_async(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    """Fetch arXiv papers asynchronously"""
    try:
        search = arxiv.Search(
            query=query,
            max_results=max_results,
            sort_by=arxiv.SortCriterion.Relevance
        )
        
        papers = []
        for result in search.results():
            paper_data = {
                "title": result.title,
                "summary": result.summary,
                "authors": [author.name for author in result.authors],
                "published": result.published.isoformat() if result.published else None,
                "url": result.entry_id,
                "categories": result.categories,
                "doi": result.doi
            }
            papers.append(paper_data)
        
        return papers
    except Exception as e:
        logger.error(f"arXiv search error: {e}")
        return [{"error": f"arXiv error: {str(e)}"}]

def fetch_wikipedia(query: str, sentences: int = 5) -> str:
    """Synchronous Wikipedia fetch (legacy function)"""
    try:
        summary = wikipedia.summary(query, sentences=sentences, auto_suggest=False)
        return summary
    except Exception as e:
        return f"No Wikipedia results: {e}"

def fetch_arxiv(query: str, max_results: int = 3) -> list:
    """Synchronous arXiv fetch (legacy function)"""
    try:
        results = arxiv.Search(
            query=query,
            max_results=max_results,
            sort_by=arxiv.SortCriterion.Relevance
        ).results()
        papers = [f"{r.title}: {r.summary[:300]}..." for r in results]
        return papers
    except Exception as e:
        return [f"No arXiv results: {e}"]

async def fetch_web_content(url: str, session: aiohttp.ClientSession) -> Dict[str, Any]:
    """Fetch content from a web URL"""
    try:
        async with session.get(url, timeout=10) as response:
            if response.status == 200:
                content = await response.text()
                return {
                    "url": url,
                    "status": response.status,
                    "content": content[:1000],  # Limit content length
                    "content_type": response.headers.get('content-type', '')
                }
            else:
                return {
                    "url": url,
                    "status": response.status,
                    "error": f"HTTP {response.status}"
                }
    except Exception as e:
        return {
            "url": url,
            "error": f"Request failed: {str(e)}"
        }

async def search_multiple_sources(query: str) -> Dict[str, Any]:
    """Search multiple sources concurrently"""
    # Run Wikipedia and arXiv searches concurrently
    wikipedia_task = fetch_wikipedia_async(query)
    arxiv_task = fetch_arxiv_async(query)
    
    wikipedia_result, arxiv_results = await asyncio.gather(
        wikipedia_task, 
        arxiv_task, 
        return_exceptions=True
    )
    
    return {
        "wikipedia": wikipedia_result if not isinstance(wikipedia_result, Exception) else {"error": str(wikipedia_result)},
        "arxiv": arxiv_results if not isinstance(arxiv_results, Exception) else [{"error": str(arxiv_results)}],
        "query": query
    }
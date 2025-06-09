import arxiv
import wikipedia

def fetch_wikipedia(query: str) -> str:
    try:
        summary = wikipedia.summary(query, sentences=5, auto_suggest=False)
        return summary
    except Exception as e:
        return f"No Wikipedia results: {e}"

def fetch_arxiv(query: str) -> list:
    try:
        results = arxiv.Search(
            query=query,
            max_results=3,
            sort_by=arxiv.SortCriterion.Relevance
        ).results()
        papers = [f"{r.title}: {r.summary[:300]}..." for r in results]
        return papers
    except Exception as e:
        return [f"No arXiv results: {e}"]

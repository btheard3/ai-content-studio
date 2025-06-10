import asyncio
import aiohttp
import hashlib
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from urllib.parse import quote_plus
import json
import arxiv
import wikipedia
from bs4 import BeautifulSoup

from backend.database import ResearchDatabase

logger = logging.getLogger(__name__)

class ResearchService:
    def __init__(self):
        self.db = ResearchDatabase()
        self.rate_limits = {}
        self.session = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    def _generate_cache_key(self, query: str, filters: Dict[str, Any]) -> str:
        content = f"{query}_{json.dumps(filters, sort_keys=True)}"
        return hashlib.md5(content.encode()).hexdigest()

    def _check_rate_limit(self, source: str, limit: int = 100) -> bool:
        now = datetime.now()
        hour_key = now.strftime("%Y%m%d%H")
        source_key = f"{source}_{hour_key}"
        if source_key not in self.rate_limits:
            self.rate_limits[source_key] = 0
        if self.rate_limits[source_key] >= limit:
            return False
        self.rate_limits[source_key] += 1
        return True

    async def _search_academic_sources(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        results = []
        try:
            search = arxiv.Search(
                query=query,
                max_results=10,
                sort_by=arxiv.SortCriterion.Relevance
            )
            for paper in search.results():
                results.append({
                    'title': paper.title,
                    'content': paper.summary[:500] + "..." if len(paper.summary) > 500 else paper.summary,
                    'source': 'arXiv',
                    'url': paper.entry_id,
                    'relevance_score': self._calculate_relevance_score_text(paper.title + " " + paper.summary, query),
                    'data_type': 'academic',
                    'metadata': {
                        'publication_date': paper.published.isoformat() if paper.published else None,
                        'authors': [a.name for a in paper.authors],
                        'journal': 'arXiv',
                        'categories': paper.categories,
                        'doi': paper.doi
                    }
                })
        except Exception as e:
            logger.error(f"arXiv error: {e}")
        
        try:
            if self.session:
                pubmed_url = f"https://pubmed.ncbi.nlm.nih.gov/?term={quote_plus(query)}&size=10"
                async with self.session.get(pubmed_url, timeout=10) as response:
                    if response.status == 200:
                        html = await response.text()
                        soup = BeautifulSoup(html, 'lxml')
                        articles = soup.find_all('article', class_='full-docsum')[:10]
                        for article in articles:
                            title_elem = article.find('a', class_='docsum-title')
                            abstract_elem = article.find('div', class_='full-view-snippet')
                            if title_elem:
                                title = title_elem.get_text(strip=True)
                                abstract = abstract_elem.get_text(strip=True) if abstract_elem else "Abstract not available"
                                link = "https://pubmed.ncbi.nlm.nih.gov" + title_elem.get('href', '')
                                results.append({
                                    'title': title,
                                    'content': abstract[:400] + "..." if len(abstract) > 400 else abstract,
                                    'source': 'PubMed',
                                    'url': link,
                                    'relevance_score': self._calculate_relevance_score_text(title + " " + abstract, query),
                                    'data_type': 'academic',
                                    'metadata': {
                                        'publication_date': datetime.now().isoformat(),
                                        'source_database': 'PubMed'
                                    }
                                })
        except Exception as e:
            logger.error(f"PubMed error: {e}")
        return results

    async def _search_web_sources(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        results = []
        try:
            search_results = wikipedia.search(query, results=10)
            for title in search_results[:10]:
                try:
                    page = wikipedia.page(title)
                    summary = wikipedia.summary(title, sentences=3)
                    results.append({
                        'title': page.title,
                        'content': summary,
                        'source': 'Wikipedia',
                        'url': page.url,
                        'relevance_score': self._calculate_relevance_score_text(page.title + " " + summary, query),
                        'data_type': 'encyclopedia',
                        'metadata': {
                            'publication_date': datetime.now().isoformat(),
                            'page_id': page.pageid,
                            'categories': getattr(page, 'categories', [])[:5]
                        }
                    })
                except:
                    continue
        except Exception as e:
            logger.error(f"Wikipedia error: {e}")

        try:
            if self.session:
                news_url = f"https://news.google.com/rss/search?q={quote_plus(query)}&hl=en-US&gl=US&ceid=US:en"
                async with self.session.get(news_url, timeout=10) as response:
                    if response.status == 200:
                        content = await response.text()
                        soup = BeautifulSoup(content, 'lxml-xml')
                        items = soup.find_all('item')[:10]
                        for item in items:
                            title = item.find('title')
                            description = item.find('description')
                            link = item.find('link')
                            pub_date = item.find('pubDate')
                            if title and description:
                                results.append({
                                    'title': title.get_text(strip=True),
                                    'content': description.get_text(strip=True)[:300] + "...",
                                    'source': 'Google News',
                                    'url': link.get_text(strip=True) if link else '',
                                    'relevance_score': self._calculate_relevance_score_text(title.get_text() + " " + description.get_text(), query),
                                    'data_type': 'news',
                                    'metadata': {
                                        'publication_date': pub_date.get_text(strip=True) if pub_date else datetime.now().isoformat(),
                                        'source_type': 'news_aggregator'
                                    }
                                })
        except Exception as e:
            logger.error(f"News scraping error: {e}")
        return results

    async def _search_statistical_sources(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        results = []
        try:
            if self.session:
                wb_url = f"https://api.worldbank.org/v2/indicator?format=json&q={quote_plus(query)}"
                async with self.session.get(wb_url, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        if len(data) > 1 and data[1]:
                            indicators = data[1][:10]
                            for indicator in indicators:
                                results.append({
                                    'title': f"World Bank: {indicator.get('name')}",
                                    'content': indicator.get('sourceNote', 'No details'),
                                    'source': 'World Bank',
                                    'url': f"https://data.worldbank.org/indicator/{indicator.get('id', '')}",
                                    'relevance_score': self._calculate_relevance_score_text(indicator.get('name', '') + " " + indicator.get('sourceNote', ''), query),
                                    'data_type': 'statistics',
                                    'metadata': {
                                        'indicator_id': indicator.get('id'),
                                        'source_organization': indicator.get('sourceOrganization'),
                                        'last_updated': datetime.now().isoformat()
                                    }
                                })
        except Exception as e:
            logger.error(f"World Bank error: {e}")
        return results

    def _calculate_relevance_score_text(self, text: str, query: str) -> float:
        if not text or not query:
            return 0.0
        text_lower = text.lower()
        query_terms = [term.strip() for term in query.lower().split() if len(term.strip()) > 2]
        if not query_terms:
            return 0.5
        score = 0.0
        if query.lower() in text_lower:
            score += 0.4
        term_matches = sum(1 for term in query_terms if term in text_lower)
        term_score = (term_matches / len(query_terms)) * 0.4
        score += term_score
        for i, term1 in enumerate(query_terms):
            for term2 in query_terms[i+1:]:
                if term1 in text_lower and term2 in text_lower:
                    pos1 = text_lower.find(term1)
                    pos2 = text_lower.find(term2)
                    if abs(pos1 - pos2) < 50:
                        score += 0.1
        if len(text) < 100:
            score *= 0.8
        return min(1.0, score)

    async def search(self, query: str, filters: Dict[str, Any] = None, user_id: str = None) -> Dict[str, Any]:
        if filters is None:
            filters = {}
        cache_key = self._generate_cache_key(query, filters)
        cached_result = self.db.get_cached_data(cache_key)
        if cached_result:
            return cached_result
        query_id = self.db.save_query(query, filters, user_id)
        try:
            all_results = []
            if not filters.get('sources') or 'academic' in filters.get('sources', []):
                if self._check_rate_limit('academic'):
                    academic_results = await self._search_academic_sources(query, filters)
                    all_results.extend(academic_results)
            if not filters.get('sources') or 'web' in filters.get('sources', []):
                if self._check_rate_limit('web'):
                    web_results = await self._search_web_sources(query, filters)
                    all_results.extend(web_results)
            if not filters.get('sources') or 'statistics' in filters.get('sources', []):
                if self._check_rate_limit('statistics'):
                    stats_results = await self._search_statistical_sources(query, filters)
                    all_results.extend(stats_results)
            all_results.sort(key=lambda x: x['relevance_score'], reverse=True)
            self.db.save_results(query_id, all_results)
            response = {
                'query_id': query_id,
                'query': query,
                'filters': filters,
                'total_results': len(all_results),
                'results': all_results[:20],
                'search_time': datetime.now().isoformat(),
                'sources_searched': ['academic', 'web', 'statistics'],
                'cache_key': cache_key
            }
            self.db.set_cache(cache_key, response, expires_in_hours=6)
            return response
        except Exception as e:
            logger.error(f"Search failed for {query}: {e}")
            raise

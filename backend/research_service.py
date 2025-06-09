import asyncio
import aiohttp
import hashlib
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import re
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
        """Generate a cache key for the query and filters"""
        content = f"{query}_{json.dumps(filters, sort_keys=True)}"
        return hashlib.md5(content.encode()).hexdigest()

    def _check_rate_limit(self, source: str, limit: int = 100) -> bool:
        """Check if we're within rate limits for a data source"""
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
        """Search academic databases and sources using real APIs"""
        results = []
        
        try:
            # Search arXiv for academic papers
            search = arxiv.Search(
                query=query,
                max_results=10,
                sort_by=arxiv.SortCriterion.Relevance
            )
            
            for paper in search.results():
                result = {
                    'title': paper.title,
                    'content': paper.summary[:500] + "..." if len(paper.summary) > 500 else paper.summary,
                    'source': 'arXiv',
                    'url': paper.entry_id,
                    'relevance_score': self._calculate_relevance_score_text(paper.title + " " + paper.summary, query),
                    'data_type': 'academic',
                    'metadata': {
                        'publication_date': paper.published.isoformat() if paper.published else None,
                        'authors': [author.name for author in paper.authors],
                        'journal': 'arXiv',
                        'categories': paper.categories,
                        'doi': paper.doi
                    }
                }
                results.append(result)
                
        except Exception as e:
            logger.error(f"Error searching arXiv: {e}")
            # Add a fallback result to indicate the error
            results.append({
                'title': f'arXiv Search Error for "{query}"',
                'content': f'Unable to retrieve arXiv results: {str(e)}',
                'source': 'arXiv',
                'url': '',
                'relevance_score': 0.1,
                'data_type': 'error',
                'metadata': {'error': str(e)}
            })

        # Search PubMed via web scraping (since no direct API key)
        try:
            if self.session:
                pubmed_url = f"https://pubmed.ncbi.nlm.nih.gov/?term={quote_plus(query)}&size=5"
                async with self.session.get(pubmed_url, timeout=10) as response:
                    if response.status == 200:
                        html = await response.text()
                        soup = BeautifulSoup(html, 'lxml')
                        
                        articles = soup.find_all('article', class_='full-docsum')[:3]
                        for article in articles:
                            title_elem = article.find('a', class_='docsum-title')
                            abstract_elem = article.find('div', class_='full-view-snippet')
                            
                            if title_elem:
                                title = title_elem.get_text(strip=True)
                                abstract = abstract_elem.get_text(strip=True) if abstract_elem else "Abstract not available"
                                link = "https://pubmed.ncbi.nlm.nih.gov" + title_elem.get('href', '')
                                
                                result = {
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
                                }
                                results.append(result)
                                
        except Exception as e:
            logger.error(f"Error searching PubMed: {e}")
        
        return results

    async def _search_web_sources(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search web sources using Wikipedia and web scraping"""
        results = []
        
        # Search Wikipedia
        try:
            # Search for Wikipedia articles
            search_results = wikipedia.search(query, results=5)
            
            for title in search_results[:3]:
                try:
                    page = wikipedia.page(title)
                    summary = wikipedia.summary(title, sentences=3)
                    
                    result = {
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
                    }
                    results.append(result)
                    
                except wikipedia.exceptions.DisambiguationError as e:
                    # Handle disambiguation by taking the first option
                    try:
                        page = wikipedia.page(e.options[0])
                        summary = wikipedia.summary(e.options[0], sentences=3)
                        
                        result = {
                            'title': page.title,
                            'content': summary,
                            'source': 'Wikipedia',
                            'url': page.url,
                            'relevance_score': self._calculate_relevance_score_text(page.title + " " + summary, query),
                            'data_type': 'encyclopedia',
                            'metadata': {
                                'publication_date': datetime.now().isoformat(),
                                'page_id': page.pageid,
                                'disambiguation': True
                            }
                        }
                        results.append(result)
                    except:
                        continue
                        
                except wikipedia.exceptions.PageError:
                    continue
                    
        except Exception as e:
            logger.error(f"Error searching Wikipedia: {e}")

        # Search news sources via web scraping
        try:
            if self.session:
                # Search Google News (basic scraping)
                news_url = f"https://news.google.com/rss/search?q={quote_plus(query)}&hl=en-US&gl=US&ceid=US:en"
                
                async with self.session.get(news_url, timeout=10) as response:
                    if response.status == 200:
                        content = await response.text()
                        # Parse RSS feed
                        soup = BeautifulSoup(content, 'lxml-xml')
                        items = soup.find_all('item')[:3]
                        
                        for item in items:
                            title = item.find('title')
                            description = item.find('description')
                            link = item.find('link')
                            pub_date = item.find('pubDate')
                            
                            if title and description:
                                result = {
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
                                }
                                results.append(result)
                                
        except Exception as e:
            logger.error(f"Error searching news sources: {e}")
        
        return results

    async def _search_statistical_sources(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search statistical databases and government sources"""
        results = []
        
        # Search World Bank data
        try:
            if self.session:
                # World Bank API search
                wb_url = f"https://api.worldbank.org/v2/indicator?format=json&q={quote_plus(query)}"
                
                async with self.session.get(wb_url, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        if len(data) > 1 and data[1]:
                            indicators = data[1][:3]  # Get first 3 indicators
                            
                            for indicator in indicators:
                                result = {
                                    'title': f"World Bank: {indicator.get('name', 'Statistical Indicator')}",
                                    'content': f"Statistical indicator: {indicator.get('sourceNote', 'World Bank statistical data related to ' + query)}",
                                    'source': 'World Bank',
                                    'url': f"https://data.worldbank.org/indicator/{indicator.get('id', '')}",
                                    'relevance_score': self._calculate_relevance_score_text(indicator.get('name', '') + " " + indicator.get('sourceNote', ''), query),
                                    'data_type': 'statistics',
                                    'metadata': {
                                        'indicator_id': indicator.get('id'),
                                        'source_organization': indicator.get('sourceOrganization'),
                                        'last_updated': datetime.now().isoformat(),
                                        'data_type': 'economic_indicator'
                                    }
                                }
                                results.append(result)
                                
        except Exception as e:
            logger.error(f"Error searching World Bank data: {e}")

        # Search US Census data (if applicable)
        try:
            if 'united states' in query.lower() or 'us ' in query.lower() or 'census' in query.lower():
                if self.session:
                    # Census API search (basic)
                    census_url = "https://api.census.gov/data.json"
                    
                    async with self.session.get(census_url, timeout=10) as response:
                        if response.status == 200:
                            data = await response.json()
                            
                            # Filter datasets related to query
                            relevant_datasets = []
                            for dataset in data.get('dataset', [])[:20]:
                                title = dataset.get('title', '').lower()
                                description = dataset.get('description', '').lower()
                                
                                if any(term in title or term in description for term in query.lower().split()):
                                    relevant_datasets.append(dataset)
                                    
                            for dataset in relevant_datasets[:2]:
                                result = {
                                    'title': f"US Census: {dataset.get('title', 'Census Dataset')}",
                                    'content': dataset.get('description', 'US Census Bureau statistical data'),
                                    'source': 'US Census Bureau',
                                    'url': f"https://api.census.gov/data/{dataset.get('c_vintage', '')}/{dataset.get('c_dataset', '')}",
                                    'relevance_score': self._calculate_relevance_score_text(dataset.get('title', '') + " " + dataset.get('description', ''), query),
                                    'data_type': 'statistics',
                                    'metadata': {
                                        'vintage': dataset.get('c_vintage'),
                                        'dataset_id': dataset.get('c_dataset'),
                                        'last_updated': datetime.now().isoformat(),
                                        'geographic_level': dataset.get('c_geographyLink')
                                    }
                                }
                                results.append(result)
                                
        except Exception as e:
            logger.error(f"Error searching Census data: {e}")
        
        return results

    def _calculate_relevance_score_text(self, text: str, query: str) -> float:
        """Calculate relevance score based on text content and query"""
        if not text or not query:
            return 0.0
            
        text_lower = text.lower()
        query_terms = [term.strip() for term in query.lower().split() if len(term.strip()) > 2]
        
        if not query_terms:
            return 0.5
        
        score = 0.0
        
        # Exact phrase match (highest weight)
        if query.lower() in text_lower:
            score += 0.4
        
        # Individual term matches
        term_matches = sum(1 for term in query_terms if term in text_lower)
        term_score = (term_matches / len(query_terms)) * 0.4
        score += term_score
        
        # Proximity bonus (terms appearing close together)
        for i, term1 in enumerate(query_terms):
            for term2 in query_terms[i+1:]:
                if term1 in text_lower and term2 in text_lower:
                    pos1 = text_lower.find(term1)
                    pos2 = text_lower.find(term2)
                    distance = abs(pos1 - pos2)
                    if distance < 50:  # Terms within 50 characters
                        score += 0.1
        
        # Length penalty for very short content
        if len(text) < 100:
            score *= 0.8
        
        return min(1.0, score)

    def _filter_results(self, results: List[Dict[str, Any]], filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Apply filters to search results"""
        filtered_results = results
        
        # Date range filter
        if 'date_from' in filters and 'date_to' in filters and filters['date_from'] and filters['date_to']:
            try:
                date_from = datetime.fromisoformat(filters['date_from'])
                date_to = datetime.fromisoformat(filters['date_to'])
                
                filtered_results = []
                for result in results:
                    pub_date_str = result.get('metadata', {}).get('publication_date')
                    if pub_date_str:
                        try:
                            pub_date = datetime.fromisoformat(pub_date_str.replace('Z', '+00:00'))
                            if date_from <= pub_date <= date_to:
                                filtered_results.append(result)
                        except:
                            # If date parsing fails, include the result
                            filtered_results.append(result)
                    else:
                        # If no publication date, include the result
                        filtered_results.append(result)
            except:
                # If date filter parsing fails, don't apply date filter
                pass
        
        # Source filter
        if 'sources' in filters and filters['sources']:
            allowed_sources = filters['sources']
            source_mapping = {
                'academic': ['arXiv', 'PubMed'],
                'web': ['Wikipedia', 'Google News'],
                'statistics': ['World Bank', 'US Census Bureau']
            }
            
            allowed_source_names = []
            for source_type in allowed_sources:
                allowed_source_names.extend(source_mapping.get(source_type, [source_type]))
            
            filtered_results = [
                result for result in filtered_results
                if result['source'] in allowed_source_names
            ]
        
        # Data type filter
        if 'data_types' in filters and filters['data_types']:
            allowed_types = filters['data_types']
            filtered_results = [
                result for result in filtered_results
                if result['data_type'] in allowed_types
            ]
        
        # Relevance threshold
        if 'min_relevance' in filters:
            min_relevance = float(filters['min_relevance'])
            filtered_results = [
                result for result in filtered_results
                if result['relevance_score'] >= min_relevance
            ]
        
        return filtered_results

    def _calculate_relevance_score(self, result: Dict[str, Any], query: str) -> float:
        """Calculate relevance score for a result (legacy method)"""
        return self._calculate_relevance_score_text(
            result.get('title', '') + " " + result.get('content', ''), 
            query
        )

    async def search(self, query: str, filters: Dict[str, Any] = None, user_id: str = None) -> Dict[str, Any]:
        """Perform comprehensive research search using real data sources"""
        if filters is None:
            filters = {}
        
        # Check cache first
        cache_key = self._generate_cache_key(query, filters)
        cached_result = self.db.get_cached_data(cache_key)
        if cached_result:
            logger.info(f"Returning cached results for query: {query}")
            return cached_result
        
        # Save query to database
        query_id = self.db.save_query(query, filters, user_id)
        
        try:
            # Perform searches across different sources
            all_results = []
            
            # Academic sources
            if not filters.get('sources') or 'academic' in filters.get('sources', []):
                if self._check_rate_limit('academic'):
                    academic_results = await self._search_academic_sources(query, filters)
                    all_results.extend(academic_results)
            
            # Web sources
            if not filters.get('sources') or 'web' in filters.get('sources', []):
                if self._check_rate_limit('web'):
                    web_results = await self._search_web_sources(query, filters)
                    all_results.extend(web_results)
            
            # Statistical sources
            if not filters.get('sources') or 'statistics' in filters.get('sources', []):
                if self._check_rate_limit('statistics'):
                    stats_results = await self._search_statistical_sources(query, filters)
                    all_results.extend(stats_results)
            
            # Apply filters
            filtered_results = self._filter_results(all_results, filters)
            
            # Sort by relevance
            filtered_results.sort(key=lambda x: x['relevance_score'], reverse=True)
            
            # Save results to database
            self.db.save_results(query_id, filtered_results)
            
            # Prepare response
            response = {
                'query_id': query_id,
                'query': query,
                'filters': filters,
                'total_results': len(filtered_results),
                'results': filtered_results[:20],  # Return first 20 results
                'search_time': datetime.now().isoformat(),
                'sources_searched': ['academic', 'web', 'statistics'],
                'cache_key': cache_key
            }
            
            # Cache the results
            self.db.set_cache(cache_key, response, expires_in_hours=6)
            
            return response
            
        except Exception as e:
            logger.error(f"Search failed for query '{query}': {e}")
            raise

    def get_search_suggestions(self, partial_query: str) -> List[str]:
        """Get search suggestions based on partial query and previous searches"""
        suggestions = []
        
        # Get suggestions from previous successful queries
        try:
            recent_queries = self.db.get_recent_queries(limit=50)
            
            # Find queries that contain the partial query
            for query_data in recent_queries:
                query_text = query_data.get('query_text', '').lower()
                if partial_query.lower() in query_text and query_text not in suggestions:
                    suggestions.append(query_data.get('query_text'))
                    
            # If we have fewer than 3 suggestions, add some generic ones
            if len(suggestions) < 3:
                generic_suggestions = [
                    f"{partial_query} trends",
                    f"{partial_query} statistics",
                    f"{partial_query} research",
                    f"{partial_query} analysis",
                    f"{partial_query} data"
                ]
                
                for suggestion in generic_suggestions:
                    if suggestion not in suggestions:
                        suggestions.append(suggestion)
                        if len(suggestions) >= 5:
                            break
                            
        except Exception as e:
            logger.error(f"Error getting search suggestions: {e}")
            # Fallback to generic suggestions
            suggestions = [
                f"{partial_query} trends",
                f"{partial_query} statistics",
                f"{partial_query} research",
                f"{partial_query} analysis",
                f"{partial_query} data"
            ]
        
        return suggestions[:5]

    def get_data_sources(self) -> List[Dict[str, Any]]:
        """Get available data sources with real source information"""
        return [
            {
                'id': 'academic',
                'name': 'Academic Databases',
                'description': 'arXiv preprints and PubMed medical literature',
                'types': ['academic', 'meta-analysis'],
                'is_active': True,
                'sources': ['arXiv', 'PubMed']
            },
            {
                'id': 'web',
                'name': 'Web Sources',
                'description': 'Wikipedia articles and news from Google News',
                'types': ['encyclopedia', 'news'],
                'is_active': True,
                'sources': ['Wikipedia', 'Google News']
            },
            {
                'id': 'statistics',
                'name': 'Statistical Databases',
                'description': 'World Bank indicators and US Census data',
                'types': ['statistics', 'economic-data'],
                'is_active': True,
                'sources': ['World Bank', 'US Census Bureau']
            }
        ]
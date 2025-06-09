import asyncio
import aiohttp
import hashlib
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import re
from urllib.parse import quote_plus
import json

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
        """Search academic databases and sources"""
        results = []
        
        # Simulate academic database search
        # In a real implementation, this would integrate with APIs like:
        # - arXiv API
        # - PubMed API
        # - Google Scholar (via scraping)
        # - CrossRef API
        
        academic_results = [
            {
                'title': f'Academic Study on {query}',
                'content': f'Comprehensive research findings related to {query} from peer-reviewed sources.',
                'source': 'Academic Database',
                'url': f'https://example-academic.com/study/{quote_plus(query)}',
                'relevance_score': 0.9,
                'data_type': 'academic',
                'metadata': {
                    'publication_date': '2024-01-15',
                    'authors': ['Dr. Smith', 'Dr. Johnson'],
                    'journal': 'Research Journal',
                    'citations': 45
                }
            },
            {
                'title': f'Meta-Analysis: {query}',
                'content': f'Statistical analysis and meta-review of multiple studies on {query}.',
                'source': 'PubMed',
                'url': f'https://pubmed.ncbi.nlm.nih.gov/search/{quote_plus(query)}',
                'relevance_score': 0.85,
                'data_type': 'meta-analysis',
                'metadata': {
                    'publication_date': '2024-02-20',
                    'study_count': 23,
                    'sample_size': 15000
                }
            }
        ]
        
        results.extend(academic_results)
        return results

    async def _search_web_sources(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search web sources and news"""
        results = []
        
        # Simulate web search results
        # In a real implementation, this would use:
        # - Google Custom Search API
        # - Bing Search API
        # - News APIs
        # - Web scraping with proper rate limiting
        
        web_results = [
            {
                'title': f'Industry Report: {query}',
                'content': f'Latest industry insights and trends related to {query}.',
                'source': 'Industry News',
                'url': f'https://example-news.com/report/{quote_plus(query)}',
                'relevance_score': 0.8,
                'data_type': 'news',
                'metadata': {
                    'publication_date': '2024-03-01',
                    'author': 'Industry Expert',
                    'category': 'Business'
                }
            },
            {
                'title': f'Market Analysis: {query}',
                'content': f'Comprehensive market analysis and forecasting for {query}.',
                'source': 'Market Research',
                'url': f'https://example-market.com/analysis/{quote_plus(query)}',
                'relevance_score': 0.75,
                'data_type': 'market-data',
                'metadata': {
                    'publication_date': '2024-02-28',
                    'market_size': '$2.5B',
                    'growth_rate': '15%'
                }
            }
        ]
        
        results.extend(web_results)
        return results

    async def _search_statistical_sources(self, query: str, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search statistical databases"""
        results = []
        
        # Simulate statistical data search
        # In a real implementation, this would integrate with:
        # - Government statistical APIs
        # - World Bank API
        # - OECD API
        # - Census data APIs
        
        stats_results = [
            {
                'title': f'Statistical Data: {query}',
                'content': f'Official statistical data and trends for {query}.',
                'source': 'Government Statistics',
                'url': f'https://example-stats.gov/data/{quote_plus(query)}',
                'relevance_score': 0.95,
                'data_type': 'statistics',
                'metadata': {
                    'data_period': '2020-2024',
                    'sample_size': 100000,
                    'confidence_level': '95%',
                    'last_updated': '2024-03-01'
                }
            }
        ]
        
        results.extend(stats_results)
        return results

    def _filter_results(self, results: List[Dict[str, Any]], filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Apply filters to search results"""
        filtered_results = results
        
        # Date range filter
        if 'date_from' in filters and 'date_to' in filters:
            date_from = datetime.fromisoformat(filters['date_from'])
            date_to = datetime.fromisoformat(filters['date_to'])
            
            filtered_results = [
                result for result in filtered_results
                if 'publication_date' in result.get('metadata', {})
                and date_from <= datetime.fromisoformat(result['metadata']['publication_date']) <= date_to
            ]
        
        # Source filter
        if 'sources' in filters and filters['sources']:
            allowed_sources = filters['sources']
            filtered_results = [
                result for result in filtered_results
                if result['source'] in allowed_sources
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
        """Calculate relevance score for a result"""
        score = 0.0
        query_terms = query.lower().split()
        
        # Title relevance
        title_matches = sum(1 for term in query_terms if term in result['title'].lower())
        score += (title_matches / len(query_terms)) * 0.4
        
        # Content relevance
        content_matches = sum(1 for term in query_terms if term in result['content'].lower())
        score += (content_matches / len(query_terms)) * 0.3
        
        # Source credibility
        credible_sources = ['Academic Database', 'PubMed', 'Government Statistics']
        if result['source'] in credible_sources:
            score += 0.2
        
        # Recency bonus
        if 'publication_date' in result.get('metadata', {}):
            pub_date = datetime.fromisoformat(result['metadata']['publication_date'])
            days_old = (datetime.now() - pub_date).days
            if days_old < 30:
                score += 0.1
            elif days_old < 90:
                score += 0.05
        
        return min(1.0, score)

    async def search(self, query: str, filters: Dict[str, Any] = None, user_id: str = None) -> Dict[str, Any]:
        """Perform comprehensive research search"""
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
            
            # Calculate relevance scores
            for result in all_results:
                if 'relevance_score' not in result:
                    result['relevance_score'] = self._calculate_relevance_score(result, query)
            
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
        """Get search suggestions based on partial query"""
        # In a real implementation, this would use:
        # - Previous successful queries
        # - Popular search terms
        # - Auto-complete APIs
        
        suggestions = [
            f"{partial_query} trends",
            f"{partial_query} statistics",
            f"{partial_query} market analysis",
            f"{partial_query} research findings",
            f"{partial_query} industry report"
        ]
        
        return suggestions[:5]

    def get_data_sources(self) -> List[Dict[str, Any]]:
        """Get available data sources"""
        return [
            {
                'id': 'academic',
                'name': 'Academic Databases',
                'description': 'Peer-reviewed research papers and academic studies',
                'types': ['academic', 'meta-analysis'],
                'is_active': True
            },
            {
                'id': 'web',
                'name': 'Web Sources',
                'description': 'News articles, industry reports, and web content',
                'types': ['news', 'market-data', 'reports'],
                'is_active': True
            },
            {
                'id': 'statistics',
                'name': 'Statistical Databases',
                'description': 'Government statistics and official data',
                'types': ['statistics', 'census', 'economic-data'],
                'is_active': True
            }
        ]
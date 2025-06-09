import asyncio
import pytest
from backend.research_service import ResearchService
from backend.database import ResearchDatabase
from backend.external_sources import fetch_wikipedia, fetch_arxiv

async def test_research_service():
    """Test the research service functionality with real data"""
    print("Testing ResearchService with real data sources...")
    
    async with ResearchService() as service:
        # Test search with a simple query
        results = await service.search(
            query="artificial intelligence",
            filters={
                'sources': ['academic', 'web'],
                'min_relevance': 0.3
            }
        )
        
        print(f"Search Results: {results['total_results']} found")
        print(f"Sources searched: {results['sources_searched']}")
        
        for i, result in enumerate(results['results'][:3]):
            print(f"\n{i+1}. {result['title']}")
            print(f"   Source: {result['source']}")
            print(f"   Relevance: {result['relevance_score']:.2f}")
            print(f"   Content: {result['content'][:100]}...")
        
        # Test suggestions
        suggestions = service.get_search_suggestions("AI")
        print(f"\nSuggestions for 'AI': {suggestions}")
        
        # Test data sources
        sources = service.get_data_sources()
        print(f"\nAvailable sources: {len(sources)}")
        for source in sources:
            print(f"- {source['name']}: {source['description']}")

def test_database():
    """Test database functionality"""
    print("\nTesting Database...")
    db = ResearchDatabase(":memory:")  # Use in-memory database for testing
    
    # Test saving query
    query_id = db.save_query("test query", {"source": "academic"})
    print(f"Saved query with ID: {query_id}")
    
    # Test saving results
    test_results = [
        {
            'title': 'Test Result',
            'content': 'Test content',
            'source': 'Test Source',
            'relevance_score': 0.8,
            'data_type': 'test'
        }
    ]
    db.save_results(query_id, test_results)
    
    # Test retrieving results
    results = db.get_query_results(query_id)
    print(f"Retrieved {len(results['results'])} results")

def test_external_sources():
    """Test external data sources directly"""
    print("\nTesting External Sources...")
    
    # Test Wikipedia
    wiki_result = fetch_wikipedia("machine learning")
    print(f"Wikipedia result length: {len(wiki_result)} characters")
    print(f"Wikipedia preview: {wiki_result[:150]}...")
    
    # Test arXiv
    arxiv_results = fetch_arxiv("neural networks", 3)
    print(f"arXiv results: {len(arxiv_results)} papers")
    for paper in arxiv_results:
        print(f"- {paper.get('title', 'No title')[:80]}...")

if __name__ == "__main__":
    print("=== Testing Research System ===")
    
    print("\n1. Testing External Sources...")
    test_external_sources()
    
    print("\n2. Testing Database...")
    test_database()
    
    print("\n3. Testing Research Service...")
    asyncio.run(test_research_service())
    
    print("\n=== All tests completed! ===")
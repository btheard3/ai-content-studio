import asyncio
import pytest
from backend.research_service import ResearchService
from backend.database import ResearchDatabase

async def test_research_service():
    """Test the research service functionality"""
    async with ResearchService() as service:
        # Test search
        results = await service.search(
            query="AI in healthcare",
            filters={
                'sources': ['academic', 'web'],
                'min_relevance': 0.5
            }
        )
        
        print(f"Search Results: {results['total_results']} found")
        for result in results['results'][:3]:
            print(f"- {result['title']} (Score: {result['relevance_score']:.2f})")
        
        # Test suggestions
        suggestions = service.get_search_suggestions("AI")
        print(f"Suggestions: {suggestions}")
        
        # Test data sources
        sources = service.get_data_sources()
        print(f"Available sources: {len(sources)}")

def test_database():
    """Test database functionality"""
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

if __name__ == "__main__":
    print("Testing Research Service...")
    asyncio.run(test_research_service())
    
    print("\nTesting Database...")
    test_database()
    
    print("\nAll tests completed!")
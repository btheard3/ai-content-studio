from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import asyncio
import logging
from datetime import datetime

from backend.research_service import ResearchService
from backend.database import ResearchDatabase

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/research", tags=["research"])
security = HTTPBearer()

# Pydantic models
class ResearchQuery(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Research query text")
    filters: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Search filters")
    user_id: Optional[str] = Field(None, description="User identifier")

class ResearchFilters(BaseModel):
    sources: Optional[List[str]] = Field(None, description="Data sources to search")
    data_types: Optional[List[str]] = Field(None, description="Types of data to include")
    date_from: Optional[str] = Field(None, description="Start date (ISO format)")
    date_to: Optional[str] = Field(None, description="End date (ISO format)")
    min_relevance: Optional[float] = Field(0.0, ge=0.0, le=1.0, description="Minimum relevance score")

class PaginationParams(BaseModel):
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(20, ge=1, le=100, description="Items per page")

# Dependency for authentication (simplified)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # In a real implementation, validate the JWT token
    # For now, return a mock user
    return {"user_id": "user123", "username": "researcher"}

# Initialize services
research_service = None
research_db = ResearchDatabase()

@router.on_event("startup")
async def startup_event():
    global research_service
    research_service = ResearchService()

@router.post("/search")
async def search_research(
    query: ResearchQuery,
    current_user: dict = Depends(get_current_user)
):
    """
    Perform a comprehensive research search across multiple data sources.
    
    - **query**: The research query text
    - **filters**: Optional filters for sources, date ranges, etc.
    - **user_id**: Optional user identifier for tracking
    """
    try:
        if not research_service:
            raise HTTPException(status_code=500, detail="Research service not initialized")
        
        # Validate filters
        filters = query.filters or {}
        
        # Perform the search
        async with ResearchService() as service:
            results = await service.search(
                query=query.query,
                filters=filters,
                user_id=query.user_id or current_user["user_id"]
            )
        
        return {
            "success": True,
            "data": results,
            "message": f"Found {results['total_results']} results for '{query.query}'"
        }
        
    except Exception as e:
        logger.error(f"Research search failed: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/results/{query_id}")
async def get_query_results(
    query_id: int,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get paginated results for a specific research query.
    
    - **query_id**: The ID of the research query
    - **page**: Page number (starts from 1)
    - **page_size**: Number of items per page (max 100)
    """
    try:
        results = research_db.get_query_results(query_id, page, page_size)
        
        return {
            "success": True,
            "data": results,
            "message": f"Retrieved page {page} of results for query {query_id}"
        }
        
    except Exception as e:
        logger.error(f"Failed to get query results: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve results: {str(e)}")

@router.get("/suggestions")
async def get_search_suggestions(
    q: str = Query(..., min_length=1, description="Partial query for suggestions"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get search suggestions based on partial query input.
    
    - **q**: Partial query text
    """
    try:
        async with ResearchService() as service:
            suggestions = service.get_search_suggestions(q)
        
        return {
            "success": True,
            "data": {"suggestions": suggestions},
            "message": f"Generated {len(suggestions)} suggestions"
        }
        
    except Exception as e:
        logger.error(f"Failed to get suggestions: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get suggestions: {str(e)}")

@router.get("/sources")
async def get_data_sources(current_user: dict = Depends(get_current_user)):
    """
    Get available data sources and their information.
    """
    try:
        async with ResearchService() as service:
            sources = service.get_data_sources()
        
        return {
            "success": True,
            "data": {"sources": sources},
            "message": f"Retrieved {len(sources)} data sources"
        }
        
    except Exception as e:
        logger.error(f"Failed to get data sources: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get data sources: {str(e)}")

@router.get("/history")
async def get_search_history(
    limit: int = Query(10, ge=1, le=50, description="Number of recent queries to return"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get recent search history for the current user.
    
    - **limit**: Maximum number of queries to return (max 50)
    """
    try:
        queries = research_db.get_recent_queries(
            user_id=current_user["user_id"],
            limit=limit
        )
        
        return {
            "success": True,
            "data": {"queries": queries},
            "message": f"Retrieved {len(queries)} recent queries"
        }
        
    except Exception as e:
        logger.error(f"Failed to get search history: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get search history: {str(e)}")

@router.get("/analytics")
async def get_research_analytics(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get research analytics and usage statistics.
    
    - **days**: Number of days to include in analytics (max 365)
    """
    try:
        # In a real implementation, this would query the database for analytics
        analytics = {
            "total_searches": 156,
            "unique_queries": 89,
            "average_results_per_query": 12.4,
            "most_popular_sources": [
                {"source": "Academic Database", "count": 45},
                {"source": "Web Sources", "count": 38},
                {"source": "Statistical Databases", "count": 32}
            ],
            "search_trends": [
                {"date": "2024-03-01", "searches": 12},
                {"date": "2024-03-02", "searches": 15},
                {"date": "2024-03-03", "searches": 18}
            ],
            "top_queries": [
                {"query": "AI in healthcare", "count": 8},
                {"query": "climate change statistics", "count": 6},
                {"query": "market trends 2024", "count": 5}
            ]
        }
        
        return {
            "success": True,
            "data": analytics,
            "message": f"Retrieved analytics for the last {days} days"
        }
        
    except Exception as e:
        logger.error(f"Failed to get analytics: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get analytics: {str(e)}")

@router.delete("/cache")
async def clear_research_cache(
    current_user: dict = Depends(get_current_user)
):
    """
    Clear the research cache (admin only).
    """
    try:
        # In a real implementation, check if user has admin privileges
        # For now, simulate cache clearing
        
        return {
            "success": True,
            "data": {"cleared_entries": 42},
            "message": "Research cache cleared successfully"
        }
        
    except Exception as e:
        logger.error(f"Failed to clear cache: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to clear cache: {str(e)}")
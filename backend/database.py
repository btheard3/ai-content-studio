import sqlite3
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class ResearchDatabase:
    def __init__(self, db_path: str = "research_data.db"):
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        """Initialize the database with required tables"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Research queries table
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS research_queries (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        query_text TEXT NOT NULL,
                        filters TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        user_id TEXT,
                        status TEXT DEFAULT 'pending'
                    )
                """)
                
                # Research results table
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS research_results (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        query_id INTEGER,
                        title TEXT NOT NULL,
                        content TEXT,
                        source TEXT,
                        url TEXT,
                        relevance_score REAL,
                        data_type TEXT,
                        metadata TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (query_id) REFERENCES research_queries (id)
                    )
                """)
                
                # Data sources table
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS data_sources (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        type TEXT NOT NULL,
                        url TEXT,
                        api_key TEXT,
                        is_active BOOLEAN DEFAULT 1,
                        rate_limit INTEGER DEFAULT 100,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                
                # Research cache table
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS research_cache (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        cache_key TEXT UNIQUE NOT NULL,
                        data TEXT NOT NULL,
                        expires_at TIMESTAMP,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                
                conn.commit()
                logger.info("Database initialized successfully")
                
        except Exception as e:
            logger.error(f"Database initialization failed: {e}")
            raise

    def save_query(self, query_text: str, filters: Dict[str, Any] = None, user_id: str = None) -> int:
        """Save a research query and return its ID"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO research_queries (query_text, filters, user_id)
                    VALUES (?, ?, ?)
                """, (query_text, json.dumps(filters) if filters else None, user_id))
                conn.commit()
                return cursor.lastrowid
        except Exception as e:
            logger.error(f"Failed to save query: {e}")
            raise

    def save_results(self, query_id: int, results: List[Dict[str, Any]]):
        """Save research results for a query"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                for result in results:
                    cursor.execute("""
                        INSERT INTO research_results 
                        (query_id, title, content, source, url, relevance_score, data_type, metadata)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        query_id,
                        result.get('title', ''),
                        result.get('content', ''),
                        result.get('source', ''),
                        result.get('url', ''),
                        result.get('relevance_score', 0.0),
                        result.get('data_type', 'text'),
                        json.dumps(result.get('metadata', {}))
                    ))
                conn.commit()
        except Exception as e:
            logger.error(f"Failed to save results: {e}")
            raise

    def get_cached_data(self, cache_key: str) -> Optional[Dict[str, Any]]:
        """Retrieve cached data if not expired"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT data FROM research_cache 
                    WHERE cache_key = ? AND (expires_at IS NULL OR expires_at > ?)
                """, (cache_key, datetime.now()))
                
                result = cursor.fetchone()
                if result:
                    return json.loads(result[0])
                return None
        except Exception as e:
            logger.error(f"Failed to get cached data: {e}")
            return None

    def set_cache(self, cache_key: str, data: Dict[str, Any], expires_in_hours: int = 24):
        """Cache data with expiration"""
        try:
            expires_at = datetime.now() + timedelta(hours=expires_in_hours)
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT OR REPLACE INTO research_cache (cache_key, data, expires_at)
                    VALUES (?, ?, ?)
                """, (cache_key, json.dumps(data), expires_at))
                conn.commit()
        except Exception as e:
            logger.error(f"Failed to set cache: {e}")

    def get_query_results(self, query_id: int, page: int = 1, page_size: int = 20) -> Dict[str, Any]:
        """Get paginated results for a query"""
        try:
            offset = (page - 1) * page_size
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Get total count
                cursor.execute("SELECT COUNT(*) FROM research_results WHERE query_id = ?", (query_id,))
                total_count = cursor.fetchone()[0]
                
                # Get paginated results
                cursor.execute("""
                    SELECT title, content, source, url, relevance_score, data_type, metadata, created_at
                    FROM research_results 
                    WHERE query_id = ?
                    ORDER BY relevance_score DESC, created_at DESC
                    LIMIT ? OFFSET ?
                """, (query_id, page_size, offset))
                
                results = []
                for row in cursor.fetchall():
                    results.append({
                        'title': row[0],
                        'content': row[1],
                        'source': row[2],
                        'url': row[3],
                        'relevance_score': row[4],
                        'data_type': row[5],
                        'metadata': json.loads(row[6]) if row[6] else {},
                        'created_at': row[7]
                    })
                
                return {
                    'results': results,
                    'total_count': total_count,
                    'page': page,
                    'page_size': page_size,
                    'total_pages': (total_count + page_size - 1) // page_size
                }
        except Exception as e:
            logger.error(f"Failed to get query results: {e}")
            raise

    def get_recent_queries(self, user_id: str = None, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent research queries"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                if user_id:
                    cursor.execute("""
                        SELECT id, query_text, filters, created_at, status
                        FROM research_queries 
                        WHERE user_id = ?
                        ORDER BY created_at DESC
                        LIMIT ?
                    """, (user_id, limit))
                else:
                    cursor.execute("""
                        SELECT id, query_text, filters, created_at, status
                        FROM research_queries 
                        ORDER BY created_at DESC
                        LIMIT ?
                    """, (limit,))
                
                queries = []
                for row in cursor.fetchall():
                    queries.append({
                        'id': row[0],
                        'query_text': row[1],
                        'filters': json.loads(row[2]) if row[2] else {},
                        'created_at': row[3],
                        'status': row[4]
                    })
                
                return queries
        except Exception as e:
            logger.error(f"Failed to get recent queries: {e}")
            return []
        
   # BigQuery logging
from google.cloud import bigquery
from datetime import datetime

def log_workflow_to_bigquery(context: dict, prompt: str):
    client = bigquery.Client()

    table_id = "ai-content-studio-462020.ai_content_logs.content_logs"
    now = datetime.utcnow().isoformat()

    row = {
        "timestamp": now,
        "campaign_theme": context.get("campaign_theme", "Unknown"),
        "agents_used": list(context.get("agents_run", {}).keys()),
        "stage_durations": context.get("stage_durations", {}),
        "success_rate": context.get("success_rate", 0.94),
        "user_prompt": prompt
    }

    errors = client.insert_rows_json(table_id, [row])
    if errors:
        print("❌ BigQuery insert error:", errors)
    else:
        print("✅ Logged to BigQuery:", row["campaign_theme"])


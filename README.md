# AI Content Studio - Research & Data Agent

A comprehensive research and data agent with both frontend and backend components for intelligent content research and analysis.

## Features

### Frontend Components
- **Clean, intuitive user interface** with search input field and advanced filters
- **Real-time search suggestions** with debounced API calls
- **Advanced filtering system** for data sources, date ranges, and relevance scores
- **Organized, paginated results display** with detailed result cards
- **Data visualization components** for research analytics and trends
- **Loading states and error handling** with smooth animations
- **Responsive design** optimized for all device sizes

### Backend Components
- **RESTful API endpoints** for data retrieval and processing
- **Robust error handling** and input validation with Pydantic models
- **SQLite database** for storing research results and caching
- **Rate limiting and caching mechanisms** to optimize performance
- **Multiple data source integration** (academic, web, statistical)
- **Authentication and authorization** with JWT token support
- **Comprehensive logging and monitoring**

## Technical Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Framer Motion** for smooth animations and transitions
- **Tailwind CSS** for responsive styling
- **Axios** for API communication
- **Recharts** for data visualization
- **Lucide React** for consistent iconography

### Backend
- **FastAPI** for high-performance API development
- **SQLite** for local data storage and caching
- **OpenAI API** for intelligent content analysis
- **Async/await** for concurrent request handling
- **Pydantic** for data validation and serialization
- **CORS middleware** for cross-origin requests

## Installation & Setup

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
# Create .env file
OPENAI_API_KEY=your_openai_api_key_here
```

3. Start the backend server:
```bash
python backend/main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Documentation

### Research Endpoints

- `POST /api/research/search` - Perform comprehensive research search
- `GET /api/research/results/{query_id}` - Get paginated results for a query
- `GET /api/research/suggestions` - Get search suggestions
- `GET /api/research/sources` - Get available data sources
- `GET /api/research/history` - Get search history
- `GET /api/research/analytics` - Get usage analytics

### Content Workflow Endpoints

- `POST /run_workflow` - Execute multi-agent content workflow
- `POST /run/{agent_id}` - Run individual agent
- `GET /workflow/info` - Get workflow information
- `GET /agents` - List all available agents

## Usage Examples

### Basic Research Search

```typescript
const searchResults = await axios.post('/api/research/search', {
  query: 'AI applications in healthcare',
  filters: {
    sources: ['academic', 'web'],
    min_relevance: 0.7,
    date_from: '2023-01-01',
    date_to: '2024-12-31'
  }
});
```

### Advanced Filtering

```typescript
const filters = {
  sources: ['academic', 'statistics'],
  data_types: ['academic', 'meta-analysis'],
  min_relevance: 0.8,
  date_from: '2024-01-01'
};
```

## Architecture

### Database Schema

- **research_queries** - Store user search queries
- **research_results** - Store search results with metadata
- **data_sources** - Configure available data sources
- **research_cache** - Cache frequently accessed data

### Security Features

- **JWT Authentication** for API access
- **Rate limiting** to prevent abuse
- **Input validation** with Pydantic models
- **CORS configuration** for secure cross-origin requests
- **SQL injection protection** with parameterized queries

### Performance Optimizations

- **Async/await** for concurrent processing
- **Database caching** with expiration
- **Debounced search suggestions**
- **Paginated results** for large datasets
- **Connection pooling** for database access

## Testing

Run the test suite:

```bash
# Backend tests
python backend/test_research.py

# Frontend tests (if implemented)
npm test
```

## Deployment

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

```bash
# Production environment
OPENAI_API_KEY=your_production_key
DATABASE_URL=your_database_url
JWT_SECRET_KEY=your_jwt_secret
CORS_ORIGINS=https://yourdomain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
# AI Content Studio - Multi-Agent Content Generation Platform

A comprehensive AI-powered content generation platform with research capabilities, code generation, and video creation using Elai.io.

## Features

### Core Components
- **Multi-Agent Workflow System** - Coordinated AI agents for content creation
- **Research & Data Agent** - Real-time research across academic, web, and statistical sources
- **Code Generator** - AI-powered code generation in multiple programming languages
- **Video Generation** - Professional AI video creation using Elai.io API
- **Content Pipeline** - End-to-end content creation from strategy to publishing

### Frontend Components
- **React 18** with TypeScript for type safety
- **Framer Motion** for smooth animations and transitions
- **Tailwind CSS** for responsive styling
- **Real-time search suggestions** with debounced API calls
- **Advanced filtering system** for data sources and content types
- **Responsive design** optimized for all device sizes

### Backend Components
- **FastAPI** for high-performance API development
- **Agent-based architecture** for modular AI workflows
- **SQLite database** for research caching and data storage
- **OpenAI API** integration for intelligent content generation
- **Elai.io API** integration for professional video creation
- **Async/await** for concurrent request handling

## Technical Stack

### Frontend
- **React 18** with TypeScript
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **FastAPI** with Python 3.9+
- **OpenAI API** for content generation
- **Elai.io API** for video creation
- **SQLite** for data storage
- **Async/await** for performance
- **Pydantic** for data validation

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
ELAI_API_KEY=your_elai_api_key_here
```

3. Start the backend server:
```bash
python backend/main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Documentation

### Core Endpoints

- `POST /run_workflow` - Execute multi-agent content workflow
- `POST /run_video_workflow` - Execute script generation + video creation
- `POST /generate_elai_video` - Direct Elai.io video generation
- `POST /generate_code` - AI code generation
- `GET /elai/templates` - Get available video templates
- `GET /elai/voices` - Get available video voices

### Research Endpoints

- `POST /api/research/search` - Comprehensive research search
- `GET /api/research/analytics` - Usage analytics
- `GET /api/research/sources` - Available data sources

## Usage Examples

### Video Generation

```typescript
const videoResult = await apiService.generateElaiVideo({
  text: "Welcome to our AI platform that transforms business operations",
  title: "AI Platform Demo",
  template_id: "professional",
  voice_id: "en-US-1"
});
```

### Code Generation

```typescript
const codeResult = await apiService.generateCode({
  description: "REST API for task management with authentication",
  language: "python",
  framework: "fastapi",
  complexity: "medium",
  include_tests: true
});
```

### Research Search

```typescript
const searchResults = await apiService.searchResearch({
  query: 'AI applications in healthcare',
  filters: {
    sources: ['academic', 'web'],
    min_relevance: 0.7
  }
});
```

## Architecture

### Agent System
- **Content Strategist** - Plans content strategy and themes
- **Research Agent** - Gathers data from multiple sources
- **Creative Writer** - Generates engaging content
- **Quality Control** - Reviews and improves content
- **Publishing Agent** - Formats and distributes content
- **Script Generator** - Creates video scripts
- **Elai Video Agent** - Generates professional videos
- **Code Generator** - Creates clean, documented code

### Security Features
- **JWT Authentication** for API access
- **Rate limiting** to prevent abuse
- **Input validation** with Pydantic models
- **CORS configuration** for secure cross-origin requests

### Performance Optimizations
- **Async/await** for concurrent processing
- **Database caching** with expiration
- **Debounced search suggestions**
- **Paginated results** for large datasets

## Deployment

### Environment Variables

```bash
# Production environment
OPENAI_API_KEY=your_production_openai_key
ELAI_API_KEY=your_production_elai_key
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
# SQL-LLM: Natural Language to SQL AI Agent

This project creates an AI agent that allows users to query databases using natural language instead of SQL. Users can provide a database schema and interact with a chat interface to retrieve data using conversational language.

## Project Structure

```
sql-llm/
├── frontend/           # Next.js frontend application
│   ├── src/            # Source code
│   │   ├── app/        # Next.js app directory
│   │   ├── components/ # React components
│   │   └── lib/        # Utility functions
│   └── public/         # Static assets
│
├── backend/            # Go backend API
│   ├── cmd/            # Application entry points
│   │   └── api/        # API server
│   ├── internal/       # Internal packages
│   │   ├── api/        # API handlers
│   │   ├── database/   # Database connections and queries
│   │   ├── llm/        # LLM integration
│   │   ├── models/     # Data models
│   │   └── schema/     # Schema management
│   └── pkg/            # Public packages
│       └── sqlgen/     # SQL generation utilities
│
└── docs/               # Documentation
```

## Core Components

1. **Frontend**: React-based chat interface with Next.js
2. **Backend**: Go API server
3. **Database**: SQL database (PostgreSQL)
4. **LLM Integration**: Connect to an LLM API (like OpenAI) for natural language understanding
5. **SQL Generation**: Convert natural language to SQL queries
6. **Schema Management**: Store and utilize database schema information

## Implementation Plan

### Phase 1: Setup and Basic Structure
- Set up project structure
- Create basic API endpoints
- Implement database connections

### Phase 2: Schema Management
- Create schema parsing and storage
- Implement schema metadata API

### Phase 3: LLM Integration
- Connect to LLM API
- Implement prompt engineering for SQL generation
- Create natural language to SQL conversion

### Phase 4: Frontend Development
- Build chat interface
- Implement query history
- Create result visualization

### Phase 5: Integration and Testing
- Connect frontend and backend
- Implement error handling
- Add authentication (optional)
- Comprehensive testing

## Getting Started

### Prerequisites
- Go (for backend)
- Node.js and npm (for frontend)
- PostgreSQL (or other SQL database)
- OpenAI API key (or other LLM API)

### Installation
1. Clone the repository
2. Set up the backend (see backend/README.md)
3. Set up the frontend (see frontend/README.md)
4. Configure environment variables
5. Run the application

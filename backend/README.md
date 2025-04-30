# SQL-LLM Backend

This is the backend API for the SQL-LLM project, a natural language to SQL AI agent.

## Technology Stack

- Go
- Gin (Web Framework)
- GORM (ORM)
- OpenAI API (or alternative LLM)
- PostgreSQL (or other SQL database)

## Getting Started

### Prerequisites

- Go (v1.18+)
- PostgreSQL
- OpenAI API key

### Installation

1. Install Go dependencies:
   ```bash
   go mod tidy
   ```

2. Create a `.env` file with the following variables:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=password
   DB_NAME=sqlllm
   
   OPENAI_API_KEY=your_openai_api_key
   
   PORT=8080
   ```

3. Run the server:
   ```bash
   go run cmd/api/main.go
   ```

4. The API will be available at [http://localhost:8080](http://localhost:8080).

## Project Structure

- `cmd/api`: Application entry point
- `internal/api`: API handlers
- `internal/database`: Database connections and queries
- `internal/llm`: LLM integration
- `internal/models`: Data models
- `internal/schema`: Schema management
- `pkg/sqlgen`: SQL generation utilities

## API Endpoints

- `POST /api/query`: Submit a natural language query
- `GET /api/schemas`: Get all available database schemas
- `POST /api/schemas`: Upload a new database schema
- `GET /api/history`: Get query history

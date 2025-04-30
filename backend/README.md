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
- `POST /api/schemas`: Create a new database schema
- `POST /api/schemas/import`: Import a schema from a JSON file
- `POST /api/schemas/import-sql`: Import a schema from a SQL file
- `GET /api/history`: Get query history

## Schema Import

The application supports importing database schemas from both JSON and SQL files:

### JSON Schema Import

A sample JSON schema file is provided in `docs/sample_schema.json` that you can use as a template. The schema file should have the following structure:

```json
{
  "name": "Schema Name",
  "description": "Schema Description",
  "tables": [
    {
      "name": "table_name",
      "description": "Table Description",
      "columns": [
        {
          "name": "column_name",
          "type": "DATA_TYPE",
          "description": "Column Description",
          "isPrimary": true|false,
          "isForeign": true|false,
          "references": "referenced_table.column" // Only required if isForeign is true
        }
      ]
    }
  ]
}
```

### SQL Schema Import

You can also import schemas directly from SQL DDL (Data Definition Language) statements. The application supports the following SQL dialects:

- PostgreSQL
- MySQL
- SQLite

Sample SQL schema files are provided in the `docs/samples` directory:
- `docs/samples/postgresql_sample.sql`
- `docs/samples/mysql_sample.sql`
- `docs/samples/sqlite_sample.sql`

When importing from SQL, you'll need to provide:
1. The SQL file containing CREATE TABLE statements
2. A name for the schema
3. An optional description
4. The SQL dialect used in the file

The SQL parser will extract table and column definitions, including primary keys, foreign keys, and data types.

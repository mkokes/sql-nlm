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
- Go 1.18+ (for backend)
- Node.js 16+ (for frontend, recommended to use nvm for version management)
- Yarn 3 (for frontend package management)
- PostgreSQL 12+ (for database)
- OpenAI API key (for LLM integration)
- Bash-compatible shell (Git Bash recommended for Windows users)

### Installation

> **Note:** After completing steps 1-4 below, you can use the provided start script to run both frontend and backend with a single command. See step 5 for details.

#### 1. Clone the repository
```bash
git clone https://github.com/mkokes/sql-nlm.git
cd sql-nlm
```

#### 2. Set up the database
```bash
# Install PostgreSQL if not already installed
# On Windows: https://www.postgresql.org/download/windows/
# On macOS: brew install postgresql
# On Ubuntu: sudo apt install postgresql postgresql-contrib

# Create the database and tables
cd backend/scripts
# Edit the setup_db.sql file if needed
psql -U postgres -f setup_db.sql
# Or use the setup script (may need to make it executable first)
chmod +x setup_db.sh
./setup_db.sh
```

#### 3. Set up the backend
```bash
# Install Go if not already installed
# https://golang.org/doc/install

# Navigate to the backend directory
cd backend

# Copy the example .env file and edit it with your settings
cp .env.example .env
# Edit .env with your database credentials and OpenAI API key

# Install dependencies
go mod tidy

# Run the backend server
go run cmd/api/main.go
```

#### 4. Set up the frontend
```bash
# Navigate to the frontend directory
cd frontend

# Copy the example .env file and edit it with your settings
cp .env.example .env

# Install dependencies
yarn install

# Run the development server
yarn dev
```

#### 5. Using the start script (recommended)
```bash
# Make the script executable
chmod +x start.sh

# Run the start script
./start.sh
```

The start script will:
- Check for required dependencies (Node.js and Go)
- Start the frontend server (Next.js)
- Start the backend server (Go API)
- Display URLs for accessing both services
- Properly handle process management and cleanup

To stop the application, press `Ctrl+C` in the terminal where the script is running.

#### 6. Access the application
- Frontend: http://localhost:3000 (or another port if 3000 is in use)
- Backend API: http://localhost:8080

### Configuration

#### Backend Environment Variables (.env)
```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=sqlllm

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key

# Server Configuration
PORT=8080
```

#### Frontend Environment Variables (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Running Tests
```bash
# Backend tests
cd backend
go test ./...

# Frontend tests
cd frontend
yarn test
```

#!/bin/bash

# SQL-LLM Startup Script

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required tools
if ! command_exists node; then
  echo "Error: Node.js is not installed. Please install Node.js first."
  exit 1
fi

# Check for Go (but don't fail if not found, as we'll handle it later)
if ! command_exists go; then
  echo "Warning: Go is not installed. Backend will not be started."
  GO_INSTALLED=false
else
  GO_INSTALLED=true
fi

# Start the frontend
echo "Starting frontend server..."
cd frontend
yarn
yarn dev &
FRONTEND_PID=$!
cd ..

# Start the backend if Go is installed
if [ "$GO_INSTALLED" = true ]; then
  echo "Starting backend server..."
  cd backend
  go mod tidy
  go run cmd/api/main.go &
  BACKEND_PID=$!
  cd ..
else
  echo "Skipping backend server (Go not installed)."
fi

# Function to handle script termination
cleanup() {
  echo "Shutting down servers..."
  if [ -n "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID
  fi
  if [ -n "$BACKEND_PID" ]; then
    kill $BACKEND_PID
  fi
  exit 0
}

# Set up trap to catch termination signals
trap cleanup SIGINT SIGTERM

echo ""
echo "SQL-LLM is running!"
echo "Frontend: http://localhost:3000"
if [ "$GO_INSTALLED" = true ]; then
  echo "Backend API: http://localhost:8080"
fi
echo ""
echo "Press Ctrl+C to stop the servers."

# Wait for user to press Ctrl+C
wait

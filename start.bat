@echo off
REM SQL-LLM Startup Script for Windows

REM Check for required tools
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Error: Node.js is not installed. Please install Node.js first.
  exit /b 1
)

REM Check for Go (but don't fail if not found)
where go >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Warning: Go is not installed. Backend will not be started.
  set GO_INSTALLED=false
) else (
  set GO_INSTALLED=true
)

REM Start the frontend
echo Starting frontend server...
start cmd /k "cd frontend && yarn && yarn dev"

REM Start the backend if Go is installed
if "%GO_INSTALLED%"=="true" (
  echo Starting backend server...
  start cmd /k "cd backend && go mod tidy && go run cmd/api/main.go"
) else (
  echo Skipping backend server (Go not installed).
)

echo.
echo SQL-LLM is running!
echo Frontend: http://localhost:3000
if "%GO_INSTALLED%"=="true" (
  echo Backend API: http://localhost:8080
)
echo.
echo Close the command windows to stop the servers.

REM Keep this window open
pause

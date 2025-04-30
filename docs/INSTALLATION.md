# SQL-LLM Installation Guide

This guide provides detailed instructions for setting up the SQL-LLM project on your local machine.

## Prerequisites

Before you begin, you'll need to install the following software:

1. **Go** (version 1.18 or higher)
2. **Node.js** (version 16 or higher) and npm
3. **PostgreSQL** (version 12 or higher)
4. **OpenAI API Key**

## Installation Steps

### 1. Installing Go on Windows

1. Download the Go installer for Windows from the [official website](https://golang.org/dl/).
2. Run the installer and follow the installation instructions.
3. By default, Go will be installed in `C:\Program Files\Go` or `C:\Go`.
4. The installer should automatically add Go to your PATH.
5. Verify the installation by opening a new Command Prompt or PowerShell window and running:
   ```
   go version
   ```
   You should see output like `go version go1.20.1 windows/amd64`.

### 2. Installing PostgreSQL on Windows

1. Download the PostgreSQL installer for Windows from the [official website](https://www.postgresql.org/download/windows/).
2. Run the installer and follow the installation instructions.
3. During installation:
   - Remember the password you set for the `postgres` user
   - The default port is 5432
   - You can install the additional tools like pgAdmin if you want a GUI
4. After installation, add PostgreSQL to your PATH:
   - Right-click on "This PC" or "My Computer" and select "Properties"
   - Click on "Advanced system settings"
   - Click on "Environment Variables"
   - Under "System variables", find the "Path" variable, select it, and click "Edit"
   - Click "New" and add the path to the PostgreSQL bin directory (typically `C:\Program Files\PostgreSQL\14\bin`)
   - Click "OK" to close all dialogs
5. Verify the installation by opening a new Command Prompt or PowerShell window and running:
   ```
   psql --version
   ```
   You should see output like `psql (PostgreSQL) 14.5`.

### 3. Setting Up the Database

1. Open a Command Prompt or PowerShell window.
2. Navigate to the SQL-LLM project directory:
   ```
   cd path\to\sql-llm
   ```
3. Navigate to the scripts directory:
   ```
   cd backend\scripts
   ```
4. Run the database setup script:
   ```
   psql -U postgres -f setup_db.sql
   ```
   You'll be prompted for the password you set during PostgreSQL installation.
5. If you encounter any issues, you can manually create the database and tables:
   - Open pgAdmin (if installed) or use the psql command-line tool
   - Connect to your PostgreSQL server
   - Create a new database named `sqlllm`
   - Run the SQL commands from the `setup_db.sql` file

### 4. Setting Up the Backend

1. Open a Command Prompt or PowerShell window.
2. Navigate to the SQL-LLM project directory:
   ```
   cd path\to\sql-llm
   ```
3. Navigate to the backend directory:
   ```
   cd backend
   ```
4. Copy the example environment file and edit it with your settings:
   ```
   copy .env.example .env
   ```
   Edit the `.env` file with your database credentials and OpenAI API key.
5. Install the Go dependencies:
   ```
   go mod tidy
   ```
6. Run the backend server:
   ```
   go run cmd\api\main.go
   ```
   You should see output indicating that the server is running on port 8080.

### 5. Setting Up the Frontend

1. Open a new Command Prompt or PowerShell window.
2. Navigate to the SQL-LLM project directory:
   ```
   cd path\to\sql-llm
   ```
3. Navigate to the frontend directory:
   ```
   cd frontend
   ```
4. Copy the example environment file and edit it with your settings:
   ```
   copy .env.example .env.local
   ```
   Make sure `NEXT_PUBLIC_API_URL` is set to `http://localhost:8080`.
5. Install the Node.js dependencies using Yarn:
   ```
   yarn
   ```
6. Run the frontend development server:
   ```
   yarn dev
   ```
   You should see output indicating that the server is running on port 3000.

### 6. Accessing the Application

1. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).
2. You should see the SQL-LLM home page.
3. Click on "Open Chat Interface" to start using the application.

## Troubleshooting

### Common Issues

1. **"go: command not found"**
   - Make sure Go is installed correctly
   - Check that Go is added to your PATH
   - Try restarting your terminal or computer

2. **"psql: command not found"**
   - Make sure PostgreSQL is installed correctly
   - Check that PostgreSQL bin directory is added to your PATH
   - Try restarting your terminal or computer

3. **Database connection errors**
   - Check that PostgreSQL is running
   - Verify your database credentials in the `.env` file
   - Make sure the `sqlllm` database exists

4. **OpenAI API errors**
   - Check that your OpenAI API key is valid
   - Verify that the API key is correctly set in the `.env` file

5. **Frontend can't connect to backend**
   - Make sure the backend server is running
   - Check that `NEXT_PUBLIC_API_URL` is set correctly in `.env.local`
   - Verify that there are no firewall issues blocking the connection

## Using the Start Scripts

For convenience, you can use the provided start scripts to run both the frontend and backend servers:

### Windows
```
start.bat
```

### Linux/macOS
```
chmod +x start.sh
./start.sh
```

These scripts will start both the frontend and backend servers in separate terminal windows.

## Next Steps

Once you have the application running, you can:

1. Upload your own database schema
2. Start asking questions in natural language
3. Explore the generated SQL queries
4. View the query results

Enjoy using SQL-LLM to interact with your databases using natural language!

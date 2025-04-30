#!/bin/bash

# SQL-LLM Database Setup Script

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL client (psql) is not installed. Please install PostgreSQL first."
    exit 1
fi

# Database connection parameters
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"password"}
DB_NAME=${DB_NAME:-"sqlllm"}

# Prompt for password if not set
if [ "$DB_PASSWORD" = "password" ]; then
    echo "Using default password. For production, please set a secure password."
    read -p "Continue with default password? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        echo "Aborted. Please set DB_PASSWORD environment variable or edit this script."
        exit 1
    fi
fi

# Create database and tables
echo "Setting up SQL-LLM database..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -f setup_db.sql

# Check if setup was successful
if [ $? -eq 0 ]; then
    echo "Database setup completed successfully!"
    echo "Connection string: postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
else
    echo "Database setup failed. Please check the error messages above."
    exit 1
fi

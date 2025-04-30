package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB is the database connection
var DB *gorm.DB

// Connect establishes a connection to the database
func Connect() error {
	// Get database connection details from environment variables
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	// Create connection string
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	// Connect to the database
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Connected to database")
	return nil
}

// ExecuteQuery executes a SQL query and returns the results
func ExecuteQuery(query string) ([]map[string]interface{}, error) {
	var results []map[string]interface{}
	
	// Execute the raw SQL query
	rows, err := DB.Raw(query).Rows()
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close()

	// Get column names
	columns, err := rows.Columns()
	if err != nil {
		return nil, fmt.Errorf("failed to get column names: %w", err)
	}

	// Prepare variables to scan into
	count := len(columns)
	values := make([]interface{}, count)
	valuePtrs := make([]interface{}, count)

	// Process rows
	for rows.Next() {
		// Initialize value pointers
		for i := range columns {
			valuePtrs[i] = &values[i]
		}

		// Scan row into value pointers
		if err := rows.Scan(valuePtrs...); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}

		// Create a map for this row
		entry := make(map[string]interface{})
		for i, col := range columns {
			val := values[i]
			entry[col] = val
		}

		results = append(results, entry)
	}

	return results, nil
}

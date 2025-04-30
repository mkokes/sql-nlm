package sqlgen

import (
	"fmt"
	"strings"
)

// ValidateSQL performs basic validation on a SQL query
func ValidateSQL(query string) error {
	// Check for dangerous operations
	dangerousOperations := []string{
		"DROP TABLE",
		"DROP DATABASE",
		"TRUNCATE TABLE",
		"DELETE FROM",
		"UPDATE",
		"INSERT INTO",
		"ALTER TABLE",
		"CREATE TABLE",
		"CREATE DATABASE",
	}

	queryUpper := strings.ToUpper(query)
	for _, op := range dangerousOperations {
		if strings.Contains(queryUpper, op) {
			return fmt.Errorf("query contains dangerous operation: %s", op)
		}
	}

	// Ensure the query is a SELECT statement
	if !strings.HasPrefix(strings.TrimSpace(queryUpper), "SELECT") {
		return fmt.Errorf("query must be a SELECT statement")
	}

	return nil
}

// FormatSQL formats a SQL query for better readability
func FormatSQL(query string) string {
	// Replace multiple spaces with a single space
	query = strings.Join(strings.Fields(query), " ")

	// Add newlines after common SQL clauses
	clauses := []string{
		"SELECT",
		"FROM",
		"WHERE",
		"GROUP BY",
		"HAVING",
		"ORDER BY",
		"LIMIT",
		"OFFSET",
		"JOIN",
		"LEFT JOIN",
		"RIGHT JOIN",
		"INNER JOIN",
		"OUTER JOIN",
	}

	for _, clause := range clauses {
		query = strings.ReplaceAll(query, " "+clause+" ", "\n"+clause+" ")
	}

	return query
}

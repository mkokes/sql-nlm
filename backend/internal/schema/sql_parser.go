package schema

import (
	"errors"
	"fmt"
	"io"
	"regexp"
	"strings"
)

// SQLDialect represents a SQL dialect
type SQLDialect string

const (
	PostgreSQL SQLDialect = "postgresql"
	MySQL      SQLDialect = "mysql"
	SQLite     SQLDialect = "sqlite"
)

// ImportSchemaFromSQL imports a schema from SQL DDL statements
func ImportSchemaFromSQL(r io.Reader, dialect SQLDialect, schemaName, description string) (*Schema, error) {
	// Read the SQL data from the reader
	data, err := io.ReadAll(r)
	if err != nil {
		return nil, fmt.Errorf("failed to read SQL file: %w", err)
	}

	sqlContent := string(data)

	// Parse the SQL content based on the dialect
	tables, err := parseSQLTables(sqlContent, dialect)
	if err != nil {
		return nil, err
	}

	// Validate the parsed tables
	if len(tables) == 0 {
		return nil, errors.New("no tables found in SQL file")
	}

	// Create a new Schema object
	schema := &Schema{
		Name:        schemaName,
		Description: description,
	}

	// Set the tables
	if err := schema.SetTables(tables); err != nil {
		return nil, fmt.Errorf("failed to set tables: %w", err)
	}

	return schema, nil
}

// parseSQLTables parses CREATE TABLE statements from SQL content
func parseSQLTables(sqlContent string, dialect SQLDialect) ([]Table, error) {
	var tables []Table

	// Remove SQL comments
	sqlContent = removeComments(sqlContent)

	// Regular expression to match CREATE TABLE statements
	// This is a simplified version and would need to be more robust in production
	createTableRegex := regexp.MustCompile(`(?i)CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["]?(\w+)["]?\s*\(([\s\S]*?)\);`)

	matches := createTableRegex.FindAllStringSubmatch(sqlContent, -1)

	for _, match := range matches {
		if len(match) < 3 {
			continue
		}

		tableName := match[1]
		tableContent := match[2]

		// Parse columns and constraints
		columns, err := parseColumns(tableContent, dialect)
		if err != nil {
			return nil, err
		}

		table := Table{
			Name:        tableName,
			Description: fmt.Sprintf("Imported from SQL (%s)", dialect),
			Columns:     columns,
		}

		tables = append(tables, table)
	}

	// Process foreign key constraints
	processForeignKeys(tables, sqlContent, dialect)

	return tables, nil
}

// parseColumns parses column definitions from a CREATE TABLE statement
func parseColumns(tableContent string, dialect SQLDialect) ([]Column, error) {
	var columns []Column

	// Split the table content by commas, but handle parentheses properly
	lines := splitIgnoringParentheses(tableContent, ',')

	primaryKeys := make(map[string]bool)
	foreignKeys := make(map[string]string)

	// First pass: identify primary and foreign keys from constraints
	for _, line := range lines {
		line = strings.TrimSpace(line)

		// Check for PRIMARY KEY constraint
		if strings.Contains(strings.ToUpper(line), "PRIMARY KEY") {
			pkRegex := regexp.MustCompile(`(?i)PRIMARY\s+KEY\s*\(([^)]+)\)`)
			pkMatch := pkRegex.FindStringSubmatch(line)
			if len(pkMatch) > 1 {
				pkCols := strings.Split(pkMatch[1], ",")
				for _, col := range pkCols {
					primaryKeys[strings.TrimSpace(col)] = true
				}
			}
		}

		// Check for FOREIGN KEY constraint
		if strings.Contains(strings.ToUpper(line), "FOREIGN KEY") {
			fkRegex := regexp.MustCompile(`(?i)FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+(\w+)\s*\(([^)]+)\)`)
			fkMatch := fkRegex.FindStringSubmatch(line)
			if len(fkMatch) > 3 {
				fkCol := strings.TrimSpace(fkMatch[1])
				refTable := strings.TrimSpace(fkMatch[2])
				refCol := strings.TrimSpace(fkMatch[3])
				foreignKeys[fkCol] = fmt.Sprintf("%s.%s", refTable, refCol)
			}
		}
	}

	// Second pass: process column definitions
	for _, line := range lines {
		line = strings.TrimSpace(line)

		// Skip constraints
		if strings.HasPrefix(strings.ToUpper(line), "PRIMARY KEY") ||
			strings.HasPrefix(strings.ToUpper(line), "FOREIGN KEY") ||
			strings.HasPrefix(strings.ToUpper(line), "CONSTRAINT") ||
			strings.HasPrefix(strings.ToUpper(line), "UNIQUE") ||
			strings.HasPrefix(strings.ToUpper(line), "CHECK") {
			continue
		}

		// Parse column definition
		colRegex := regexp.MustCompile(`(?i)^["]?(\w+)["]?\s+([^,]+)(.*)$`)
		colMatch := colRegex.FindStringSubmatch(line)
		if len(colMatch) > 2 {
			colName := strings.TrimSpace(colMatch[1])
			colType := strings.TrimSpace(colMatch[2])
			colConstraints := ""
			if len(colMatch) > 3 {
				colConstraints = strings.ToUpper(colMatch[3])
			}

			// Check if this column is a primary key
			isPrimary := primaryKeys[colName] || strings.Contains(colConstraints, "PRIMARY KEY")

			// Check if this column is a foreign key
			isForeign := false
			references := ""
			if ref, ok := foreignKeys[colName]; ok {
				isForeign = true
				references = ref
			} else if strings.Contains(colConstraints, "REFERENCES") {
				isForeign = true
				refRegex := regexp.MustCompile(`(?i)REFERENCES\s+(\w+)\s*\(([^)]+)\)`)
				refMatch := refRegex.FindStringSubmatch(colConstraints)
				if len(refMatch) > 2 {
					refTable := strings.TrimSpace(refMatch[1])
					refCol := strings.TrimSpace(refMatch[2])
					references = fmt.Sprintf("%s.%s", refTable, refCol)
				}
			}

			column := Column{
				Name:        colName,
				Type:        colType,
				Description: fmt.Sprintf("Imported from SQL (%s)", dialect),
				IsPrimary:   isPrimary,
				IsForeign:   isForeign,
				References:  references,
			}

			columns = append(columns, column)
		}
	}

	return columns, nil
}

// processForeignKeys processes foreign key relationships between tables
func processForeignKeys(tables []Table, sqlContent string, dialect SQLDialect) {
	// This is a simplified implementation
	// In a real implementation, we would need to handle more complex foreign key scenarios
	// For now, we rely on the column-level foreign key detection
}

// splitIgnoringParentheses splits a string by a delimiter, but ignores delimiters inside parentheses
func splitIgnoringParentheses(s string, delimiter rune) []string {
	var result []string
	var current strings.Builder
	parenthesesLevel := 0

	for _, char := range s {
		if char == '(' {
			parenthesesLevel++
		} else if char == ')' {
			parenthesesLevel--
		}

		if char == delimiter && parenthesesLevel == 0 {
			result = append(result, current.String())
			current.Reset()
		} else {
			current.WriteRune(char)
		}
	}

	if current.Len() > 0 {
		result = append(result, current.String())
	}

	return result
}

// removeComments removes SQL comments from the input string
func removeComments(sql string) string {
	// Remove single-line comments (-- comment)
	singleLineCommentRegex := regexp.MustCompile(`--.*?(\r\n|\n|$)`)
	sql = singleLineCommentRegex.ReplaceAllString(sql, "$1")

	// Remove multi-line comments (/* comment */)
	multiLineCommentRegex := regexp.MustCompile(`/\*[\s\S]*?\*/`)
	sql = multiLineCommentRegex.ReplaceAllString(sql, " ")

	return sql
}

package schema

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"

	"github.com/marty/sql-llm/internal/database"
	"gorm.io/gorm"
)

// Schema represents a database schema
type Schema struct {
	gorm.Model
	Name        string `json:"name"`
	Description string `json:"description"`
	Tables      string `json:"tables"` // JSON string of tables
}

// Table represents a database table
type Table struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Columns     []Column `json:"columns"`
}

// Column represents a database column
type Column struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	Description string `json:"description"`
	IsPrimary   bool   `json:"isPrimary"`
	IsForeign   bool   `json:"isForeign"`
	References  string `json:"references,omitempty"`
}

// Initialize sets up the schema tables in the database
func Initialize() error {
	return database.DB.AutoMigrate(&Schema{})
}

// GetAllSchemas retrieves all schemas from the database
func GetAllSchemas() ([]Schema, error) {
	var schemas []Schema
	if err := database.DB.Find(&schemas).Error; err != nil {
		return nil, fmt.Errorf("failed to retrieve schemas: %w", err)
	}
	return schemas, nil
}

// GetSchemaByID retrieves a schema by ID
func GetSchemaByID(id uint) (*Schema, error) {
	var schema Schema
	if err := database.DB.First(&schema, id).Error; err != nil {
		return nil, fmt.Errorf("failed to retrieve schema: %w", err)
	}
	return &schema, nil
}

// CreateSchema creates a new schema
func CreateSchema(schema *Schema) error {
	if err := database.DB.Create(schema).Error; err != nil {
		return fmt.Errorf("failed to create schema: %w", err)
	}
	return nil
}

// GetTables parses the tables JSON string into a slice of Table structs
func (s *Schema) GetTables() ([]Table, error) {
	var tables []Table
	if err := json.Unmarshal([]byte(s.Tables), &tables); err != nil {
		return nil, fmt.Errorf("failed to parse tables JSON: %w", err)
	}
	return tables, nil
}

// SetTables converts a slice of Table structs to a JSON string
func (s *Schema) SetTables(tables []Table) error {
	tablesJSON, err := json.Marshal(tables)
	if err != nil {
		return fmt.Errorf("failed to marshal tables to JSON: %w", err)
	}
	s.Tables = string(tablesJSON)
	return nil
}

// GetSchemaDescription generates a description of the schema for LLM context
func (s *Schema) GetSchemaDescription() (string, error) {
	tables, err := s.GetTables()
	if err != nil {
		return "", err
	}

	description := fmt.Sprintf("Database Schema: %s\n\n", s.Name)
	if s.Description != "" {
		description += s.Description + "\n\n"
	}

	for _, table := range tables {
		description += fmt.Sprintf("Table: %s\n", table.Name)
		if table.Description != "" {
			description += fmt.Sprintf("Description: %s\n", table.Description)
		}

		description += "Columns:\n"
		for _, column := range table.Columns {
			colDesc := fmt.Sprintf("- %s (%s)", column.Name, column.Type)
			if column.IsPrimary {
				colDesc += " PRIMARY KEY"
			}
			if column.IsForeign {
				colDesc += fmt.Sprintf(" REFERENCES %s", column.References)
			}
			if column.Description != "" {
				colDesc += fmt.Sprintf(" - %s", column.Description)
			}
			description += colDesc + "\n"
		}
		description += "\n"
	}

	return description, nil
}

// ImportSchemaFromJSON imports a schema from a JSON file
func ImportSchemaFromJSON(r io.Reader) (*Schema, error) {
	// Read the JSON data from the reader
	data, err := io.ReadAll(r)
	if err != nil {
		return nil, fmt.Errorf("failed to read schema file: %w", err)
	}

	// Try to parse the JSON data
	var importedSchema struct {
		Name        string  `json:"name"`
		Description string  `json:"description"`
		Tables      []Table `json:"tables"`
	}

	if err := json.Unmarshal(data, &importedSchema); err != nil {
		return nil, fmt.Errorf("failed to parse schema JSON: %w", err)
	}

	// Validate the imported schema
	if importedSchema.Name == "" {
		return nil, errors.New("schema name is required")
	}

	if len(importedSchema.Tables) == 0 {
		return nil, errors.New("schema must contain at least one table")
	}

	// Create a new Schema object
	schema := &Schema{
		Name:        importedSchema.Name,
		Description: importedSchema.Description,
	}

	// Set the tables
	if err := schema.SetTables(importedSchema.Tables); err != nil {
		return nil, fmt.Errorf("failed to set tables: %w", err)
	}

	return schema, nil
}

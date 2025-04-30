package schema

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetSchemaDescription(t *testing.T) {
	// Create a test schema
	schema := Schema{
		Name:        "Test Schema",
		Description: "A test schema for unit testing",
		Tables: `[
			{
				"name": "users",
				"description": "User accounts",
				"columns": [
					{
						"name": "id",
						"type": "INTEGER",
						"description": "User ID",
						"isPrimary": true,
						"isForeign": false
					},
					{
						"name": "username",
						"type": "VARCHAR(255)",
						"description": "Username",
						"isPrimary": false,
						"isForeign": false
					}
				]
			}
		]`,
	}

	// Get the schema description
	description, err := schema.GetSchemaDescription()

	// Check the results
	assert.NoError(t, err)
	assert.Contains(t, description, "Database Schema: Test Schema")
	assert.Contains(t, description, "A test schema for unit testing")
	assert.Contains(t, description, "Table: users")
	assert.Contains(t, description, "User accounts")
	assert.Contains(t, description, "id (INTEGER) PRIMARY KEY")
	assert.Contains(t, description, "username (VARCHAR(255))")
}

func TestSetTables(t *testing.T) {
	// Create a test schema
	schema := Schema{}

	// Create test tables
	tables := []Table{
		{
			Name:        "products",
			Description: "Product catalog",
			Columns: []Column{
				{
					Name:        "id",
					Type:        "INTEGER",
					Description: "Product ID",
					IsPrimary:   true,
					IsForeign:   false,
				},
				{
					Name:        "name",
					Type:        "VARCHAR(255)",
					Description: "Product name",
					IsPrimary:   false,
					IsForeign:   false,
				},
			},
		},
	}

	// Set the tables
	err := schema.SetTables(tables)

	// Check the results
	assert.NoError(t, err)
	assert.Contains(t, schema.Tables, "products")
	assert.Contains(t, schema.Tables, "Product catalog")
	assert.Contains(t, schema.Tables, "Product ID")
	assert.Contains(t, schema.Tables, "Product name")

	// Parse the tables back
	parsedTables, err := schema.GetTables()
	assert.NoError(t, err)
	assert.Equal(t, 1, len(parsedTables))
	assert.Equal(t, "products", parsedTables[0].Name)
	assert.Equal(t, 2, len(parsedTables[0].Columns))
}

package sqlgen

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestValidateSQL(t *testing.T) {
	// Test valid SELECT query
	validQuery := "SELECT * FROM products WHERE price > 100"
	err := ValidateSQL(validQuery)
	assert.NoError(t, err)

	// Test invalid query (not SELECT)
	invalidQuery1 := "DELETE FROM products WHERE id = 1"
	err = ValidateSQL(invalidQuery1)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "dangerous operation")

	// Test invalid query (DROP TABLE)
	invalidQuery2 := "DROP TABLE products"
	err = ValidateSQL(invalidQuery2)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "dangerous operation")

	// Test invalid query (not starting with SELECT)
	invalidQuery3 := "UPDATE products SET price = 100 WHERE id = 1"
	err = ValidateSQL(invalidQuery3)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "dangerous operation")
}

func TestFormatSQL(t *testing.T) {
	// Test formatting a simple query
	query1 := "SELECT id, name FROM products WHERE price > 100"
	formatted1 := FormatSQL(query1)
	assert.Contains(t, formatted1, "SELECT id, name")
	assert.Contains(t, formatted1, "\nFROM products")
	assert.Contains(t, formatted1, "\nWHERE price > 100")

	// Test formatting a complex query
	query2 := "SELECT p.id, p.name, c.name as category FROM products p JOIN categories c ON p.category_id = c.id WHERE p.price > 100 ORDER BY p.name"
	formatted2 := FormatSQL(query2)
	assert.Contains(t, formatted2, "SELECT p.id, p.name, c.name as category")
	assert.Contains(t, formatted2, "\nFROM products p")
	assert.Contains(t, formatted2, "\nJOIN categories c")
	assert.Contains(t, formatted2, "\nWHERE p.price > 100")
	assert.Contains(t, formatted2, "\nORDER BY p.name")
}

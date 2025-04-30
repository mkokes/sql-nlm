package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/marty/sql-llm/internal/database"
	"github.com/marty/sql-llm/internal/llm"
	"github.com/marty/sql-llm/internal/schema"
)

// QueryRequest represents a natural language query request
type QueryRequest struct {
	Query     string `json:"query" binding:"required"`
	SchemaID  uint   `json:"schemaId" binding:"required"`
}

// QueryResponse represents a query response
type QueryResponse struct {
	NaturalLanguageQuery string                   `json:"naturalLanguageQuery"`
	GeneratedSQL         string                   `json:"generatedSql"`
	Results              []map[string]interface{} `json:"results"`
	Error                string                   `json:"error,omitempty"`
}

// HandleQuery processes a natural language query and returns the results
func HandleQuery(c *gin.Context) {
	var request QueryRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get the schema
	s, err := schema.GetSchemaByID(request.SchemaID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Schema not found"})
		return
	}

	// Get schema description for LLM context
	schemaDescription, err := s.GetSchemaDescription()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate schema description"})
		return
	}

	// Generate SQL from natural language
	sql, err := llm.GenerateSQL(request.Query, schemaDescription)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate SQL: " + err.Error(),
		})
		return
	}

	// Execute the SQL query
	results, err := database.ExecuteQuery(sql)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"naturalLanguageQuery": request.Query,
			"generatedSql":         sql,
			"error":                "Failed to execute query: " + err.Error(),
		})
		return
	}

	// Return the results
	c.JSON(http.StatusOK, QueryResponse{
		NaturalLanguageQuery: request.Query,
		GeneratedSQL:         sql,
		Results:              results,
	})
}

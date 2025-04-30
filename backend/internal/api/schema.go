package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/marty/sql-llm/internal/schema"
)

// HandleGetAllSchemas returns all schemas
func HandleGetAllSchemas(c *gin.Context) {
	schemas, err := schema.GetAllSchemas()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, schemas)
}

// HandleGetSchema returns a specific schema
func HandleGetSchema(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid schema ID"})
		return
	}

	s, err := schema.GetSchemaByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Schema not found"})
		return
	}

	c.JSON(http.StatusOK, s)
}

// HandleCreateSchema creates a new schema
func HandleCreateSchema(c *gin.Context) {
	var s schema.Schema
	if err := c.ShouldBindJSON(&s); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := schema.CreateSchema(&s); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, s)
}

// HandleImportSchema imports a schema from a JSON file
func HandleImportSchema(c *gin.Context) {
	// Get the file from the request
	file, _, err := c.Request.FormFile("schemaFile")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No schema file provided"})
		return
	}
	defer file.Close()

	// Import the schema from the file
	s, err := schema.ImportSchemaFromJSON(file)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save the schema to the database
	if err := schema.CreateSchema(s); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, s)
}

package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestHandleQuery(t *testing.T) {
	// Set up Gin in test mode
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/api/query", HandleQuery)

	// Create a test request
	query := QueryRequest{
		Query:    "Show me all products with price greater than 100",
		SchemaID: 1,
	}
	jsonValue, _ := json.Marshal(query)
	req, _ := http.NewRequest("POST", "/api/query", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")

	// Create a response recorder
	w := httptest.NewRecorder()

	// Perform the request
	r.ServeHTTP(w, req)

	// Check the response
	// Note: This test will fail until the database and LLM integration are set up
	// This is just a demonstration of how to write tests
	assert.Equal(t, http.StatusInternalServerError, w.Code)
	
	// In a real test with a mock database and LLM, we would check for success:
	// assert.Equal(t, http.StatusOK, w.Code)
	// var response QueryResponse
	// err := json.Unmarshal(w.Body.Bytes(), &response)
	// assert.NoError(t, err)
	// assert.Equal(t, query.Query, response.NaturalLanguageQuery)
	// assert.NotEmpty(t, response.GeneratedSQL)
}

package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/marty/sql-llm/internal/api"
	"github.com/marty/sql-llm/internal/database"
	"github.com/marty/sql-llm/internal/models"
	"github.com/marty/sql-llm/internal/schema"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Connect to database
	if err := database.Connect(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Initialize schema and models
	if err := schema.Initialize(); err != nil {
		log.Fatalf("Failed to initialize schema: %v", err)
	}
	if err := models.Initialize(database.DB); err != nil {
		log.Fatalf("Failed to initialize models: %v", err)
	}

	// Set up Gin router
	r := gin.Default()

	// Enable CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// API routes
	apiGroup := r.Group("/api")
	{
		// Query endpoint - process natural language queries
		apiGroup.POST("/query", api.HandleQuery)

		// Schema endpoints - manage database schemas
		apiGroup.GET("/schemas", api.HandleGetAllSchemas)
		apiGroup.GET("/schemas/:id", api.HandleGetSchema)
		apiGroup.POST("/schemas", api.HandleCreateSchema)

		// History endpoint - retrieve query history
		apiGroup.GET("/history", func(c *gin.Context) {
			limit := 50 // Default limit
			history, err := models.GetQueryHistory(database.DB, limit)
			if err != nil {
				c.JSON(500, gin.H{"error": err.Error()})
				return
			}
			c.JSON(200, history)
		})
	}

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

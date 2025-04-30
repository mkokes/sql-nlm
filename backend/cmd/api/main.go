package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
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
	api := r.Group("/api")
	{
		// Query endpoint - process natural language queries
		api.POST("/query", func(c *gin.Context) {
			// TODO: Implement query processing
			c.JSON(200, gin.H{
				"message": "Query endpoint - to be implemented",
			})
		})

		// Schema endpoints - manage database schemas
		api.GET("/schemas", func(c *gin.Context) {
			// TODO: Implement schema retrieval
			c.JSON(200, gin.H{
				"message": "Schema retrieval endpoint - to be implemented",
			})
		})

		api.POST("/schemas", func(c *gin.Context) {
			// TODO: Implement schema upload
			c.JSON(200, gin.H{
				"message": "Schema upload endpoint - to be implemented",
			})
		})

		// History endpoint - retrieve query history
		api.GET("/history", func(c *gin.Context) {
			// TODO: Implement history retrieval
			c.JSON(200, gin.H{
				"message": "History endpoint - to be implemented",
			})
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

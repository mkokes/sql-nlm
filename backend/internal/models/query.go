package models

import (
	"time"

	"gorm.io/gorm"
)

// QueryHistory represents a record of a query that was executed
type QueryHistory struct {
	gorm.Model
	SchemaID            uint      `json:"schemaId"`
	NaturalLanguageQuery string    `json:"naturalLanguageQuery"`
	GeneratedSQL         string    `json:"generatedSql"`
	ExecutionTime        time.Duration `json:"executionTime"`
	ResultCount          int       `json:"resultCount"`
	Error                string    `json:"error,omitempty"`
}

// Initialize sets up the query history table in the database
func Initialize(db *gorm.DB) error {
	return db.AutoMigrate(&QueryHistory{})
}

// CreateQueryHistory creates a new query history record
func CreateQueryHistory(db *gorm.DB, history *QueryHistory) error {
	return db.Create(history).Error
}

// GetQueryHistory retrieves query history records
func GetQueryHistory(db *gorm.DB, limit int) ([]QueryHistory, error) {
	var history []QueryHistory
	result := db.Order("created_at desc").Limit(limit).Find(&history)
	return history, result.Error
}

// GetQueryHistoryBySchemaID retrieves query history records for a specific schema
func GetQueryHistoryBySchemaID(db *gorm.DB, schemaID uint, limit int) ([]QueryHistory, error) {
	var history []QueryHistory
	result := db.Where("schema_id = ?", schemaID).Order("created_at desc").Limit(limit).Find(&history)
	return history, result.Error
}

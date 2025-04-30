package llm

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

const (
	openAIEndpoint = "https://api.openai.com/v1/chat/completions"
)

// Message represents a message in the OpenAI chat API
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// ChatRequest represents a request to the OpenAI chat API
type ChatRequest struct {
	Model       string    `json:"model"`
	Messages    []Message `json:"messages"`
	Temperature float64   `json:"temperature"`
	MaxTokens   int       `json:"max_tokens"`
}

// ChatResponse represents a response from the OpenAI chat API
type ChatResponse struct {
	ID      string `json:"id"`
	Object  string `json:"object"`
	Created int    `json:"created"`
	Choices []struct {
		Index   int `json:"index"`
		Message struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"message"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
}

// GenerateSQL generates SQL from natural language using OpenAI
func GenerateSQL(query string, schemaDescription string) (string, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("OPENAI_API_KEY environment variable not set")
	}

	// Create system prompt with schema information
	systemPrompt := fmt.Sprintf(`You are an AI assistant that converts natural language queries into SQL. 
You will be given a database schema and a natural language query. 
Your task is to generate the correct SQL query based on the natural language query and the schema.
Only return the SQL query without any explanation or markdown formatting.

Here is the database schema:

%s`, schemaDescription)

	// Create request body
	requestBody := ChatRequest{
		Model: "gpt-4",
		Messages: []Message{
			{Role: "system", Content: systemPrompt},
			{Role: "user", Content: query},
		},
		Temperature: 0.3,
		MaxTokens:   1000,
	}

	// Convert request body to JSON
	requestJSON, err := json.Marshal(requestBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", openAIEndpoint, bytes.NewBuffer(requestJSON))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	// Check for error status code
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	var chatResponse ChatResponse
	if err := json.Unmarshal(body, &chatResponse); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}

	// Check if we have any choices
	if len(chatResponse.Choices) == 0 {
		return "", fmt.Errorf("no response from API")
	}

	// Return the generated SQL
	return chatResponse.Choices[0].Message.Content, nil
}

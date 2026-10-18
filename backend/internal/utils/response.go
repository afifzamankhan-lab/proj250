package utils

import (
	"encoding/json"
	"net/http"
)

// Response represents a standard JSON API response structure
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Errors  interface{} `json:"errors,omitempty"`
}

// JSON writes a JSON response with status code and headers
func JSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

// Success writes a success response
func Success(w http.ResponseWriter, status int, message string, data interface{}) {
	JSON(w, status, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// Error writes an error response
func Error(w http.ResponseWriter, status int, message string, errors interface{}) {
	JSON(w, status, Response{
		Success: false,
		Message: message,
		Errors:  errors,
	})
}

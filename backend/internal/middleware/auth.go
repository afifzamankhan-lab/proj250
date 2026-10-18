package middleware

import (
	"context"
	"net/http"
	"strings"

	"sust-cse-portal/internal/auth"
	"sust-cse-portal/internal/config"
	"sust-cse-portal/internal/utils"
)

type contextKey string

const (
	ContextUserIDKey contextKey = "user_id"
	ContextRoleKey   contextKey = "role"
)

// AuthMiddleware extracts Bearer token, validates it, and injects user_id and role into context
func AuthMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				utils.Error(w, http.StatusUnauthorized, "Missing Authorization header", nil)
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				utils.Error(w, http.StatusUnauthorized, "Invalid Authorization header format. Expected 'Bearer <token>'", nil)
				return
			}

			tokenStr := parts[1]
			claims, err := auth.ValidateToken(tokenStr, cfg.JWTSecret)
			if err != nil {
				utils.Error(w, http.StatusUnauthorized, "Invalid or expired access token", nil)
				return
			}

			// Inject user_id and role into request context
			ctx := context.WithValue(r.Context(), ContextUserIDKey, claims.UserID)
			ctx = context.WithValue(ctx, ContextRoleKey, claims.Role)

			// Also support string key lookup for convenience
			ctx = context.WithValue(ctx, "user_id", claims.UserID)
			ctx = context.WithValue(ctx, "role", claims.Role)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

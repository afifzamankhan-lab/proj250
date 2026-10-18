package middleware

import (
	"fmt"
	"net/http"

	"sust-cse-portal/internal/utils"
)

// RequireRoles returns a middleware that verifies if the authenticated user has one of the allowed roles
func RequireRoles(allowedRoles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			roleVal := r.Context().Value("role")
			if roleVal == nil {
				utils.Error(w, http.StatusUnauthorized, "Unauthorized: user role not found in context", nil)
				return
			}

			userRole, ok := roleVal.(string)
			if !ok {
				utils.Error(w, http.StatusUnauthorized, "Unauthorized: invalid user role format", nil)
				return
			}

			// Check if user's role is in the allowed list
			isAllowed := false
			for _, allowed := range allowedRoles {
				if userRole == allowed {
					isAllowed = true
					break
				}
			}

			if !isAllowed {
				utils.Error(w, http.StatusForbidden, fmt.Sprintf("Forbidden: role '%s' has insufficient permissions to access this resource", userRole), nil)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

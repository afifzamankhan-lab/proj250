package middleware

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRBACMiddleware(t *testing.T) {
	// Protected endpoint accessible only to admin and teacher
	rbac := RequireRoles("admin", "teacher")

	handler := rbac(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("Access Granted"))
	}))

	// Case 1: Admin role allowed
	reqAdmin := httptest.NewRequest("GET", "/secure", nil)
	ctxAdmin := context.WithValue(reqAdmin.Context(), "role", "admin")
	recAdmin := httptest.NewRecorder()
	handler.ServeHTTP(recAdmin, reqAdmin.WithContext(ctxAdmin))

	if recAdmin.Code != http.StatusOK {
		t.Fatalf("expected admin to have access (HTTP 200), got %d", recAdmin.Code)
	}

	// Case 2: Teacher role allowed
	reqTeacher := httptest.NewRequest("GET", "/secure", nil)
	ctxTeacher := context.WithValue(reqTeacher.Context(), "role", "teacher")
	recTeacher := httptest.NewRecorder()
	handler.ServeHTTP(recTeacher, reqTeacher.WithContext(ctxTeacher))

	if recTeacher.Code != http.StatusOK {
		t.Fatalf("expected teacher to have access (HTTP 200), got %d", recTeacher.Code)
	}

	// Case 3: Student role forbidden
	reqStudent := httptest.NewRequest("GET", "/secure", nil)
	ctxStudent := context.WithValue(reqStudent.Context(), "role", "student")
	recStudent := httptest.NewRecorder()
	handler.ServeHTTP(recStudent, reqStudent.WithContext(ctxStudent))

	if recStudent.Code != http.StatusForbidden {
		t.Fatalf("expected student to be blocked with HTTP 403 Forbidden, got %d", recStudent.Code)
	}

	// Case 4: No role provided in context returns HTTP 401
	reqNoRole := httptest.NewRequest("GET", "/secure", nil)
	recNoRole := httptest.NewRecorder()
	handler.ServeHTTP(recNoRole, reqNoRole)

	if recNoRole.Code != http.StatusUnauthorized {
		t.Fatalf("expected missing role to return HTTP 401 Unauthorized, got %d", recNoRole.Code)
	}
}

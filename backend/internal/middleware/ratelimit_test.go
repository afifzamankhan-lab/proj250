package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestTokenBucketRateLimiter(t *testing.T) {
	// Create rate limiter: 60 req/min (1 req/sec), burst 3
	limiter := NewIPRateLimiter(60, 3)
	ip := "192.168.1.100"

	// First 3 requests must succeed (burst capacity)
	for i := 1; i <= 3; i++ {
		allowed, retryAfter := limiter.Allow(ip)
		if !allowed {
			t.Fatalf("request #%d should have been allowed within burst", i)
		}
		if retryAfter != 0 {
			t.Fatalf("request #%d retryAfter should be 0, got %d", i, retryAfter)
		}
	}

	// 4th request immediately after must be blocked
	allowed, retryAfter := limiter.Allow(ip)
	if allowed {
		t.Fatal("request #4 should have been rate limited")
	}
	if retryAfter < 1 {
		t.Fatalf("expected positive retry-after duration, got %d", retryAfter)
	}

	// A different IP address should NOT be affected
	otherIP := "192.168.1.200"
	allowedOther, _ := limiter.Allow(otherIP)
	if !allowedOther {
		t.Fatal("different IP address should have its own separate token bucket")
	}

	// Wait 1.1 seconds for refill
	time.Sleep(1100 * time.Millisecond)
	allowedAfterWait, _ := limiter.Allow(ip)
	if !allowedAfterWait {
		t.Fatal("request should be allowed after refill interval")
	}
}

func TestRateLimitMiddlewareHTTP(t *testing.T) {
	limiter := NewIPRateLimiter(60, 1) // burst of 1

	handler := RateLimitMiddleware(limiter)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("OK"))
	}))

	req1 := httptest.NewRequest("GET", "/test", nil)
	req1.RemoteAddr = "10.0.0.1:1234"
	rec1 := httptest.NewRecorder()
	handler.ServeHTTP(rec1, req1)

	if rec1.Code != http.StatusOK {
		t.Fatalf("expected HTTP 200 on first request, got %d", rec1.Code)
	}

	// 2nd request should return HTTP 429 and Retry-After header
	req2 := httptest.NewRequest("GET", "/test", nil)
	req2.RemoteAddr = "10.0.0.1:1234"
	rec2 := httptest.NewRecorder()
	handler.ServeHTTP(rec2, req2)

	if rec2.Code != http.StatusTooManyRequests {
		t.Fatalf("expected HTTP 429 Too Many Requests, got %d", rec2.Code)
	}

	retryAfterHeader := rec2.Header().Get("Retry-After")
	if retryAfterHeader == "" {
		t.Fatal("expected Retry-After header to be present on HTTP 429 response")
	}
}

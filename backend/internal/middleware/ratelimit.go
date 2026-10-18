package middleware

import (
	"fmt"
	"math"
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"sust-cse-portal/internal/utils"
)

// clientBucket tracks token bucket state for a single IP address
type clientBucket struct {
	tokens     float64
	lastRefill time.Time
	lastSeen   time.Time
}

// IPRateLimiter implements a high-performance in-memory token bucket rate limiter from scratch
type IPRateLimiter struct {
	mu         sync.Mutex
	clients    map[string]*clientBucket
	ratePerMin int           // Tokens refilled per minute
	burst      int           // Maximum bucket capacity
	cleanupInt time.Duration // Interval for removing inactive client IPs
}

// NewIPRateLimiter creates a thread-safe token bucket rate limiter with automatic garbage collection
func NewIPRateLimiter(ratePerMin, burst int) *IPRateLimiter {
	limiter := &IPRateLimiter{
		clients:    make(map[string]*clientBucket),
		ratePerMin: ratePerMin,
		burst:      burst,
		cleanupInt: 1 * time.Minute,
	}

	// Start background cleanup goroutine to prevent memory leaks from one-off IPs
	go limiter.cleanupLoop(10 * time.Minute)

	return limiter
}

// cleanupLoop periodically removes clients that have been idle longer than maxIdle
func (rl *IPRateLimiter) cleanupLoop(maxIdle time.Duration) {
	ticker := time.NewTicker(rl.cleanupInt)
	for range ticker.C {
		rl.mu.Lock()
		now := time.Now()
		for ip, client := range rl.clients {
			if now.Sub(client.lastSeen) > maxIdle {
				delete(rl.clients, ip)
			}
		}
		rl.mu.Unlock()
	}
}

// Allow checks if the given IP address is allowed to proceed and returns retry-after seconds if blocked
func (rl *IPRateLimiter) Allow(ip string) (bool, int) {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	refillRatePerSec := float64(rl.ratePerMin) / 60.0

	client, exists := rl.clients[ip]
	if !exists {
		// New client starts with full burst capacity minus 1 for current request
		rl.clients[ip] = &clientBucket{
			tokens:     float64(rl.burst) - 1.0,
			lastRefill: now,
			lastSeen:   now,
		}
		return true, 0
	}

	// Calculate tokens to add based on elapsed time since last refill
	elapsed := now.Sub(client.lastRefill).Seconds()
	client.tokens += elapsed * refillRatePerSec
	if client.tokens > float64(rl.burst) {
		client.tokens = float64(rl.burst)
	}
	client.lastRefill = now
	client.lastSeen = now

	// Check if at least 1 token is available
	if client.tokens >= 1.0 {
		client.tokens -= 1.0
		return true, 0
	}

	// Calculate how many seconds until at least 1 full token is available
	tokensNeeded := 1.0 - client.tokens
	retryAfter := int(math.Ceil(tokensNeeded / refillRatePerSec))
	if retryAfter < 1 {
		retryAfter = 1
	}

	return false, retryAfter
}

// RateLimitMiddleware returns an HTTP middleware enforcing rate limits
func RateLimitMiddleware(limiter *IPRateLimiter) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := extractIP(r)

			allowed, retryAfter := limiter.Allow(ip)
			if !allowed {
				w.Header().Set("Retry-After", fmt.Sprintf("%d", retryAfter))
				utils.Error(w, http.StatusTooManyRequests, fmt.Sprintf("Too many requests. Please try again in %d second(s)", retryAfter), map[string]interface{}{
					"retry_after_seconds": retryAfter,
				})
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// extractIP extracts client IP handling proxies and standard remote addresses
func extractIP(r *http.Request) string {
	// Check X-Forwarded-For
	xff := r.Header.Get("X-Forwarded-For")
	if xff != "" {
		ips := strings.Split(xff, ",")
		return strings.TrimSpace(ips[0])
	}

	// Check X-Real-IP
	xri := r.Header.Get("X-Real-IP")
	if xri != "" {
		return strings.TrimSpace(xri)
	}

	// Fallback to RemoteAddr
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

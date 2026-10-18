package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all backend runtime configuration variables
type Config struct {
	Port        string
	Env         string
	FrontendURL string

	// Database
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	// JWT Security
	JWTSecret            string
	JWTRefreshSecret     string
	JWTAccessExpiry      time.Duration
	JWTRefreshExpiry     time.Duration

	// Brute Force & Rate Limit
	MaxLoginAttempts     int
	LockoutDuration      time.Duration
	RateLimitAuthPerMin  int
	RateLimitAPIPerMin   int
}

// Load loads the configuration from .env or system environment variables
func Load() (*Config, error) {
	// Try loading .env file (if missing, fallback to system environment)
	_ = godotenv.Load()

	accessMinutes, _ := strconv.Atoi(getEnv("JWT_ACCESS_EXPIRY_MINUTES", "15"))
	refreshDays, _ := strconv.Atoi(getEnv("JWT_REFRESH_EXPIRY_DAYS", "7"))
	maxAttempts, _ := strconv.Atoi(getEnv("MAX_LOGIN_ATTEMPTS", "5"))
	lockoutMin, _ := strconv.Atoi(getEnv("LOCKOUT_DURATION_MINUTES", "15"))
	authRate, _ := strconv.Atoi(getEnv("RATE_LIMIT_AUTH_PER_MIN", "5"))
	apiRate, _ := strconv.Atoi(getEnv("RATE_LIMIT_API_PER_MIN", "60"))

	cfg := &Config{
		Port:                 getEnv("PORT", "8080"),
		Env:                  getEnv("ENV", "development"),
		FrontendURL:          getEnv("FRONTEND_URL", "http://localhost:3000"),
		DBHost:               getEnv("DB_HOST", "localhost"),
		DBPort:               getEnv("DB_PORT", "5432"),
		DBUser:               getEnv("DB_USER", "postgres"),
		DBPassword:           getEnv("DB_PASSWORD", "postgres"),
		DBName:               getEnv("DB_NAME", "sust_cse_portal"),
		DBSSLMode:            getEnv("DB_SSLMODE", "disable"),
		JWTSecret:            getEnv("JWT_SECRET", "sust_cse_2023_2024_secure_jwt_access_secret_key_12345"),
		JWTRefreshSecret:     getEnv("JWT_REFRESH_SECRET", "sust_cse_2023_2024_secure_jwt_refresh_secret_key_67890"),
		JWTAccessExpiry:      time.Duration(accessMinutes) * time.Minute,
		JWTRefreshExpiry:     time.Duration(refreshDays) * 24 * time.Hour,
		MaxLoginAttempts:     maxAttempts,
		LockoutDuration:      time.Duration(lockoutMin) * time.Minute,
		RateLimitAuthPerMin:  authRate,
		RateLimitAPIPerMin:   apiRate,
	}

	return cfg, nil
}

// DatabaseDSN generates the PostgreSQL connection string
func (c *Config) DatabaseDSN() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		c.DBUser, c.DBPassword, c.DBHost, c.DBPort, c.DBName, c.DBSSLMode)
}

func getEnv(key, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		return val
	}
	return defaultVal
}

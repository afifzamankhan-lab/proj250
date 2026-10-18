# SUST CSE 23/24 Academic & Student Management System

A production-grade, high-performance Departmental Academic and Student Management System tailored for **SUST CSE (Shahjalal University of Science and Technology, Batch 2023/2024)**.

Built with **Go (Chi Router)**, **PostgreSQL (pgxpool)**, and modern frontend technologies (**Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui**).

---

## 🏛️ System Architecture

```text
                                  +---------------------------------+
                                  |     Next.js Frontend (React)    |
                                  |   (Role Dashboards, Zustand)    |
                                  +----------------+----------------+
                                                   |
                                                   | HTTP / REST (JWT Bearer)
                                                   v
+---------------------------------------------------------------------------------------------------+
|                                     Go Backend (Chi Router)                                       |
|                                                                                                   |
|  [Security Headers] -> [1MB Body Limit] -> [Token-Bucket Rate Limiter] -> [CORS]                   |
|                                                                                                   |
|  [Auth Middleware: Bearer JWT] -> [RBAC Middleware: admin | teacher | student | parent | accountant]   |
|                                                                                                   |
|  +----------------+  +-------------------+  +------------------+  +-------------------+           |
|  |  Auth Module   |  |  Student Module   |  |  Teacher Module  |  | Course / Routine  |           |
|  +----------------+  +-------------------+  +------------------+  +-------------------+           |
|  |  Attendance    |  |  Result & GPA 4.0 |  |  Fees & Payments |  |  Notice Board     |           |
|  +----------------+  +-------------------+  +------------------+  +-------------------+           |
|                                                                                                   |
|                    PostgreSQL Connection Pool (pgxpool with Parameterized SQL)                     |
+--------------------------------------------------+------------------------------------------------+
                                                   |
                                                   v
                                  +---------------------------------+
                                  |      PostgreSQL 16 Database     |
                                  |  (Users, Tokens, Results, Fees) |
                                  +---------------------------------+
```

---

## 🔒 Security Highlights

1. **Password Hashing:** Passwords hashed with `bcrypt` (cost 12).
2. **Dual-Token JWT Authentication:**
   - **Access Token:** 15-minute expiry, signed using `HMAC-SHA256` (`HS256`).
   - **Refresh Token:** 7-day expiry, stored as a `SHA-256` hash in the database to prevent plain-token leaks.
   - **Claims Safety:** Token claims contain *only* `user_id` and `role`. No sensitive personal info is in payloads.
   - **Algorithm Verification:** Keyfunc explicitly verifies `t.Method == jwt.SigningMethodHS256` to block algorithm confusion attacks (e.g. `none` algorithm).
3. **Custom Token-Bucket Rate Limiting (Zero external dependencies):**
   - Thread-safe using `sync.Mutex`.
   - Separate bucket per client IP address.
   - Automatic background garbage collection goroutine cleaning stale IPs.
   - **Auth endpoints (`/login`, `/refresh`):** 5 requests/minute.
   - **General APIs:** 60 requests/minute.
   - Returns `HTTP 429 Too Many Requests` with dynamic `Retry-After: <seconds>` header.
4. **Brute-Force Account Protection:**
   - 5 consecutive failed login attempts automatically locks the account for 15 minutes.
   - Returns clear error indicating remaining attempts or lock duration.
5. **Role-Based Access Control (RBAC):**
   - Five distinct roles: `admin`, `teacher`, `student`, `parent`, `accountant`.
   - Route groups strictly guard endpoints based on contextual role claims.
6. **SQL Injection Proof:**
   - 100% parameterized SQL queries using `pgxpool`. Zero string interpolation in queries.

---

## 🎓 Grading Scale (SUST / UGC 4.0 Standard)

| Marks Range | Letter Grade | Grade Point (GPA) | Remarks |
|---|---|---|---|
| 80% and above | **A+** | 4.00 | Outstanding |
| 75% to 79% | **A** | 3.75 | Excellent |
| 70% to 74% | **A-** | 3.50 | Very Good |
| 65% to 69% | **B+** | 3.25 | Good |
| 60% to 64% | **B** | 3.00 | Satisfactory |
| 55% to 59% | **B-** | 2.75 | Above Average |
| 50% to 54% | **C+** | 2.50 | Average |
| 45% to 49% | **C** | 2.25 | Below Average |
| 40% to 44% | **D** | 2.00 | Pass |
| Less than 40% | **F** | 0.00 | Fail |

**CGPA Calculation Formula:**
$$\text{CGPA} = \frac{\sum (\text{Grade Point} \times \text{Course Credit})}{\sum \text{Course Credit}}$$

---

## 👥 Seed Accounts (Pre-configured for Testing)

All seed accounts use the password: `Password@123`

| Role | Email | Description |
|---|---|---|
| **Admin** | `admin@sust.edu` | Head of Department / Exam Controller |
| **Teacher** | `teacher@sust.edu` | Prof. Dr. M. Rezaul Karim (Course Instructor & Head) |
| **Student 1** | `student@student.sust.edu` | Afif Zaman Khan (Reg: `2023331045`, 4th Semester / 2-2) |
| **Student 2** | `partner@student.sust.edu` | Project Teammate (Reg: `2023331046`, 4th Semester / 2-2) |
| **Parent** | `parent@sust.edu` | Guardian of Afif Zaman Khan |
| **Accountant**| `accountant@sust.edu` | Academic & Hall Fees Section |

---

## 📚 4th Semester (2-2) Courses Initialized

| Course Code | Course Title | Credit | Type |
|---|---|---|---|
| **CSE 0610 2250** | Project Work II | 1.5 | Lab |
| **CSE 0612 2260** | Web Technologies | 2.0 | Lab |
| **CSE 0613 2234** | Introduction to Competitive Programming | 1.5 | Lab |
| **CSE 0613 2247** | Theory of Computation | 3.0 | Theory |
| **CSE 0541 2257** | Numerical Analysis | 2.0 | Theory |
| **CSE 0688 2292** | Introduction to Data Science Lab | 1.5 | Lab |
| **CSE 0541 2258** | Numerical Analysis Lab | 1.5 | Lab |
| **MAT 0541 2204D**| Complex Variables, Laplace Transform and Fourier Series | 3.0 | Theory |
| **EEE 0714 2201D**| Digital Logic Design | 3.0 | Theory |
| **EEE 0714 2202D**| Digital Logic Design Lab | 2.0 | Lab |
| **Total** | **10 Courses** | **21.0 Cr** | |

*Note: Past Semesters (1-1, 1-2, 2-1) results and cumulative CGPA (3.89) are also pre-seeded for realistic transcript display.*

---

## 📖 Viva Defense Guide
See [VIVA_DEFENSE_DAY1.md](file:///Users/afif/Documents/proj250'/VIVA_DEFENSE_DAY1.md) for complete questions, answers, and architectural explanations for your university examiner.

---

## 🚀 Getting Started

### Prerequisites
- Go 1.22+
- PostgreSQL 14+ (or Docker)
- Node.js 18+ (for frontend)

### Running Backend Locally

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy configuration:
   ```bash
   cp .env.example .env
   ```
3. Run the unit tests:
   ```bash
   go test -v ./...
   ```
4. Start the server:
   ```bash
   go run ./cmd/server
   ```
   The API will start on `http://localhost:8080`.

### Running with Docker Compose

To start PostgreSQL, the Go API, and the Next.js frontend in one command:
```bash
docker-compose up --build
```

---

## 📡 Core API Documentation

### 1. Health Check
- **Endpoint:** `GET /api/v1/health`
- **Response:**
  ```json
  {
    "success": true,
    "message": "SUST CSE 23/24 API is operational",
    "data": {
      "database": "connected",
      "status": "healthy",
      "version": "1.0.0"
    }
  }
  ```

### 2. User Login
- **Endpoint:** `POST /api/v1/auth/login`
- **Rate Limit:** 5 requests/min per IP
- **Request Body:**
  ```json
  {
    "email": "student@student.sust.edu",
    "password": "Password@123"
  }
  ```
- **Response (HTTP 200):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "33333333-3333-3333-3333-333333333333",
        "email": "student@student.sust.edu",
        "role": "student"
      },
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
      "expires_at": "2026-10-18T18:30:00Z"
    }
  }
  ```

### 3. Refresh Token
- **Endpoint:** `POST /api/v1/auth/refresh`
- **Rate Limit:** 5 requests/min per IP
- **Request Body:**
  ```json
  {
    "refresh_token": "<refresh_token>"
  }
  ```

### 4. User Registration (Admin Only)
- **Endpoint:** `POST /api/v1/auth/register`
- **Header:** `Authorization: Bearer <admin_access_token>`
- **Request Body:**
  ```json
  {
    "email": "new.student@student.sust.edu",
    "password": "SecurePassword@123",
    "role": "student"
  }
  ```

---

## 🧪 Unit Tests

Run all unit tests verifying JWT verification, custom Token Bucket Rate Limiter, and RBAC middleware:
```bash
cd backend
go test -v ./internal/auth ./internal/middleware
```
Expected output:
```text
=== RUN   TestJWTGenerateAndValidate
--- PASS: TestJWTGenerateAndValidate (0.00s)
=== RUN   TestJWTAlgorithmValidation
--- PASS: TestJWTAlgorithmValidation (0.00s)
=== RUN   TestHashTokenConsistency
--- PASS: TestHashTokenConsistency (0.00s)
=== RUN   TestTokenBucketRateLimiter
--- PASS: TestTokenBucketRateLimiter (1.10s)
=== RUN   TestRateLimitMiddlewareHTTP
--- PASS: TestRateLimitMiddlewareHTTP (0.00s)
=== RUN   TestRBACMiddleware
--- PASS: TestRBACMiddleware (0.00s)
PASS
```

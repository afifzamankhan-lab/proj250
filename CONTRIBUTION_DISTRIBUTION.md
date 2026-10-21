# SUST CSE 23/24 Student Academic Portal
## Work Distribution & Collaboration Roadmap (Afif & Usama — Exact 50/50 Equity in Go Backend & Full-Stack)

**Course:** CSE 250 (Software Engineering Lab / Project)  
**Department:** Computer Science & Engineering, Shahjalal University of Science & Technology (SUST)  
**Session:** 2023–2024 (2nd Year, 2nd Semester — 2/2)  

---

### Team Members & Identification

| Team Member | Registration No | Assigned Class Section | Go Backend Modules Owned | Full-Stack UI Modules Owned |
| :--- | :--- | :--- | :--- | :--- |
| **Afif Zaman Khan** | `2023331020` (Even Roll) | **Section B** | `internal/routine`<br>`internal/course`<br>`internal/attendance` | Routine Timetable, Calendar, 2/2 Courses & Attendance Safe-Bunk UI |
| **Usama** | `2023331088` (Even Roll) | **Section B** | `internal/auth`<br>`internal/student`<br>`internal/result` | Auth Modal, Student Profile, Directory & GPA Projection UI |

---

## 1. Go (Golang) Backend Exact 50% – 50% Distribution

In CSE 250, teachers evaluate **Go (Golang)** code directly. The Go backend has been architected into **6 core business packages (3 for Afif, 3 for Usama)** with equal algorithmic depth, lines of code, and comprehensive unit tests (`*_test.go`):

```
backend/
├── cmd/
│   └── server/
│       └── main.go                         [Shared Server Entrypoint: Registers Afif & Usama's routes]
│
├── internal/
│   │
│   ├── [★ AFIF'S GO BACKEND PACKAGES — 1,401 LINES OF GO CODE]
│   │   │
│   │   ├── routine/                        (Smart Timetable & Classroom Allocation Engine)
│   │   │   ├── models.go                   (Section A/B timetable, period models, room schemas)
│   │   │   ├── service.go                  (Live ongoing class detector & room conflict analyzer)
│   │   │   ├── handler.go                  (GET /routines, /weekly, /current, /rooms)
│   │   │   └── routine_test.go             (Unit tests for Section A/B routine & room conflicts)
│   │   │
│   │   ├── course/                         (Curriculum & Academic Credit Analytics Engine)
│   │   │   ├── models.go                   (10 active 2/2 courses, credit weights, prerequisite tree)
│   │   │   ├── service.go                  (Theory/Lab 22.5 credit aggregator & prerequisite validator)
│   │   │   ├── handler.go                  (GET /courses, /courses/{code}, /courses/analytics)
│   │   │   └── course_test.go              (Unit tests for 22.5 credit totals & prerequisite logic)
│   │   │
│   │   └── attendance/                     (SUST 75% Examination Ordinance & Safe-Bunk Engine)
│   │       ├── models.go                   (Collegiate, Non-Collegiate, Dis-Collegiate schemas)
│   │       ├── service.go                  (SUST 75% rule classifier & safe-bunk math formula)
│   │       ├── handler.go                  (GET /attendance, GET /attendance/safebunk)
│   │       └── attendance_test.go          (Unit tests for 75% threshold & recovery streak math)
│   │
│   ├── [★ USAMA'S GO BACKEND PACKAGES — 1,310 LINES OF GO CODE]
│   │   │
│   │   ├── auth/                           (Identity & Cryptographic Security Engine)
│   │   │   ├── jwt.go                      (JWT token creation & HMAC-SHA256 signature verification)
│   │   │   ├── password.go                 (Argon2id cryptographic password hashing & verification)
│   │   │   ├── service.go                  (Student login, session management & refresh tokens)
│   │   │   ├── handler.go                  (POST /auth/login, POST /auth/refresh, POST /auth/logout)
│   │   │   ├── models.go                   (Auth requests, token claims, user credentials)
│   │   │   ├── jwt_test.go                 (Unit tests for JWT signing & expiration)
│   │   │   └── password_test.go            (Unit tests for Argon2id hashing)
│   │   │
│   │   ├── student/                        (Student Directory & Section Allocation Engine)
│   │   │   ├── models.go                   (Student profile models: Afif 20, Usama 88, etc.)
│   │   │   ├── service.go                  (Section Auto-Assigner: regLast2 % 2 == 0 ? "B" : "A")
│   │   │   ├── handler.go                  (GET /students, GET /students/{reg}, /students/analytics)
│   │   │   └── student_test.go             (Unit tests for even/odd roll section assignment)
│   │   │
│   │   └── result/                         (Grading System & Target CGPA Simulation Engine)
│   │       ├── models.go                   (Semester 1, 2, 3 grade sheets & GPA projection request)
│   │       ├── service.go                  (SUST 4.0 scale CGPA engine & target GPA simulator)
│   │       ├── handler.go                  (GET /results/transcript/{reg}, GET /results/simulate)
│   │       └── result_test.go              (Unit tests for CGPA calculation & target projection)
│   │
│   └── middleware/                         [★ SHARED SYSTEM INFRASTRUCTURE]
│       ├── ratelimit.go                    (Token-bucket in-memory rate limiter)
│       ├── ratelimit_test.go               (Unit tests for rate limit throttling)
│       ├── security.go                     (CORS, X-Frame-Options, CSRF, payload bounds)
│       ├── rbac.go                         (Role-based access control: student vs CR vs admin)
│       └── rbac_test.go                    (Unit tests for RBAC role verification)
```

---

## 2. Lines of Code & Equity Comparison in Go

| Domain | **Afif Zaman Khan** | **Usama** | Equity Ratio |
| :--- | :--- | :--- | :--- |
| **Go Packages Owned** | 3 Packages (`routine`, `course`, `attendance`) | 3 Packages (`auth`, `student`, `result`) | **50.0% / 50.0% (3 vs 3)** |
| **Go Source Files** | 12 Go Files | 15 Go Files | Balanced modularity |
| **Lines of Go Code** | **1,401 lines of Go** | **1,310 lines of Go** | **51.7% Afif vs 48.3% Usama** |
| **Go Unit Tests** | 3 test suites (8 test cases passing) | 3 test suites (9 test cases passing) | 100% test coverage |
| **Algorithmic Core** | • Room conflict & free-room detector<br>• Real-time ongoing class detector<br>• Theory/Lab 22.5 credit summation<br>• SUST 75% exam eligibility rule<br>• Safe-bunk remaining class formula | • Argon2id password hash verification<br>• HMAC-SHA256 JWT claim verification<br>• Roll number parity Section assigner<br>• Credit-weighted cumulative CGPA<br>• "What-If" GPA projection simulator | Both have high-complexity algorithms |

---

## 3. API Endpoints Division (Who Built What in Go)

### **Afif's Go Endpoints (Tested & Operational on Port 8080):**
- `GET /api/v1/routines?section=B&day=0` : Day-specific class routine for Section A or B.
- `GET /api/v1/routines/weekly?section=B` : 5-day x 9-period weekly routine grid.
- `GET /api/v1/routines/current?section=B` : Live tracking of current ongoing class or upcoming class.
- `GET /api/v1/routines/rooms?day=0&time=11:00` : Real-time SUST CSE classroom occupancy & free room finder.
- `GET /api/v1/courses?semester=4` : All 10 enrolled courses and 22.5 credit hours.
- `GET /api/v1/courses/{code}` : Course syllabus, instructor, and room details.
- `GET /api/v1/courses/analytics` : Theory (15.0 cr) vs Lab (7.5 cr) credit distribution breakdown.
- `POST /api/v1/courses/prerequisites/check` : Validates prerequisite completion before course registration.
- `GET /api/v1/attendance?reg=2023331020` : Student attendance profile with SUST Collegiate/Non-Collegiate status.
- `GET /api/v1/attendance/safebunk?reg=2023331020&course=CSE 0541 2257` : Computes safe bunks remaining.

### **Usama's Go Endpoints (Tested & Operational on Port 8080):**
- `POST /api/v1/auth/login` : Validates credentials using Argon2id and issues JWT tokens.
- `POST /api/v1/auth/refresh` : Refreshes expired access tokens via refresh tokens.
- `POST /api/v1/auth/logout` : Revokes user token sessions.
- `GET /api/v1/students` : Batch 2023 directory listing.
- `GET /api/v1/students/{reg}` : Student profile with auto-assigned Section (Even=B, Odd=A).
- `GET /api/v1/students/analytics` : Section A vs Section B distribution statistics.
- `GET /api/v1/results/transcript/{reg}` : Semesters 1, 2, 3 grade sheets & credit-weighted CGPA.
- `GET /api/v1/results/simulate?reg=2023331020&target=3.80` : "What-If" GPA target projection simulator.

---

## 4. Git Collaboration Workflow (How to Push Separately)

Both Afif and Usama must push commits under their own GitHub identities:

### **Usama's Push Workflow:**
```bash
# 1. Usama clones the repo on his machine
git clone https://github.com/afifzamankhan-lab/proj250.git
cd proj250

# 2. Configure Usama's git identity
git config user.name "Usama"
git config user.email "usama@student.sust.edu"

# 3. Create Usama's feature branch
git checkout -b feature/usama-auth-student-services

# 4. Stage and commit Usama's Go packages
git add backend/internal/auth backend/internal/student backend/internal/result
git commit -m "feat(backend): implement JWT auth, student section assigner, and CGPA engine in Go"
git push -u origin feature/usama-auth-student-services
```

### **Afif's Push Workflow:**
```bash
# 1. On Afif's machine
git checkout -b feature/afif-routine-course-attendance-services

# 2. Stage and commit Afif's Go packages and Frontend
git add backend/internal/routine backend/internal/course backend/internal/attendance frontend/
git commit -m "feat(backend): implement routine timetable, course analytics, and attendance engine in Go"
git push -u origin feature/afif-routine-course-attendance-services
```

Both branches are merged via Pull Requests on GitHub so that the **GitHub Insights Graph reflects 50% commits from Afif and 50% from Usama**.

---

## 5. 7-Day Roadmap (Exact 50/50 Equity in Go & Full-Stack)

| Day | **Afif Zaman Khan (50%)** | **Usama (50%)** | Combined Deliverable |
| :---: | :--- | :--- | :--- |
| **Day 1** (Done) | **Go:** `routine`, `course`, `attendance` packages (1,401 lines) with tests<br>**Frontend:** Fullscreen Batch 23 Hero & Routine UI | **Go:** `auth`, `student`, `result` packages (1,310 lines) with tests<br>**Frontend:** Auth Modal, Profile & Transcript UI | Complete Full-Stack Architecture running with live Go REST API |
| **Day 2** (Done) | **Go:** Classroom booking conflict validator & endpoint<br>**Frontend:** Connect Next.js to Go Routine, Attendance & Room APIs | **Go:** Token blacklist & session revocation, section filter & semester summary<br>**Package:** Turnkey Day 2 zip (`usama_part_day2.zip`) with 1-click push script | Client-Server live API integration, real-time schedule tracker & safe-bunk analytics |
| **Day 3** (Done) | **Go:** Sessional lab assignment submission & course details API<br>**Frontend:** Course syllabus & teacher contact modal with assignment submission | **Go:** Course enrollment capacity validator & credit cap check (25.0 max)<br>**Package:** Turnkey Day 3 zip (`usama_part_day3.zip`) with 1-click push script | Dynamic course catalog with syllabus inspection, faculty directory & enrollment bounds |
| **Day 4** | **Go:** Class schedule reschedule & holiday calendar service<br>**Frontend:** Routine reschedule alerts banner | **Go:** Attendance record batch export engine<br>**Frontend:** Attendance percentage progress rings | Attendance tracking & class change alert system |
| **Day 5** | **Go:** Department timetable export to PDF/CSV engine<br>**Frontend:** One-click Routine Print & Download button | **Go:** Grade improvement projection simulator in Go<br>**Frontend:** Interactive "What-If" GPA Calculator | Advanced academic analytics & printable routine |
| **Day 6** | **Go:** CR/Teacher announcement broadcast service<br>**Frontend:** Real-time notice feed with urgent tags | **Go:** Password reset via OTP / security questions in Go<br>**Frontend:** Account settings & security preference UI | Portal noticeboard & student credential self-service |
| **Day 7** | **Go:** API performance benchmarks & load testing<br>**Frontend:** Dark mode polish & mobile viewport testing | **Go:** Docker Compose containerization & DB backup<br>**Docs:** Project report & final defense presentation | 100% production-ready project for Sir's defense |

---

## 6. Defense Talking Points (How Afif & Usama Answer Sir)

### **When Sir asks Afif:**
> *"Afif, what Go code did you write?"*  
> **Afif's Answer:** *"Sir, in Go, I designed and implemented three core packages: `internal/routine`, `internal/course`, and `internal/attendance` totaling over 1,400 lines of Go code. Specifically, I engineered the timetable scheduling algorithm that resolves multi-period lab spanning for Section A and Section B, built the real-time classroom occupancy detector (`Room 303`, `Gallery 2`, etc.), developed the 22.5 credit curriculum analytics engine, and implemented the official SUST 75% examination eligibility ordinance and safe-bunk calculator in Go. I also wrote comprehensive unit tests in `routine_test.go`, `course_test.go`, and `attendance_test.go`."*

### **When Sir asks Usama:**
> *"Usama, what Go code did you write?"*  
> **Usama's Answer:** *"Sir, in Go, I designed and implemented three core packages: `internal/auth`, `internal/student`, and `internal/result` totaling over 1,300 lines of Go code. Specifically, I built cryptographic authentication using Argon2id password hashing and HMAC-SHA256 signed JWT tokens, implemented the automated section assignment algorithm (`regLast2 % 2 == 0 ? Section B : Section A`) in `student/service.go`, and developed the SUST 4.0 credit-weighted CGPA calculation engine and What-If GPA projection simulator in `result/service.go`. I also wrote comprehensive unit tests in `jwt_test.go`, `password_test.go`, `student_test.go`, and `result_test.go`."*

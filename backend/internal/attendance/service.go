// Package attendance - Authored by Afif Zaman Khan (2023331020)
package attendance

import (
	"fmt"
	"math"
	"strings"
	"sync"
)

type Service struct {
	mu       sync.RWMutex
	profiles map[string]*StudentAttendanceProfile
}

func NewService() *Service {
	s := &Service{
		profiles: make(map[string]*StudentAttendanceProfile),
	}
	s.seedDefaultData()
	return s
}

func (s *Service) seedDefaultData() {
	// Seed Afif Zaman Khan (2023331020) - Strong attendance
	s.profiles["2023331020"] = s.buildProfile("2023331020", "Afif Zaman Khan", "B", []struct {
		code     string
		name     string
		attended int
		total    int
	}{
		{"CSE 0541 2257", "Data Structures and Algorithms", 22, 24},
		{"CSE 0541 2258", "Data Structures and Algorithms Sessional", 12, 12},
		{"CSE 0612 2260", "Object Oriented Programming Sessional", 11, 12},
		{"CSE 0613 2234", "Database Management Systems Sessional", 10, 11},
		{"CSE 0613 2247", "Discrete Mathematics & Computational Structures", 20, 24},
		{"CSE 0688 2292", "Web Technologies & Software Development Project", 12, 12},
		{"EEE 0714 2201D", "Electrical Technology & Circuit Analysis", 19, 22},
		{"EEE 0714 2202D", "Electrical Technology Sessional", 11, 11},
		{"MAT 0541 2204D", "Numerical Analysis & Complex Variables", 21, 24},
		{"MAT 0541 1011D", "Differential Equations & Coordinate Geometry", 23, 24},
	})

	// Seed Usama (2023331088) - Solid attendance
	s.profiles["2023331088"] = s.buildProfile("2023331088", "Usama", "B", []struct {
		code     string
		name     string
		attended int
		total    int
	}{
		{"CSE 0541 2257", "Data Structures and Algorithms", 21, 24},
		{"CSE 0541 2258", "Data Structures and Algorithms Sessional", 11, 12},
		{"CSE 0612 2260", "Object Oriented Programming Sessional", 12, 12},
		{"CSE 0613 2234", "Database Management Systems Sessional", 10, 11},
		{"CSE 0613 2247", "Discrete Mathematics & Computational Structures", 21, 24},
		{"CSE 0688 2292", "Web Technologies & Software Development Project", 11, 12},
		{"EEE 0714 2201D", "Electrical Technology & Circuit Analysis", 18, 22},
		{"EEE 0714 2202D", "Electrical Technology Sessional", 10, 11},
		{"MAT 0541 2204D", "Numerical Analysis & Complex Variables", 20, 24},
		{"MAT 0541 1011D", "Differential Equations & Coordinate Geometry", 22, 24},
	})
}

func (s *Service) buildProfile(reg, name, section string, rawCourses []struct {
	code     string
	name     string
	attended int
	total    int
}) *StudentAttendanceProfile {
	var courses []CourseAttendance
	var totalAttended, totalClasses int
	var collegiate, nonCollegiate, disCollegiate int

	for _, rc := range rawCourses {
		pct := 0.0
		if rc.total > 0 {
			pct = math.Round((float64(rc.attended)/float64(rc.total))*1000) / 10
		}
		status := ClassifyStatus(pct)
		safeBunks := ComputeSafeBunks(rc.attended, rc.total)
		needed := ComputeNeededClasses(rc.attended, rc.total)

		if status == StatusCollegiate {
			collegiate++
		} else if status == StatusNonCollegiate {
			nonCollegiate++
		} else {
			disCollegiate++
		}

		totalAttended += rc.attended
		totalClasses += rc.total

		courses = append(courses, CourseAttendance{
			CourseCode:   rc.code,
			CourseName:   rc.name,
			TotalClasses: rc.total,
			Attended:     rc.attended,
			Percentage:   pct,
			Status:       status,
			SafeBunks:    safeBunks,
			NeededToPass: needed,
		})
	}

	overallPct := 0.0
	if totalClasses > 0 {
		overallPct = math.Round((float64(totalAttended)/float64(totalClasses))*1000) / 10
	}

	return &StudentAttendanceProfile{
		RegistrationNumber: reg,
		StudentName:        name,
		Section:            section,
		Semester:           4,
		OverallPercentage:  overallPct,
		OverallStatus:      ClassifyStatus(overallPct),
		TotalCourses:       len(courses),
		CollegiateCount:    collegiate,
		NonCollegiateCount: nonCollegiate,
		DisCollegiateCount: disCollegiate,
		Courses:            courses,
	}
}

// ClassifyStatus implements the SUST Academic Council examination ordinance
func ClassifyStatus(percentage float64) EligibilityStatus {
	if percentage >= 75.0 {
		return StatusCollegiate
	}
	if percentage >= 60.0 {
		return StatusNonCollegiate
	}
	return StatusDisCollegiate
}

// ComputeSafeBunks calculates how many upcoming classes can be safely skipped while staying >= 75%
func ComputeSafeBunks(attended, total int) int {
	if total <= 0 || attended <= 0 {
		return 0
	}
	pct := (float64(attended) / float64(total)) * 100.0
	if pct < 75.0 {
		return 0
	}
	// Formula: (attended) / (total + x) >= 0.75  =>  total + x <= attended / 0.75  =>  x <= (attended - 0.75*total) / 0.75
	bunks := float64(attended)/0.75 - float64(total)
	if bunks < 0 {
		return 0
	}
	return int(math.Floor(bunks))
}

// ComputeNeededClasses calculates consecutive classes needed to climb back to >= 75%
func ComputeNeededClasses(attended, total int) int {
	if total <= 0 {
		return 0
	}
	pct := (float64(attended) / float64(total)) * 100.0
	if pct >= 75.0 {
		return 0
	}
	// Formula: (attended + y) / (total + y) >= 0.75 => y >= (0.75*total - attended) / 0.25
	needed := (0.75*float64(total) - float64(attended)) / 0.25
	return int(math.Ceil(needed))
}

func (s *Service) GetAttendanceProfile(reg string) (*StudentAttendanceProfile, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	p, exists := s.profiles[reg]
	if !exists {
		// Auto-generate profile for arbitrary student with section calculation
		regTrim := strings.TrimSpace(reg)
		section := "A"
		if len(regTrim) >= 2 {
			last2 := regTrim[len(regTrim)-2:]
			var val int
			fmt.Sscanf(last2, "%d", &val)
			if val%2 == 0 {
				section = "B"
			}
		}
		newProfile := s.buildProfile(reg, "SUST Student", section, []struct {
			code     string
			name     string
			attended int
			total    int
		}{
			{"CSE 0541 2257", "Data Structures and Algorithms", 18, 22},
			{"CSE 0541 2258", "Data Structures and Algorithms Sessional", 10, 11},
			{"CSE 0612 2260", "Object Oriented Programming Sessional", 10, 11},
			{"CSE 0613 2234", "Database Management Systems Sessional", 9, 10},
			{"CSE 0613 2247", "Discrete Mathematics & Computational Structures", 17, 22},
			{"CSE 0688 2292", "Web Technologies & Software Development Project", 10, 11},
			{"EEE 0714 2201D", "Electrical Technology & Circuit Analysis", 16, 20},
			{"EEE 0714 2202D", "Electrical Technology Sessional", 9, 10},
			{"MAT 0541 2204D", "Numerical Analysis & Complex Variables", 18, 22},
			{"MAT 0541 1011D", "Differential Equations & Coordinate Geometry", 19, 22},
		})
		return newProfile, true
	}
	return p, true
}

func (s *Service) AnalyzeSafeBunks(reg, courseCode string) (*SafeBunkAnalysisResponse, error) {
	profile, _ := s.GetAttendanceProfile(reg)
	needle := strings.ToLower(strings.ReplaceAll(courseCode, " ", ""))

	for _, c := range profile.Courses {
		haystack := strings.ToLower(strings.ReplaceAll(c.CourseCode, " ", ""))
		if needle == haystack {
			advice := "Attendance is in excellent standing. You can safely afford to miss classes without falling below 75%."
			if c.Status == StatusNonCollegiate {
				advice = fmt.Sprintf("Warning: Non-Collegiate status! You must attend the next %d classes consecutively to regain 75%%.", c.NeededToPass)
			} else if c.Status == StatusDisCollegiate {
				advice = fmt.Sprintf("Critical Alert: Dis-Collegiate risk! Attend the next %d classes without fail to avoid exam debarment.", c.NeededToPass)
			}

			return &SafeBunkAnalysisResponse{
				RegistrationNumber: reg,
				CourseCode:         c.CourseCode,
				CourseName:         c.CourseName,
				TotalHeld:          c.TotalClasses,
				Attended:           c.Attended,
				CurrentPercentage:  c.Percentage,
				Status:             string(c.Status),
				SafeBunks:          c.SafeBunks,
				ConsecutiveNeeded:  c.NeededToPass,
				Advice:             advice,
			}, nil
		}
	}

	return nil, fmt.Errorf("course %s not found in student's enrolled courses", courseCode)
}

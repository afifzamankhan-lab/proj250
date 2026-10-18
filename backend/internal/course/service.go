// Package course - Authored by Afif Zaman Khan (2023331020)
package course

import (
	"strings"
)

type Service struct {
	courses []Course
}

func NewService() *Service {
	s := &Service{}
	s.initializeCourses()
	return s
}

func (s *Service) initializeCourses() {
	standardTheoryEval := EvaluationScheme{Attendance: 10.0, ClassTests: 20.0, SemesterFinal: 70.0}
	standardLabEval := EvaluationScheme{Attendance: 10.0, ClassTests: 40.0, SemesterFinal: 50.0}

	s.courses = []Course{
		{
			Code:          "CSE 0541 2257",
			Name:          "Data Structures and Algorithms",
			Credits:       3.0,
			Teacher:       "Md. Jahidul Islam (MJI)",
			TeacherShort:  "MJI",
			Type:          "theory",
			Semester:      4,
			Department:    "CSE",
			Prerequisites: []string{"CSE 0612 1101"},
			Evaluation:    standardTheoryEval,
		},
		{
			Code:          "CSE 0541 2258",
			Name:          "Data Structures and Algorithms Sessional",
			Credits:       1.5,
			Teacher:       "Md. Jahidul Islam (MJI)",
			TeacherShort:  "MJI",
			Type:          "lab",
			Semester:      4,
			Department:    "CSE",
			Prerequisites: []string{"CSE 0541 2257"},
			Evaluation:    standardLabEval,
		},
		{
			Code:          "CSE 0612 2260",
			Name:          "Object Oriented Programming Sessional",
			Credits:       1.5,
			Teacher:       "Prof. Dr. Mohammad Masudur Rahman (MMH)",
			TeacherShort:  "MMH",
			Type:          "lab",
			Semester:      4,
			Department:    "CSE",
			Prerequisites: []string{"CSE 0612 1101"},
			Evaluation:    standardLabEval,
		},
		{
			Code:          "CSE 0613 2234",
			Name:          "Database Management Systems Sessional",
			Credits:       1.5,
			Teacher:       "Md. Habibur Rahman (MHM)",
			TeacherShort:  "MHM",
			Type:          "lab",
			Semester:      4,
			Department:    "CSE",
			Prerequisites: []string{},
			Evaluation:    standardLabEval,
		},
		{
			Code:          "CSE 0613 2247",
			Name:          "Discrete Mathematics & Computational Structures",
			Credits:       3.0,
			Teacher:       "Md. Saiful Islam (MSC)",
			TeacherShort:  "MSC",
			Type:          "theory",
			Semester:      4,
			Department:    "CSE",
			Prerequisites: []string{},
			Evaluation:    standardTheoryEval,
		},
		{
			Code:          "CSE 0688 2292",
			Name:          "Web Technologies & Software Development Project",
			Credits:       1.5,
			Teacher:       "Fahim Ishrak (FIF)",
			TeacherShort:  "FIF",
			Type:          "lab",
			Semester:      4,
			Department:    "CSE",
			Prerequisites: []string{"CSE 0612 1101"},
			Evaluation:    standardLabEval,
		},
		{
			Code:          "EEE 0714 2201D",
			Name:          "Electrical Technology & Circuit Analysis",
			Credits:       3.0,
			Teacher:       "Dept. of Electrical and Electronic Engineering",
			TeacherShort:  "EEE",
			Type:          "theory",
			Semester:      4,
			Department:    "EEE",
			Prerequisites: []string{},
			Evaluation:    standardTheoryEval,
		},
		{
			Code:          "EEE 0714 2202D",
			Name:          "Electrical Technology Sessional",
			Credits:       1.5,
			Teacher:       "Dept. of Electrical and Electronic Engineering",
			TeacherShort:  "EEE",
			Type:          "lab",
			Semester:      4,
			Department:    "EEE",
			Prerequisites: []string{"EEE 0714 2201D"},
			Evaluation:    standardLabEval,
		},
		{
			Code:          "MAT 0541 2204D",
			Name:          "Numerical Analysis & Complex Variables",
			Credits:       3.0,
			Teacher:       "Dept. of Mathematics (MAT)",
			TeacherShort:  "MAT",
			Type:          "theory",
			Semester:      4,
			Department:    "MAT",
			Prerequisites: []string{"MAT 0541 1011D"},
			Evaluation:    standardTheoryEval,
		},
		{
			Code:          "MAT 0541 1011D",
			Name:          "Differential Equations & Coordinate Geometry",
			Credits:       3.0,
			Teacher:       "Dept. of Mathematics (MAT)",
			TeacherShort:  "MAT",
			Type:          "theory",
			Semester:      4,
			Department:    "MAT",
			Prerequisites: []string{},
			Evaluation:    standardTheoryEval,
		},
	}
}

func (s *Service) GetCoursesBySemester(sem int) []Course {
	var result []Course
	for _, c := range s.courses {
		if c.Semester == sem {
			result = append(result, c)
		}
	}
	return result
}

func (s *Service) GetCourseByCode(code string) (*Course, bool) {
	needle := strings.ToLower(strings.ReplaceAll(code, " ", ""))
	for _, c := range s.courses {
		haystack := strings.ToLower(strings.ReplaceAll(c.Code, " ", ""))
		if needle == haystack {
			return &c, true
		}
	}
	return nil, false
}

// GetCurriculumAnalytics calculates credit and course distributions
func (s *Service) GetCurriculumAnalytics() CurriculumAnalytics {
	var totalCredits, theoryCredits, labCredits float64
	var theoryCount, labCount int

	for _, c := range s.courses {
		totalCredits += c.Credits
		if c.Type == "theory" {
			theoryCredits += c.Credits
			theoryCount++
		} else {
			labCredits += c.Credits
			labCount++
		}
	}

	return CurriculumAnalytics{
		Semester:      "2/2 (4th Semester)",
		Session:       "2023–2024",
		TotalCourses:  len(s.courses),
		TheoryCourses: theoryCount,
		LabCourses:    labCount,
		TotalCredits:  totalCredits,
		TheoryCredits: theoryCredits,
		LabCredits:    labCredits,
	}
}

// CheckPrerequisites verifies if a student satisfies prerequisites for an enrolled course
func (s *Service) CheckPrerequisites(targetCode string, passedCodes []string) PrerequisiteCheckResponse {
	target, exists := s.GetCourseByCode(targetCode)
	if !exists {
		return PrerequisiteCheckResponse{
			TargetCourse: targetCode,
			Eligible:     false,
			Message:      "Target course not found in catalog",
		}
	}

	if len(target.Prerequisites) == 0 {
		return PrerequisiteCheckResponse{
			TargetCourse: target.Code,
			Eligible:     true,
			Message:      "No prerequisite required for this course",
		}
	}

	passedMap := make(map[string]bool)
	for _, p := range passedCodes {
		passedMap[strings.ToLower(strings.ReplaceAll(p, " ", ""))] = true
	}

	var missing []string
	for _, req := range target.Prerequisites {
		normReq := strings.ToLower(strings.ReplaceAll(req, " ", ""))
		if !passedMap[normReq] {
			missing = append(missing, req)
		}
	}

	if len(missing) == 0 {
		return PrerequisiteCheckResponse{
			TargetCourse: target.Code,
			Eligible:     true,
			Message:      "All prerequisites satisfied",
		}
	}

	return PrerequisiteCheckResponse{
		TargetCourse:        target.Code,
		Eligible:            false,
		MissingPrerequisites: missing,
		Message:             "Missing required prerequisite courses",
	}
}

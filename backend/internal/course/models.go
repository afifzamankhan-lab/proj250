// Package course - Authored by Afif Zaman Khan (2023331020)
// Module: Academic Curriculum & Credit Analytics Engine
package course

type EvaluationScheme struct {
	Attendance    float64 `json:"attendance"`    // 10%
	ClassTests    float64 `json:"classTests"`    // 20%
	SemesterFinal float64 `json:"semesterFinal"` // 70%
}

type Course struct {
	Code          string           `json:"code"`
	Name          string           `json:"name"`
	Credits       float64          `json:"credits"`
	Teacher       string           `json:"teacher"`
	TeacherShort  string           `json:"teacherShort"`
	Type          string           `json:"type"` // "theory" or "lab"
	Semester      int              `json:"semester"`
	Department    string           `json:"department"`
	Prerequisites []string         `json:"prerequisites"`
	Evaluation    EvaluationScheme `json:"evaluation"`
}

type CurriculumAnalytics struct {
	Semester      string  `json:"semester"`
	Session       string  `json:"session"`
	TotalCourses  int     `json:"totalCourses"`
	TheoryCourses int     `json:"theoryCourses"`
	LabCourses    int     `json:"labCourses"`
	TotalCredits  float64 `json:"totalCredits"`
	TheoryCredits float64 `json:"theoryCredits"`
	LabCredits    float64 `json:"labCredits"`
}

type PrerequisiteCheckRequest struct {
	TargetCourse   string   `json:"targetCourse"`
	PassedCourses []string `json:"passedCourses"`
}

type PrerequisiteCheckResponse struct {
	TargetCourse        string   `json:"targetCourse"`
	Eligible            bool     `json:"eligible"`
	MissingPrerequisites []string `json:"missingPrerequisites"`
	Message             string   `json:"message"`
}

// Day 3 Models: Lab Assignments & Syllabus Details
type Assignment struct {
	ID          string `json:"id"`
	CourseCode  string `json:"courseCode"`
	Title       string `json:"title"`
	Description string `json:"description"`
	DueDate     string `json:"dueDate"`
	MaxMarks    int    `json:"maxMarks"`
	LabRoom     string `json:"labRoom"`
	Submitted   bool   `json:"submitted"`
}

type SyllabusTopic struct {
	Week        int    `json:"week"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Reference   string `json:"reference"`
}

type CourseDetail struct {
	Course        Course          `json:"course"`
	TeacherEmail  string          `json:"teacherEmail"`
	OfficeRoom    string          `json:"officeRoom"`
	Syllabus      []SyllabusTopic `json:"syllabus"`
	Assignments   []Assignment    `json:"assignments"`
}

type AssignmentSubmitRequest struct {
	AssignmentID string `json:"assignmentId"`
	StudentReg   string `json:"studentReg"`
	FileName     string `json:"fileName"`
	Notes        string `json:"notes"`
}

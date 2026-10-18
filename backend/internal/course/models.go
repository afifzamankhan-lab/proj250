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

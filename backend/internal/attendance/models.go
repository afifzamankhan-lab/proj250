// Package attendance - Authored by Afif Zaman Khan (2023331020)
// Module: Class Attendance Tracking, SUST 75% Ordinance & Safe-Bunk Calculator
package attendance

type EligibilityStatus string

const (
	StatusCollegiate    EligibilityStatus = "COLLEGIATE"     // >= 75%: Eligible without penalty
	StatusNonCollegiate EligibilityStatus = "NON_COLLEGIATE" // 60% - 74.9%: Eligible with non-collegiate fine
	StatusDisCollegiate EligibilityStatus = "DIS_COLLEGIATE" // < 60%: Strictly barred from semester-final exam
)

type CourseAttendance struct {
	CourseCode   string            `json:"courseCode"`
	CourseName   string            `json:"courseName"`
	TotalClasses int               `json:"totalClasses"`
	Attended     int               `json:"attended"`
	Percentage   float64           `json:"percentage"`
	Status       EligibilityStatus `json:"status"`
	SafeBunks    int               `json:"safeBunks"`    // Classes student can safely miss maintaining >= 75%
	NeededToPass int               `json:"neededToPass"` // Classes needed consecutively if < 75%
}

type StudentAttendanceProfile struct {
	RegistrationNumber string             `json:"registrationNumber"`
	StudentName        string             `json:"studentName"`
	Section            string             `json:"section"`
	Semester           int                `json:"semester"`
	OverallPercentage  float64            `json:"overallPercentage"`
	OverallStatus      EligibilityStatus  `json:"overallStatus"`
	TotalCourses       int                `json:"totalCourses"`
	CollegiateCount    int                `json:"collegiateCount"`
	NonCollegiateCount int                `json:"nonCollegiateCount"`
	DisCollegiateCount int                `json:"disCollegiateCount"`
	Courses            []CourseAttendance `json:"courses"`
}

type MarkAttendanceRequest struct {
	RegistrationNumber string `json:"registrationNumber"`
	CourseCode         string `json:"courseCode"`
	Attended           bool   `json:"attended"`
}

type SafeBunkAnalysisResponse struct {
	RegistrationNumber string  `json:"registrationNumber"`
	CourseCode         string  `json:"courseCode"`
	CourseName         string  `json:"courseName"`
	TotalHeld          int     `json:"totalHeld"`
	Attended           int     `json:"attended"`
	CurrentPercentage  float64 `json:"currentPercentage"`
	Status             string  `json:"status"`
	SafeBunks          int     `json:"safeBunks"`
	ConsecutiveNeeded  int     `json:"consecutiveNeeded"`
	Advice             string  `json:"advice"`
}

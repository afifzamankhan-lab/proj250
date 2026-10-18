// Package routine - Authored by Afif Zaman Khan (2023331020)
// Module: Academic Routine, Timetable & Classroom Allocation Engine (Section A & B)
package routine

type ClassType string

const (
	TypeTheory ClassType = "theory"
	TypeLab    ClassType = "lab"
	TypeBreak  ClassType = "break"
	TypeEmpty  ClassType = "empty"
)

type RoutinePeriod struct {
	Time       string    `json:"time"`
	EndTime    string    `json:"endTime"`
	Course     string    `json:"course"`
	CourseCode string    `json:"courseCode"`
	Room       string    `json:"room"`
	Teacher    string    `json:"teacher"`
	Type       ClassType `json:"type"`
	Periods    string    `json:"periods"`
	StartMin   int       `json:"startMin"` // Minutes from 00:00 (e.g. 9:00 AM = 540)
	EndMin     int       `json:"endMin"`   // Minutes from 00:00 (e.g. 10:30 AM = 630)
}

type WeeklyGridCell struct {
	Title   string    `json:"title"`
	Room    string    `json:"room,omitempty"`
	Teacher string    `json:"teacher,omitempty"`
	Type    ClassType `json:"type"`
	ColSpan int       `json:"colSpan"`
}

type DayRoutineResponse struct {
	Section string          `json:"section"`
	Day     string          `json:"day"`
	DayNum  int             `json:"dayNum"`
	Classes []RoutinePeriod `json:"classes"`
	Total   int             `json:"total"`
}

type WeeklyRoutineResponse struct {
	Section  string                      `json:"section"`
	Semester string                      `json:"semester"`
	Session  string                      `json:"session"`
	Schedule map[string][]WeeklyGridCell `json:"schedule"`
}

type CurrentClassResponse struct {
	Section      string         `json:"section"`
	CurrentClass *RoutinePeriod `json:"currentClass,omitempty"`
	NextClass    *RoutinePeriod `json:"nextClass,omitempty"`
	Status       string         `json:"status"` // "in_class", "break", "day_ended", "weekend"
	CheckedAt    string         `json:"checkedAt"`
}

type RoomAvailabilityResponse struct {
	DayName   string   `json:"dayName"`
	TimeSlot  string   `json:"timeSlot"`
	FreeRooms []string `json:"freeRooms"`
	BusyRooms []string `json:"busyRooms"`
}

// Package routine - Authored by Afif Zaman Khan (2023331020)
// Service implementation for Section A and Section B 2/2 academic routine
package routine

import (
	"fmt"
	"strings"
	"time"
)

var AllClassrooms = []string{
	"Room 303",
	"Room 304",
	"Room 629",
	"Room 630",
	"Gallery 2",
	"Room EEE",
}

type Service struct {
	sectionA map[int][]RoutinePeriod
	sectionB map[int][]RoutinePeriod
	gridA    map[string][]WeeklyGridCell
	gridB    map[string][]WeeklyGridCell
}

func NewService() *Service {
	s := &Service{
		sectionA: make(map[int][]RoutinePeriod),
		sectionB: make(map[int][]RoutinePeriod),
		gridA:    make(map[string][]WeeklyGridCell),
		gridB:    make(map[string][]WeeklyGridCell),
	}
	s.initializeRoutines()
	return s
}

func (s *Service) initializeRoutines() {
	// Section A (Odd rolls)
	s.sectionA[0] = []RoutinePeriod{
		{Time: "09:00 AM", EndTime: "10:30 AM", Course: "Object Oriented Programming Sessional", CourseCode: "CSE 0612 2260", Room: "Room 303", Teacher: "MMH", Type: TypeLab, Periods: "Periods 1–2 (9:00 - 10:30 AM)", StartMin: 540, EndMin: 630},
		{Time: "10:30 AM", EndTime: "12:45 PM", Course: "Data Structures and Algorithms Sessional", CourseCode: "CSE 0541 2258", Room: "Room 630", Teacher: "MJI", Type: TypeLab, Periods: "Periods 3–5 (10:30 AM - 12:45 PM)", StartMin: 630, EndMin: 765},
		{Time: "01:45 PM", EndTime: "02:30 PM", Course: "Data Structures and Algorithms", CourseCode: "CSE 0541 2257", Room: "Gallery 2", Teacher: "MJI", Type: TypeTheory, Periods: "Period 7 (1:45 - 2:30 PM)", StartMin: 825, EndMin: 870},
		{Time: "03:15 PM", EndTime: "04:00 PM", Course: "Differential Equations & Coordinate Geometry", CourseCode: "MAT 0541 1011D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, Periods: "Period 9 (3:15 - 4:00 PM)", StartMin: 915, EndMin: 960},
	}
	s.sectionA[1] = []RoutinePeriod{
		{Time: "10:30 AM", EndTime: "12:45 PM", Course: "Electrical Technology Sessional", CourseCode: "EEE 0714 2202D", Room: "Room EEE", Teacher: "EEE", Type: TypeLab, Periods: "Periods 3–5 (10:30 AM - 12:45 PM)", StartMin: 630, EndMin: 765},
		{Time: "01:45 PM", EndTime: "02:30 PM", Course: "Electrical Technology & Circuits", CourseCode: "EEE 0714 2201D", Room: "Room 629", Teacher: "EEE", Type: TypeTheory, Periods: "Period 7 (1:45 - 2:30 PM)", StartMin: 825, EndMin: 870},
		{Time: "02:30 PM", EndTime: "03:15 PM", Course: "Numerical Analysis & Statistics", CourseCode: "MAT 0541 2204D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, Periods: "Period 8 (2:30 - 3:15 PM)", StartMin: 870, EndMin: 915},
		{Time: "03:15 PM", EndTime: "04:00 PM", Course: "Discrete Mathematics & Computational Structures", CourseCode: "CSE 0613 2247", Room: "Gallery 2", Teacher: "MSC", Type: TypeTheory, Periods: "Period 9 (3:15 - 4:00 PM)", StartMin: 915, EndMin: 960},
	}
	s.sectionA[2] = []RoutinePeriod{
		{Time: "11:15 AM", EndTime: "12:45 PM", Course: "Object Oriented Programming Sessional", CourseCode: "CSE 0612 2260", Room: "Room 303", Teacher: "MMH", Type: TypeLab, Periods: "Periods 4–5 (11:15 AM - 12:45 PM)", StartMin: 675, EndMin: 765},
		{Time: "01:45 PM", EndTime: "02:30 PM", Course: "Data Structures and Algorithms", CourseCode: "CSE 0541 2257", Room: "Gallery 2", Teacher: "MJI", Type: TypeTheory, Periods: "Period 7 (1:45 - 2:30 PM)", StartMin: 825, EndMin: 870},
		{Time: "02:30 PM", EndTime: "03:15 PM", Course: "Numerical Analysis & Statistics", CourseCode: "MAT 0541 2204D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, Periods: "Period 8 (2:30 - 3:15 PM)", StartMin: 870, EndMin: 915},
		{Time: "03:15 PM", EndTime: "04:00 PM", Course: "Discrete Mathematics & Computational Structures", CourseCode: "CSE 0613 2247", Room: "Gallery 2", Teacher: "MSC", Type: TypeTheory, Periods: "Period 9 (3:15 - 4:00 PM)", StartMin: 915, EndMin: 960},
	}
	s.sectionA[3] = []RoutinePeriod{
		{Time: "01:45 PM", EndTime: "02:30 PM", Course: "Electrical Technology & Circuits", CourseCode: "EEE 0714 2201D", Room: "Room 629", Teacher: "EEE", Type: TypeTheory, Periods: "Period 7 (1:45 - 2:30 PM)", StartMin: 825, EndMin: 870},
		{Time: "02:30 PM", EndTime: "03:15 PM", Course: "Numerical Analysis & Statistics", CourseCode: "MAT 0541 2204D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, Periods: "Period 8 (2:30 - 3:15 PM)", StartMin: 870, EndMin: 915},
		{Time: "03:15 PM", EndTime: "04:00 PM", Course: "Discrete Mathematics & Computational Structures", CourseCode: "CSE 0613 2247", Room: "Gallery 2", Teacher: "MSC", Type: TypeTheory, Periods: "Period 9 (3:15 - 4:00 PM)", StartMin: 915, EndMin: 960},
	}
	s.sectionA[4] = []RoutinePeriod{
		{Time: "09:00 AM", EndTime: "11:15 AM", Course: "Database Management Systems Sessional", CourseCode: "CSE 0613 2234", Room: "Room 304", Teacher: "MHM", Type: TypeLab, Periods: "Periods 1–3 (9:00 - 11:15 AM)", StartMin: 540, EndMin: 675},
		{Time: "01:45 PM", EndTime: "04:00 PM", Course: "Web Technologies & Software Development Project", CourseCode: "CSE 0688 2292", Room: "Room 630", Teacher: "FIF", Type: TypeLab, Periods: "Periods 7–9 (1:45 - 4:00 PM)", StartMin: 825, EndMin: 960},
	}

	// Section B (Even rolls: Afif 20, Usama 88)
	s.sectionB[0] = []RoutinePeriod{
		{Time: "10:30 AM", EndTime: "12:45 PM", Course: "Electrical Technology Sessional", CourseCode: "EEE 0714 2202D", Room: "Room EEE", Teacher: "EEE", Type: TypeLab, Periods: "Periods 3–5 (10:30 AM - 12:45 PM)", StartMin: 630, EndMin: 765},
		{Time: "01:45 PM", EndTime: "02:30 PM", Course: "Data Structures and Algorithms", CourseCode: "CSE 0541 2257", Room: "Gallery 2", Teacher: "MJI", Type: TypeTheory, Periods: "Period 7 (1:45 - 2:30 PM)", StartMin: 825, EndMin: 870},
		{Time: "03:15 PM", EndTime: "04:00 PM", Course: "Differential Equations & Coordinate Geometry", CourseCode: "MAT 0541 1011D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, Periods: "Period 9 (3:15 - 4:00 PM)", StartMin: 915, EndMin: 960},
	}
	s.sectionB[1] = []RoutinePeriod{
		{Time: "09:00 AM", EndTime: "10:30 AM", Course: "Object Oriented Programming Sessional", CourseCode: "CSE 0612 2260", Room: "Room 303", Teacher: "MMH", Type: TypeLab, Periods: "Periods 1–2 (9:00 - 10:30 AM)", StartMin: 540, EndMin: 630},
		{Time: "10:30 AM", EndTime: "12:45 PM", Course: "Data Structures and Algorithms Sessional", CourseCode: "CSE 0541 2258", Room: "Room 630", Teacher: "MJI", Type: TypeLab, Periods: "Periods 3–5 (10:30 AM - 12:45 PM)", StartMin: 630, EndMin: 765},
		{Time: "01:45 PM", EndTime: "02:30 PM", Course: "Electrical Technology & Circuits", CourseCode: "EEE 0714 2201D", Room: "Room 629", Teacher: "EEE", Type: TypeTheory, Periods: "Period 7 (1:45 - 2:30 PM)", StartMin: 825, EndMin: 870},
		{Time: "02:30 PM", EndTime: "03:15 PM", Course: "Numerical Analysis & Statistics", CourseCode: "MAT 0541 2204D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, Periods: "Period 8 (2:30 - 3:15 PM)", StartMin: 870, EndMin: 915},
		{Time: "03:15 PM", EndTime: "04:00 PM", Course: "Discrete Mathematics & Computational Structures", CourseCode: "CSE 0613 2247", Room: "Gallery 2", Teacher: "MSC", Type: TypeTheory, Periods: "Period 9 (3:15 - 4:00 PM)", StartMin: 915, EndMin: 960},
	}
	s.sectionB[2] = []RoutinePeriod{
		{Time: "01:45 PM", EndTime: "02:30 PM", Course: "Data Structures and Algorithms", CourseCode: "CSE 0541 2257", Room: "Gallery 2", Teacher: "MJI", Type: TypeTheory, Periods: "Period 7 (1:45 - 2:30 PM)", StartMin: 825, EndMin: 870},
		{Time: "02:30 PM", EndTime: "03:15 PM", Course: "Numerical Analysis & Statistics", CourseCode: "MAT 0541 2204D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, Periods: "Period 8 (2:30 - 3:15 PM)", StartMin: 870, EndMin: 915},
		{Time: "03:15 PM", EndTime: "04:00 PM", Course: "Discrete Mathematics & Computational Structures", CourseCode: "CSE 0613 2247", Room: "Gallery 2", Teacher: "MSC", Type: TypeTheory, Periods: "Period 9 (3:15 - 4:00 PM)", StartMin: 915, EndMin: 960},
	}
	s.sectionB[3] = []RoutinePeriod{
		{Time: "01:45 PM", EndTime: "02:30 PM", Course: "Electrical Technology & Circuits", CourseCode: "EEE 0714 2201D", Room: "Room 629", Teacher: "EEE", Type: TypeTheory, Periods: "Period 7 (1:45 - 2:30 PM)", StartMin: 825, EndMin: 870},
		{Time: "02:30 PM", EndTime: "03:15 PM", Course: "Numerical Analysis & Statistics", CourseCode: "MAT 0541 2204D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, Periods: "Period 8 (2:30 - 3:15 PM)", StartMin: 870, EndMin: 915},
		{Time: "03:15 PM", EndTime: "04:00 PM", Course: "Discrete Mathematics & Computational Structures", CourseCode: "CSE 0613 2247", Room: "Gallery 2", Teacher: "MSC", Type: TypeTheory, Periods: "Period 9 (3:15 - 4:00 PM)", StartMin: 915, EndMin: 960},
	}
	s.sectionB[4] = []RoutinePeriod{
		{Time: "09:00 AM", EndTime: "11:15 AM", Course: "Web Technologies & Software Development Project", CourseCode: "CSE 0688 2292", Room: "Room 630", Teacher: "FIF", Type: TypeLab, Periods: "Periods 1–3 (9:00 - 11:15 AM)", StartMin: 540, EndMin: 675},
		{Time: "11:15 AM", EndTime: "12:45 PM", Course: "Object Oriented Programming Sessional", CourseCode: "CSE 0612 2260", Room: "Room 303", Teacher: "MMH", Type: TypeLab, Periods: "Periods 4–5 (11:15 AM - 12:45 PM)", StartMin: 675, EndMin: 765},
		{Time: "01:45 PM", EndTime: "04:00 PM", Course: "Database Management Systems Sessional", CourseCode: "CSE 0613 2234", Room: "Room 304", Teacher: "MHM", Type: TypeLab, Periods: "Periods 7–9 (1:45 - 4:00 PM)", StartMin: 825, EndMin: 960},
	}

	// Weekly Grids
	s.gridA["Sunday"] = []WeeklyGridCell{
		{Title: "CSE 0612 2260", Room: "Room 303", Teacher: "MMH", Type: TypeLab, ColSpan: 2},
		{Title: "CSE 0541 2258", Room: "Room 630", Teacher: "MJI", Type: TypeLab, ColSpan: 3},
		{Title: "Lunch Break", Type: TypeBreak, ColSpan: 1},
		{Title: "CSE 0541 2257", Room: "Gallery 2", Teacher: "MJI", Type: TypeTheory, ColSpan: 1},
		{Title: "—", Type: TypeEmpty, ColSpan: 1},
		{Title: "MAT 0541 1011D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, ColSpan: 1},
	}
	s.gridA["Monday"] = []WeeklyGridCell{
		{Title: "—", Type: TypeEmpty, ColSpan: 2},
		{Title: "EEE 0714 2202D", Room: "Room EEE", Teacher: "EEE", Type: TypeLab, ColSpan: 3},
		{Title: "Lunch Break", Type: TypeBreak, ColSpan: 1},
		{Title: "EEE 0714 2201D", Room: "Room 629", Teacher: "EEE", Type: TypeTheory, ColSpan: 1},
		{Title: "MAT 0541 2204D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, ColSpan: 1},
		{Title: "CSE 0613 2247", Room: "Gallery 2", Teacher: "MSC", Type: TypeTheory, ColSpan: 1},
	}
	s.gridA["Tuesday"] = []WeeklyGridCell{
		{Title: "—", Type: TypeEmpty, ColSpan: 3},
		{Title: "CSE 0612 2260", Room: "Room 303", Teacher: "MMH", Type: TypeLab, ColSpan: 2},
		{Title: "Lunch Break", Type: TypeBreak, ColSpan: 1},
		{Title: "CSE 0541 2257", Room: "Gallery 2", Teacher: "MJI", Type: TypeTheory, ColSpan: 1},
		{Title: "MAT 0541 2204D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, ColSpan: 1},
		{Title: "CSE 0613 2247", Room: "Gallery 2", Teacher: "MSC", Type: TypeTheory, ColSpan: 1},
	}
	s.gridA["Wednesday"] = []WeeklyGridCell{
		{Title: "—", Type: TypeEmpty, ColSpan: 5},
		{Title: "Lunch Break", Type: TypeBreak, ColSpan: 1},
		{Title: "EEE 0714 2201D", Room: "Room 629", Teacher: "EEE", Type: TypeTheory, ColSpan: 1},
		{Title: "MAT 0541 2204D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, ColSpan: 1},
		{Title: "CSE 0613 2247", Room: "Gallery 2", Teacher: "MSC", Type: TypeTheory, ColSpan: 1},
	}
	s.gridA["Thursday"] = []WeeklyGridCell{
		{Title: "CSE 0613 2234", Room: "Room 304", Teacher: "MHM", Type: TypeLab, ColSpan: 3},
		{Title: "—", Type: TypeEmpty, ColSpan: 2},
		{Title: "Lunch Break", Type: TypeBreak, ColSpan: 1},
		{Title: "CSE 0688 2292", Room: "Room 630", Teacher: "FIF", Type: TypeLab, ColSpan: 3},
	}

	s.gridB["Sunday"] = []WeeklyGridCell{
		{Title: "—", Type: TypeEmpty, ColSpan: 2},
		{Title: "EEE 0714 2202D", Room: "Room EEE", Teacher: "EEE", Type: TypeLab, ColSpan: 3},
		{Title: "Lunch Break", Type: TypeBreak, ColSpan: 1},
		{Title: "CSE 0541 2257", Room: "Gallery 2", Teacher: "MJI", Type: TypeTheory, ColSpan: 1},
		{Title: "—", Type: TypeEmpty, ColSpan: 1},
		{Title: "MAT 0541 1011D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, ColSpan: 1},
	}
	s.gridB["Monday"] = []WeeklyGridCell{
		{Title: "CSE 0612 2260", Room: "Room 303", Teacher: "MMH", Type: TypeLab, ColSpan: 2},
		{Title: "CSE 0541 2258", Room: "Room 630", Teacher: "MJI", Type: TypeLab, ColSpan: 3},
		{Title: "Lunch Break", Type: TypeBreak, ColSpan: 1},
		{Title: "EEE 0714 2201D", Room: "Room 629", Teacher: "EEE", Type: TypeTheory, ColSpan: 1},
		{Title: "MAT 0541 2204D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, ColSpan: 1},
		{Title: "CSE 0613 2247", Room: "Gallery 2", Teacher: "MSC", Type: TypeTheory, ColSpan: 1},
	}
	s.gridB["Tuesday"] = []WeeklyGridCell{
		{Title: "—", Type: TypeEmpty, ColSpan: 5},
		{Title: "Lunch Break", Type: TypeBreak, ColSpan: 1},
		{Title: "CSE 0541 2257", Room: "Gallery 2", Teacher: "MJI", Type: TypeTheory, ColSpan: 1},
		{Title: "MAT 0541 2204D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, ColSpan: 1},
		{Title: "CSE 0613 2247", Room: "Gallery 2", Teacher: "MSC", Type: TypeTheory, ColSpan: 1},
	}
	s.gridB["Wednesday"] = []WeeklyGridCell{
		{Title: "—", Type: TypeEmpty, ColSpan: 5},
		{Title: "Lunch Break", Type: TypeBreak, ColSpan: 1},
		{Title: "EEE 0714 2201D", Room: "Room 629", Teacher: "EEE", Type: TypeTheory, ColSpan: 1},
		{Title: "MAT 0541 2204D", Room: "Room 629", Teacher: "MAT", Type: TypeTheory, ColSpan: 1},
		{Title: "CSE 0613 2247", Room: "Gallery 2", Teacher: "MSC", Type: TypeTheory, ColSpan: 1},
	}
	s.gridB["Thursday"] = []WeeklyGridCell{
		{Title: "CSE 0688 2292", Room: "Room 630", Teacher: "FIF", Type: TypeLab, ColSpan: 3},
		{Title: "CSE 0612 2260", Room: "Room 303", Teacher: "MMH", Type: TypeLab, ColSpan: 2},
		{Title: "Lunch Break", Type: TypeBreak, ColSpan: 1},
		{Title: "CSE 0613 2234", Room: "Room 304", Teacher: "MHM", Type: TypeLab, ColSpan: 3},
	}
}

func (s *Service) GetDayRoutine(section string, day int) []RoutinePeriod {
	sec := strings.ToUpper(strings.TrimSpace(section))
	if sec != "A" && sec != "B" {
		sec = "B"
	}
	if day < 0 || day > 4 {
		return []RoutinePeriod{} // Friday/Saturday weekend
	}

	if sec == "A" {
		return s.sectionA[day]
	}
	return s.sectionB[day]
}

func (s *Service) GetWeeklyGrid(section string) map[string][]WeeklyGridCell {
	sec := strings.ToUpper(strings.TrimSpace(section))
	if sec != "A" && sec != "B" {
		sec = "B"
	}
	if sec == "A" {
		return s.gridA
	}
	return s.gridB
}

// GetCurrentClass calculates the live or next upcoming class based on current time
func (s *Service) GetCurrentClass(section string, now time.Time) CurrentClassResponse {
	sec := strings.ToUpper(strings.TrimSpace(section))
	if sec != "A" && sec != "B" {
		sec = "B"
	}

	weekday := int(now.Weekday())
	// In SUST, Academic days are Sunday (0) to Thursday (4)
	if weekday == 5 || weekday == 6 {
		return CurrentClassResponse{
			Section:   sec,
			Status:    "weekend",
			CheckedAt: now.Format(time.RFC3339),
		}
	}

	currentMin := now.Hour()*60 + now.Minute()
	classes := s.GetDayRoutine(sec, weekday)

	var current *RoutinePeriod
	var next *RoutinePeriod

	for i := range classes {
		c := &classes[i]
		if currentMin >= c.StartMin && currentMin < c.EndMin {
			current = c
		} else if currentMin < c.StartMin && next == nil {
			next = c
		}
	}

	status := "in_class"
	if current == nil {
		if currentMin >= 765 && currentMin <= 825 {
			status = "break" // Lunch break: 12:45 PM - 1:45 PM (765 to 825 mins)
		} else if next != nil {
			status = "between_classes"
		} else {
			status = "day_ended"
		}
	}

	return CurrentClassResponse{
		Section:      sec,
		CurrentClass: current,
		NextClass:    next,
		Status:       status,
		CheckedAt:    now.Format(time.RFC3339),
	}
}

// GetRoomAvailability checks which SUST CSE classrooms are occupied or free
func (s *Service) GetRoomAvailability(day int, minuteOfDay int) RoomAvailabilityResponse {
	dayNames := []string{"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"}
	dayName := "Weekend"
	if day >= 0 && day < len(dayNames) {
		dayName = dayNames[day]
	}

	busySet := make(map[string]bool)

	// Combine classes from both Section A and Section B to find occupied rooms
	checkClasses := func(classes []RoutinePeriod) {
		for _, c := range classes {
			if minuteOfDay >= c.StartMin && minuteOfDay < c.EndMin && c.Room != "" {
				busySet[c.Room] = true
			}
		}
	}

	if day >= 0 && day <= 4 {
		checkClasses(s.sectionA[day])
		checkClasses(s.sectionB[day])
	}

	var busyRooms []string
	var freeRooms []string

	for _, room := range AllClassrooms {
		if busySet[room] {
			busyRooms = append(busyRooms, room)
		} else {
			freeRooms = append(freeRooms, room)
		}
	}

	timeSlot := fmt.Sprintf("%02d:%02d", minuteOfDay/60, minuteOfDay%60)

	return RoomAvailabilityResponse{
		DayName:   dayName,
		TimeSlot:  timeSlot,
		FreeRooms: freeRooms,
		BusyRooms: busyRooms,
	}
}

func DayNameToIndex(name string) int {
	switch strings.ToLower(strings.TrimSpace(name)) {
	case "sunday", "sun":
		return 0
	case "monday", "mon":
		return 1
	case "tuesday", "tue":
		return 2
	case "wednesday", "wed":
		return 3
	case "thursday", "thu":
		return 4
	case "friday", "fri":
		return 5
	case "saturday", "sat":
		return 6
	default:
		return int(time.Now().Weekday())
	}
}

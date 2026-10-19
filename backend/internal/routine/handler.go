// Package routine - Authored by Afif Zaman Khan (2023331020)
// HTTP Handler for routine REST endpoints
package routine

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"sust-cse-portal/internal/utils"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// GET /api/v1/routines?section=B&day=0
func (h *Handler) GetDayRoutine(w http.ResponseWriter, r *http.Request) {
	section := r.URL.Query().Get("section")
	if section == "" {
		section = "B"
	}

	dayParam := r.URL.Query().Get("day")
	var day int
	if dayParam == "" {
		day = int(time.Now().Weekday())
	} else {
		parsed, err := strconv.Atoi(dayParam)
		if err != nil {
			day = DayNameToIndex(dayParam)
		} else {
			day = parsed
		}
	}

	dayNames := []string{"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}
	dayName := "Unknown"
	if day >= 0 && day < len(dayNames) {
		dayName = dayNames[day]
	}

	classes := h.service.GetDayRoutine(section, day)

	resp := DayRoutineResponse{
		Section: strings.ToUpper(section),
		Day:     dayName,
		DayNum:  day,
		Classes: classes,
		Total:   len(classes),
	}

	utils.Success(w, http.StatusOK, "Routine retrieved successfully", resp)
}

// GET /api/v1/routines/weekly?section=B
func (h *Handler) GetWeeklyGrid(w http.ResponseWriter, r *http.Request) {
	section := r.URL.Query().Get("section")
	if section == "" {
		section = "B"
	}

	grid := h.service.GetWeeklyGrid(section)

	resp := WeeklyRoutineResponse{
		Section:  strings.ToUpper(section),
		Semester: "2/2 (2nd Year, 2nd Semester)",
		Session:  "2023–2024",
		Schedule: grid,
	}

	utils.Success(w, http.StatusOK, "Weekly routine grid retrieved successfully", resp)
}

// GET /api/v1/routines/current?section=B
func (h *Handler) GetCurrentClass(w http.ResponseWriter, r *http.Request) {
	section := r.URL.Query().Get("section")
	if section == "" {
		section = "B"
	}

	res := h.service.GetCurrentClass(section, time.Now())
	utils.Success(w, http.StatusOK, "Current class status computed", res)
}

// GET /api/v1/routines/rooms?day=0&time=10:45
func (h *Handler) GetRoomAvailability(w http.ResponseWriter, r *http.Request) {
	dayParam := r.URL.Query().Get("day")
	var day int
	if dayParam == "" {
		day = int(time.Now().Weekday())
	} else {
		parsed, err := strconv.Atoi(dayParam)
		if err != nil {
			day = DayNameToIndex(dayParam)
		} else {
			day = parsed
		}
	}

	timeParam := r.URL.Query().Get("time")
	minuteOfDay := time.Now().Hour()*60 + time.Now().Minute()
	if timeParam != "" {
		parts := strings.Split(timeParam, ":")
		if len(parts) == 2 {
			h, _ := strconv.Atoi(parts[0])
			m, _ := strconv.Atoi(parts[1])
			minuteOfDay = h*60 + m
		}
	}

	res := h.service.GetRoomAvailability(day, minuteOfDay)
	utils.Success(w, http.StatusOK, "Room availability calculated", res)
}

// GET /api/v1/routines/check-room?day=0&start=540&end=630&room=Room 303
func (h *Handler) CheckRoomConflict(w http.ResponseWriter, r *http.Request) {
	dayParam := r.URL.Query().Get("day")
	var day int
	if dayParam == "" {
		day = int(time.Now().Weekday())
	} else {
		parsed, err := strconv.Atoi(dayParam)
		if err != nil {
			day = DayNameToIndex(dayParam)
		} else {
			day = parsed
		}
	}

	startMin, _ := strconv.Atoi(r.URL.Query().Get("start"))
	if startMin <= 0 {
		startMin = 540 // Default 9:00 AM
	}

	endMin, _ := strconv.Atoi(r.URL.Query().Get("end"))
	if endMin <= 0 {
		endMin = startMin + 45 // Default 45 mins period
	}

	room := r.URL.Query().Get("room")
	if room == "" {
		room = "Room 303"
	}

	res := h.service.CheckRoomBookingConflict(day, startMin, endMin, room)
	utils.Success(w, http.StatusOK, "Room conflict check completed", res)
}

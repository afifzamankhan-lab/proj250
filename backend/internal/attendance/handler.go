// Package attendance - Authored by Afif Zaman Khan (2023331020)
// HTTP Handler for attendance and safe-bunk REST endpoints
package attendance

import (
	"net/http"

	"sust-cse-portal/internal/utils"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// GET /api/v1/attendance?reg=2023331020
func (h *Handler) GetStudentAttendance(w http.ResponseWriter, r *http.Request) {
	reg := r.URL.Query().Get("reg")
	if reg == "" {
		reg = "2023331020" // Default to Afif Zaman Khan
	}

	profile, _ := h.service.GetAttendanceProfile(reg)
	utils.Success(w, http.StatusOK, "Attendance profile retrieved successfully", profile)
}

// GET /api/v1/attendance/safebunk?reg=2023331020&course=CSE 0541 2257
func (h *Handler) AnalyzeSafeBunk(w http.ResponseWriter, r *http.Request) {
	reg := r.URL.Query().Get("reg")
	if reg == "" {
		reg = "2023331020"
	}

	course := r.URL.Query().Get("course")
	if course == "" {
		course = "CSE 0541 2257"
	}

	analysis, err := h.service.AnalyzeSafeBunks(reg, course)
	if err != nil {
		utils.Error(w, http.StatusNotFound, err.Error(), nil)
		return
	}

	utils.Success(w, http.StatusOK, "Safe bunk analysis computed", analysis)
}

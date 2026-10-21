// Package course - Authored by Afif Zaman Khan (2023331020)
// HTTP Handler for course REST endpoints
package course

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"sust-cse-portal/internal/utils"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// GET /api/v1/courses?semester=4
func (h *Handler) GetCourses(w http.ResponseWriter, r *http.Request) {
	semStr := r.URL.Query().Get("semester")
	sem := 4
	if semStr != "" {
		if parsed, err := strconv.Atoi(semStr); err == nil {
			sem = parsed
		}
	}

	courses := h.service.GetCoursesBySemester(sem)
	utils.Success(w, http.StatusOK, "Courses retrieved successfully", courses)
}

// GET /api/v1/courses/analytics
func (h *Handler) GetAnalytics(w http.ResponseWriter, r *http.Request) {
	analytics := h.service.GetCurriculumAnalytics()
	utils.Success(w, http.StatusOK, "Curriculum analytics computed", analytics)
}

// POST /api/v1/courses/prerequisites/check
func (h *Handler) CheckPrerequisites(w http.ResponseWriter, r *http.Request) {
	var req PrerequisiteCheckRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	res := h.service.CheckPrerequisites(req.TargetCourse, req.PassedCourses)
	utils.Success(w, http.StatusOK, "Prerequisite check completed", res)
}

// GET /api/v1/courses/{code}
func (h *Handler) GetCourseByCode(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/v1/courses/")
	if path == "" || path == "analytics" {
		return
	}

	c, found := h.service.GetCourseByCode(path)
	if !found {
		utils.Error(w, http.StatusNotFound, "Course not found", nil)
		return
	}

	utils.Success(w, http.StatusOK, "Course details retrieved", c)
}

// GET /api/v1/courses/details/{code}
func (h *Handler) GetCourseDetails(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		code = strings.TrimPrefix(r.URL.Path, "/api/v1/courses/details/")
	}
	if code == "" {
		code = "CSE 0541 2258"
	}

	detail, found := h.service.GetCourseDetails(code)
	if !found {
		utils.Error(w, http.StatusNotFound, "Course details not found", nil)
		return
	}

	utils.Success(w, http.StatusOK, "Course syllabus and details retrieved", detail)
}

// GET /api/v1/courses/assignments?code=CSE 0541 2258
func (h *Handler) GetAssignments(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		code = "CSE 0541 2258"
	}

	assignments := h.service.GetAssignmentsByCourse(code)
	utils.Success(w, http.StatusOK, "Assignments retrieved successfully", assignments)
}

// POST /api/v1/courses/assignments/submit
func (h *Handler) SubmitAssignment(w http.ResponseWriter, r *http.Request) {
	var req AssignmentSubmitRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.Error(w, http.StatusBadRequest, "Invalid submission payload", nil)
		return
	}

	resp := map[string]interface{}{
		"assignmentId": req.AssignmentID,
		"studentReg":   req.StudentReg,
		"status":       "submitted",
		"timestamp":    "2026-10-21T10:00:00Z",
		"message":      "Assignment archived and submitted to lab instructor successfully",
	}

	utils.Success(w, http.StatusOK, "Assignment submitted successfully", resp)
}

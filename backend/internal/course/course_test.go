// Package course - Authored by Afif Zaman Khan (2023331020)
package course

import (
	"testing"
)

func TestCurriculumCreditSum(t *testing.T) {
	svc := NewService()
	courses := svc.GetCoursesBySemester(4)

	if len(courses) != 10 {
		t.Fatalf("Expected 10 courses for 2/2 semester, got %d", len(courses))
	}

	analytics := svc.GetCurriculumAnalytics()
	if analytics.TotalCredits != 22.5 {
		t.Errorf("Expected total 22.5 credits, got %.1f", analytics.TotalCredits)
	}

	if analytics.TheoryCredits != 15.0 {
		t.Errorf("Expected 15.0 theory credits, got %.1f", analytics.TheoryCredits)
	}

	if analytics.LabCredits != 7.5 {
		t.Errorf("Expected 7.5 lab credits, got %.1f", analytics.LabCredits)
	}
}

func TestPrerequisites(t *testing.T) {
	svc := NewService()

	// CSE 0541 2258 (DSA Lab) requires CSE 0541 2257 (DSA Theory)
	res1 := svc.CheckPrerequisites("CSE 0541 2258", []string{})
	if res1.Eligible {
		t.Errorf("Expected CSE 0541 2258 to be ineligible without DSA theory")
	}

	res2 := svc.CheckPrerequisites("CSE 0541 2258", []string{"CSE 0541 2257"})
	if !res2.Eligible {
		t.Errorf("Expected CSE 0541 2258 to be eligible after passing CSE 0541 2257")
	}
}

func TestCourseDetailsAndAssignments(t *testing.T) {
	svc := NewService()

	// Sessional Lab course: CSE 0541 2258 (DSA Lab)
	detail, found := svc.GetCourseDetails("CSE 0541 2258")
	if !found {
		t.Fatalf("Expected course details for CSE 0541 2258")
	}

	if len(detail.Syllabus) == 0 {
		t.Errorf("Expected syllabus topics to be generated")
	}

	if len(detail.Assignments) == 0 {
		t.Errorf("Expected lab assignments for sessional course")
	}

	// Verify teacher contact email is set
	if detail.TeacherEmail == "" {
		t.Errorf("Expected non-empty teacher email")
	}
}

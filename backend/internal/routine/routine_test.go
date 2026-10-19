// Package routine - Authored by Afif Zaman Khan (2023331020)
package routine

import (
	"testing"
	"time"
)

func TestRoutineInitialization(t *testing.T) {
	svc := NewService()

	// Section B (Afif 20, Usama 88) on Sunday (0) must have classes
	bSun := svc.GetDayRoutine("B", 0)
	if len(bSun) == 0 {
		t.Fatalf("Expected classes for Section B on Sunday, got 0")
	}

	// Verify Data Structures in Section B on Sunday
	foundDSA := false
	for _, c := range bSun {
		if c.CourseCode == "CSE 0541 2257" {
			foundDSA = true
			if c.Room != "Gallery 2" {
				t.Errorf("Expected DSA to be in Gallery 2, got %s", c.Room)
			}
		}
	}
	if !foundDSA {
		t.Errorf("Expected CSE 0541 2257 in Section B Sunday routine")
	}

	// Weekly grid check
	gridB := svc.GetWeeklyGrid("B")
	if len(gridB["Monday"]) == 0 {
		t.Fatalf("Expected Monday cells for Section B grid")
	}
}

func TestCurrentClassDetector(t *testing.T) {
	svc := NewService()

	// Simulate Sunday 10:45 AM (645 min from midnight)
	// Sunday = time.Date(2026, 10, 18, 10, 45, 0, 0, time.UTC)
	// In Section B Sunday: EEE 0714 2202D is 10:30 AM - 12:45 PM (630 - 765 min)
	fakeSunday := time.Date(2026, 10, 18, 10, 45, 0, 0, time.UTC)
	res := svc.GetCurrentClass("B", fakeSunday)

	if res.Status != "in_class" {
		t.Errorf("Expected status in_class, got %s", res.Status)
	}
	if res.CurrentClass == nil || res.CurrentClass.CourseCode != "EEE 0714 2202D" {
		t.Errorf("Expected EEE 0714 2202D, got %+v", res.CurrentClass)
	}

	// Simulate Friday (weekend)
	fakeFriday := time.Date(2026, 10, 23, 10, 0, 0, 0, time.UTC)
	weekendRes := svc.GetCurrentClass("B", fakeFriday)
	if weekendRes.Status != "weekend" {
		t.Errorf("Expected weekend status, got %s", weekendRes.Status)
	}
}

func TestRoomAvailability(t *testing.T) {
	svc := NewService()

	// Sunday 11:00 AM (660 min)
	// Section B has EEE Lab in Room EEE
	// Section A has DSA Sessional in Room 630
	res := svc.GetRoomAvailability(0, 660)

	busyMap := make(map[string]bool)
	for _, r := range res.BusyRooms {
		busyMap[r] = true
	}

	if !busyMap["Room EEE"] {
		t.Errorf("Expected Room EEE to be busy")
	}
	if !busyMap["Room 630"] {
		t.Errorf("Expected Room 630 to be busy")
	}
}

func TestRoomBookingConflict(t *testing.T) {
	svc := NewService()

	// Sunday 09:00 AM - 10:30 AM (540 - 630 min) in Room 303 is occupied by Section A (OOP Sessional)
	conflict := svc.CheckRoomBookingConflict(0, 540, 630, "Room 303")
	if !conflict.HasConflict {
		t.Errorf("Expected Room 303 to have conflict on Sunday 9:00-10:30 AM")
	}

	// Room 304 on Sunday 9:00-10:30 AM should be free
	freeCheck := svc.CheckRoomBookingConflict(0, 540, 630, "Room 304")
	if freeCheck.HasConflict {
		t.Errorf("Expected Room 304 to be free on Sunday 9:00-10:30 AM")
	}
}

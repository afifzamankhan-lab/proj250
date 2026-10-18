// Package attendance - Authored by Afif Zaman Khan (2023331020)
package attendance

import (
	"testing"
)

func TestSUSTOrdinanceClassification(t *testing.T) {
	if ClassifyStatus(85.0) != StatusCollegiate {
		t.Errorf("Expected >= 75%% to be Collegiate")
	}
	if ClassifyStatus(75.0) != StatusCollegiate {
		t.Errorf("Expected 75%% boundary to be Collegiate")
	}
	if ClassifyStatus(74.9) != StatusNonCollegiate {
		t.Errorf("Expected 74.9%% to be Non-Collegiate")
	}
	if ClassifyStatus(60.0) != StatusNonCollegiate {
		t.Errorf("Expected 60.0%% boundary to be Non-Collegiate")
	}
	if ClassifyStatus(59.9) != StatusDisCollegiate {
		t.Errorf("Expected < 60%% to be Dis-Collegiate")
	}
}

func TestSafeBunkCalculator(t *testing.T) {
	// If attended 20 out of 20 (100%):
	// total + x <= 20 / 0.75 = 26.666 => x <= 6.666 => 6 bunks
	bunks := ComputeSafeBunks(20, 20)
	if bunks != 6 {
		t.Errorf("Expected 6 safe bunks for 20/20, got %d", bunks)
	}

	// Verify that with 6 bunks (20/26):
	// 20 / 26 = 76.9% >= 75%
	pctAfterBunks := (float64(20) / float64(26)) * 100
	if pctAfterBunks < 75.0 {
		t.Errorf("Bunk calculation failed, resulting percentage %.2f < 75%%", pctAfterBunks)
	}

	// If attended 14 out of 20 (70%):
	// Safe bunks should be 0 because already < 75%
	bunksBelow := ComputeSafeBunks(14, 20)
	if bunksBelow != 0 {
		t.Errorf("Expected 0 safe bunks for 14/20, got %d", bunksBelow)
	}

	// Consecutive needed classes for 14/20:
	// y >= (0.75*20 - 14) / 0.25 = (15 - 14) / 0.25 = 4 classes
	needed := ComputeNeededClasses(14, 20)
	if needed != 4 {
		t.Errorf("Expected 4 consecutive classes needed for 14/20, got %d", needed)
	}

	// Verify that with 4 consecutive classes attended (18/24):
	// 18 / 24 = 75.0%
	recoveredPct := (float64(18) / float64(24)) * 100
	if recoveredPct < 75.0 {
		t.Errorf("Recovery calculation failed, resulting percentage %.2f < 75%%", recoveredPct)
	}
}

func TestStudentAttendanceProfiles(t *testing.T) {
	svc := NewService()

	// Afif Zaman Khan (2023331020)
	afifProf, exists := svc.GetAttendanceProfile("2023331020")
	if !exists {
		t.Fatalf("Expected Afif's profile to exist")
	}
	if afifProf.OverallStatus != StatusCollegiate {
		t.Errorf("Expected Afif to be Collegiate, got %s", afifProf.OverallStatus)
	}

	// Usama (2023331088)
	usamaProf, exists := svc.GetAttendanceProfile("2023331088")
	if !exists {
		t.Fatalf("Expected Usama's profile to exist")
	}
	if usamaProf.OverallStatus != StatusCollegiate {
		t.Errorf("Expected Usama to be Collegiate, got %s", usamaProf.OverallStatus)
	}
}

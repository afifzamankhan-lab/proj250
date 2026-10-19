// SUST CSE Portal - API Client (Afif Zaman Khan - Day 2 Integration)
// High-performance, fault-tolerant fetch wrapper for Go backend (Port 8080)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LiveRoutinePeriod {
  time: string;
  endTime: string;
  course: string;
  courseCode: string;
  room: string;
  teacher: string;
  type: "theory" | "lab";
  periods: string;
  startMin: number;
  endMin: number;
}

export interface LiveDayRoutine {
  section: string;
  day: string;
  dayNum: number;
  classes: LiveRoutinePeriod[];
  total: number;
}

export interface LiveCurrentClass {
  section: string;
  currentClass?: LiveRoutinePeriod;
  nextClass?: LiveRoutinePeriod;
  status: "in_class" | "break" | "day_ended" | "weekend" | "between_classes";
  checkedAt: string;
}

export interface LiveAttendanceCourse {
  courseCode: string;
  courseName: string;
  totalClasses: number;
  attended: number;
  percentage: number;
  status: "COLLEGIATE" | "NON_COLLEGIATE" | "DIS_COLLEGIATE";
  safeBunks: number;
  neededToPass: number;
}

export interface LiveAttendanceProfile {
  registrationNumber: string;
  studentName: string;
  section: string;
  semester: number;
  overallPercentage: number;
  overallStatus: "COLLEGIATE" | "NON_COLLEGIATE" | "DIS_COLLEGIATE";
  totalCourses: number;
  collegiateCount: number;
  nonCollegiateCount: number;
  disCollegiateCount: number;
  courses: LiveAttendanceCourse[];
}

export interface LiveRoomConflict {
  hasConflict: boolean;
  room: string;
  dayName: string;
  timeSpan: string;
  message: string;
}

export interface LiveCurriculumAnalytics {
  semester: string;
  session: string;
  totalCourses: number;
  theoryCourses: number;
  labCourses: number;
  totalCredits: number;
  theoryCredits: number;
  labCredits: number;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
    if (!res.ok) return false;
    const json: ApiResponse<any> = await res.json();
    return json.success === true;
  } catch {
    return false;
  }
}

export async function fetchLiveDayRoutine(section: string = "B", day: number = 0): Promise<LiveDayRoutine | null> {
  try {
    const res = await fetch(`${API_BASE}/routines?section=${section}&day=${day}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json: ApiResponse<LiveDayRoutine> = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function fetchLiveCurrentClass(section: string = "B"): Promise<LiveCurrentClass | null> {
  try {
    const res = await fetch(`${API_BASE}/routines/current?section=${section}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json: ApiResponse<LiveCurrentClass> = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function fetchLiveAttendance(reg: string = "2023331020"): Promise<LiveAttendanceProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/attendance?reg=${reg}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json: ApiResponse<LiveAttendanceProfile> = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function fetchRoomConflict(day: number, start: number, end: number, room: string): Promise<LiveRoomConflict | null> {
  try {
    const res = await fetch(`${API_BASE}/routines/check-room?day=${day}&start=${start}&end=${end}&room=${encodeURIComponent(room)}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json: ApiResponse<LiveRoomConflict> = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

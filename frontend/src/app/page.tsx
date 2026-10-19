"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  checkBackendHealth,
  fetchLiveCurrentClass,
  fetchLiveAttendance,
  fetchRoomConflict,
  LiveCurrentClass,
  LiveAttendanceProfile,
  LiveRoomConflict,
} from "@/lib/api";

// ─── TYPES ─────────────────────────────────────────────────────────────────────

type View = "landing" | "login" | "signup" | "semester-select" | "dashboard";
type DashTab = "schedule" | "courses" | "transcript" | "profile";

interface User {
  id: string;
  name: string;
  registration: string;
  role: string;
  email: string;
  semester: number;
  cgpa: number;
  batch: string;
  department: string;
}

interface WeekSlot {
  day: number; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu (BD weekdays)
  startTime: string;
  endTime: string;
  room: string;
}

interface Course {
  code: string;
  name: string;
  credits: number;
  teacher: string;
  type: "theory" | "lab";
  schedule?: WeekSlot[];
}

interface ScheduleEntry {
  time: string;
  endTime: string;
  course: string;
  courseCode: string;
  room: string;
  teacher: string;
  type: "theory" | "lab";
  periods?: string;
}

const BD_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const BD_DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface SemesterInfo {
  number: number;
  term: string;
  session: string;
  status: "completed" | "current";
  gpa: number;
  credits: number;
  courseCount: number;
  courses: { code: string; name: string; credits: number; grade: string; points: number; teacher: string; type: "theory" | "lab" }[];
}

// ─── SEED DATA ─────────────────────────────────────────────────────────────────

const STUDENTS: Record<string, User & { password: string }> = {
  "2023331020": {
    id: "stu-001",
    name: "Afif Zaman Khan",
    registration: "2023331020",
    role: "student",
    email: "afif@student.sust.edu",
    semester: 4,
    cgpa: 3.72,
    batch: "2023–2024",
    department: "Computer Science & Engineering",
    password: "Password@123",
  },
  "2023331088": {
    id: "stu-002",
    name: "Usama",
    registration: "2023331088",
    role: "student",
    email: "usama@student.sust.edu",
    semester: 4,
    cgpa: 3.65,
    batch: "2023–2024",
    department: "Computer Science & Engineering",
    password: "Password@123",
  },
  "2023331019": {
    id: "stu-003",
    name: "Tanvir Ahmed",
    registration: "2023331019",
    role: "student",
    email: "tanvir@student.sust.edu",
    semester: 4,
    cgpa: 3.68,
    batch: "2023–2024",
    department: "Computer Science & Engineering",
    password: "Password@123",
  },
};

// 4th Semester (Current 2nd Year, 2nd Semester) Active 10 Courses with Timetable
// 4th Semester (Current 2nd Year, 2nd Semester - 2/2 Session 2023–24) Official Enrolled Courses
const COURSES_4TH: Course[] = [
  {
    code: "CSE 0541 2257",
    name: "Data Structures and Algorithms",
    credits: 3.0,
    teacher: "MJI (Md. Jahidul Islam)",
    type: "theory",
  },
  {
    code: "CSE 0541 2258",
    name: "Data Structures and Algorithms Sessional",
    credits: 1.5,
    teacher: "MJI (Md. Jahidul Islam)",
    type: "lab",
  },
  {
    code: "CSE 0612 2260",
    name: "Object Oriented Programming Sessional",
    credits: 1.5,
    teacher: "MMH (Prof. Dr. Mohammad Masudur Rahman)",
    type: "lab",
  },
  {
    code: "CSE 0613 2234",
    name: "Database Management Systems Sessional",
    credits: 1.5,
    teacher: "MHM (Md. Habibur Rahman)",
    type: "lab",
  },
  {
    code: "CSE 0613 2247",
    name: "Discrete Mathematics & Computational Structures",
    credits: 3.0,
    teacher: "MSC (Md. Saiful Islam)",
    type: "theory",
  },
  {
    code: "CSE 0688 2292",
    name: "Web Technologies & Software Development Project",
    credits: 1.5,
    teacher: "FIF (Fahim Ishrak)",
    type: "lab",
  },
  {
    code: "EEE 0714 2201D",
    name: "Electrical Technology & Circuit Analysis",
    credits: 3.0,
    teacher: "Dept. of EEE",
    type: "theory",
  },
  {
    code: "EEE 0714 2202D",
    name: "Electrical Technology Sessional",
    credits: 1.5,
    teacher: "Dept. of EEE",
    type: "lab",
  },
  {
    code: "MAT 0541 2204D",
    name: "Numerical Analysis & Complex Variables",
    credits: 3.0,
    teacher: "Dept. of Mathematics (MAT)",
    type: "theory",
  },
  {
    code: "MAT 0541 1011D",
    name: "Differential Equations & Coordinate Geometry",
    credits: 3.0,
    teacher: "Dept. of Mathematics (MAT)",
    type: "theory",
  },
];

const ALL_SEMESTERS: SemesterInfo[] = [
  {
    number: 1,
    term: "1st Year, 1st Semester (1/1)",
    session: "2023",
    status: "completed",
    gpa: 3.75,
    credits: 16.5,
    courseCount: 6,
    courses: [
      { code: "CSE-1101", name: "Introduction to Computing", credits: 3.0, grade: "A", points: 4.0, teacher: "Dr. M. Rezaul Karim", type: "theory" },
      { code: "CSE-1102", name: "Programming Fundamentals", credits: 3.0, grade: "A-", points: 3.7, teacher: "Md. Saiful Islam", type: "theory" },
      { code: "CSE-1103", name: "Programming Fundamentals Lab", credits: 1.5, grade: "A", points: 4.0, teacher: "Md. Saiful Islam", type: "lab" },
      { code: "MATH-1101", name: "Calculus & Differential Equations", credits: 3.0, grade: "B+", points: 3.3, teacher: "Dr. Farzana Ahmed", type: "theory" },
      { code: "PHY-1101", name: "Physics (Electricity & Magnetism)", credits: 3.0, grade: "A-", points: 3.7, teacher: "Dr. Mohammad Ali", type: "theory" },
      { code: "EEE-1101", name: "Basic Electrical Engineering", credits: 3.0, grade: "B+", points: 3.3, teacher: "Dr. Kazi Tanvir", type: "theory" },
    ],
  },
  {
    number: 2,
    term: "1st Year, 2nd Semester (1/2)",
    session: "2023–2024",
    status: "completed",
    gpa: 3.68,
    credits: 18.0,
    courseCount: 7,
    courses: [
      { code: "CSE-1201", name: "Object Oriented Programming (Java)", credits: 3.0, grade: "A", points: 4.0, teacher: "Dr. Forhad Rabbi", type: "theory" },
      { code: "CSE-1202", name: "Object Oriented Programming Lab", credits: 1.5, grade: "A", points: 4.0, teacher: "Dr. Forhad Rabbi", type: "lab" },
      { code: "CSE-1203", name: "Discrete Mathematics", credits: 3.0, grade: "A-", points: 3.7, teacher: "Dr. Sadia Sultana", type: "theory" },
      { code: "MATH-1201", name: "Linear Algebra & Matrices", credits: 3.0, grade: "B+", points: 3.3, teacher: "Dr. Farzana Ahmed", type: "theory" },
      { code: "STAT-1201", name: "Probability & Statistics", credits: 3.0, grade: "A-", points: 3.7, teacher: "Dr. Rashedul Islam", type: "theory" },
      { code: "HUM-1201", name: "English Language & Communication", credits: 2.0, grade: "A", points: 4.0, teacher: "Ms. Nasrin Akter", type: "theory" },
      { code: "CSE-1204", name: "Digital Logic Design", credits: 2.5, grade: "B+", points: 3.3, teacher: "Dr. Enamul Hossain", type: "theory" },
    ],
  },
  {
    number: 3,
    term: "2nd Year, 1st Semester (2/1)",
    session: "2024",
    status: "completed",
    gpa: 3.72,
    credits: 19.5,
    courseCount: 8,
    courses: [
      { code: "CSE-2101", name: "Computer Networks & Protocols", credits: 3.0, grade: "A", points: 4.0, teacher: "Dr. Amitabha Chakrabarty", type: "theory" },
      { code: "CSE-2102", name: "Computer Networks Lab", credits: 1.5, grade: "A-", points: 3.7, teacher: "Dr. Amitabha Chakrabarty", type: "lab" },
      { code: "CSE-2103", name: "Database Systems", credits: 3.0, grade: "A", points: 4.0, teacher: "Dr. Md. Ahsan Ullah", type: "theory" },
      { code: "CSE-2104", name: "Database Systems Lab", credits: 1.5, grade: "A", points: 4.0, teacher: "Dr. Md. Ahsan Ullah", type: "lab" },
      { code: "CSE-2105", name: "Operating Systems Principles", credits: 3.0, grade: "A-", points: 3.7, teacher: "Dr. Enamul Hossain", type: "theory" },
      { code: "MATH-2101", name: "Complex Variables & Transforms", credits: 3.0, grade: "B+", points: 3.3, teacher: "Dr. Farzana Ahmed", type: "theory" },
      { code: "CSE-2106", name: "Software Engineering & Architecture", credits: 3.0, grade: "A-", points: 3.7, teacher: "Dr. Forhad Rabbi", type: "theory" },
      { code: "CSE-2107", name: "Software Engineering Project Lab", credits: 1.5, grade: "A", points: 4.0, teacher: "Dr. Forhad Rabbi", type: "lab" },
    ],
  },
  {
    number: 4,
    term: "2nd Year, 2nd Semester (2/2)",
    session: "2024–2025",
    status: "current",
    gpa: 3.72,
    credits: 20.75,
    courseCount: 10,
    courses: COURSES_4TH.map(c => ({
      code: c.code,
      name: c.name,
      credits: c.credits,
      grade: "Enrolled",
      points: 0,
      teacher: c.teacher,
      type: c.type,
    })),
  },
];

// ─── OFFICIAL 2/2 (SESSION 2023–24) TIMETABLES ────────────────────────────────

export function getSectionByReg(reg: string): "A" | "B" {
  const digits = reg.replace(/\D/g, "");
  if (!digits) return "B";
  const last2 = parseInt(digits.slice(-2), 10);
  if (isNaN(last2)) return "B";
  return last2 % 2 === 0 ? "B" : "A"; // Even = Section B, Odd = Section A
}

export interface RoutinePeriod {
  time: string;
  endTime: string;
  course: string;
  courseCode: string;
  room: string;
  teacher: string;
  type: "theory" | "lab";
  periods: string;
}

export const SECTION_A_ROUTINE: Record<number, RoutinePeriod[]> = {
  // Sunday (0)
  0: [
    { time: "09:00 AM", endTime: "10:30 AM", course: "Object Oriented Programming Sessional", courseCode: "CSE 0612 2260", room: "Room 303", teacher: "MMH", type: "lab", periods: "Periods 1–2 (9:00 - 10:30 AM)" },
    { time: "10:30 AM", endTime: "12:45 PM", course: "Data Structures and Algorithms Sessional", courseCode: "CSE 0541 2258", room: "Room 630", teacher: "MJI", type: "lab", periods: "Periods 3–5 (10:30 AM - 12:45 PM)" },
    { time: "01:45 PM", endTime: "02:30 PM", course: "Data Structures and Algorithms", courseCode: "CSE 0541 2257", room: "Gallery 2", teacher: "MJI", type: "theory", periods: "Period 7 (1:45 - 2:30 PM)" },
    { time: "03:15 PM", endTime: "04:00 PM", course: "Differential Equations & Coordinate Geometry", courseCode: "MAT 0541 1011D", room: "Room 629", teacher: "MAT", type: "theory", periods: "Period 9 (3:15 - 4:00 PM)" },
  ],
  // Monday (1)
  1: [
    { time: "10:30 AM", endTime: "12:45 PM", course: "Electrical Technology Sessional", courseCode: "EEE 0714 2202D", room: "Room EEE", teacher: "EEE", type: "lab", periods: "Periods 3–5 (10:30 AM - 12:45 PM)" },
    { time: "01:45 PM", endTime: "02:30 PM", course: "Electrical Technology & Circuits", courseCode: "EEE 0714 2201D", room: "Room 629", teacher: "EEE", type: "theory", periods: "Period 7 (1:45 - 2:30 PM)" },
    { time: "02:30 PM", endTime: "03:15 PM", course: "Numerical Analysis & Statistics", courseCode: "MAT 0541 2204D", room: "Room 629", teacher: "MAT", type: "theory", periods: "Period 8 (2:30 - 3:15 PM)" },
    { time: "03:15 PM", endTime: "04:00 PM", course: "Discrete Mathematics & Computational Structures", courseCode: "CSE 0613 2247", room: "Gallery 2", teacher: "MSC", type: "theory", periods: "Period 9 (3:15 - 4:00 PM)" },
  ],
  // Tuesday (2)
  2: [
    { time: "11:15 AM", endTime: "12:45 PM", course: "Object Oriented Programming Sessional", courseCode: "CSE 0612 2260", room: "Room 303", teacher: "MMH", type: "lab", periods: "Periods 4–5 (11:15 AM - 12:45 PM)" },
    { time: "01:45 PM", endTime: "02:30 PM", course: "Data Structures and Algorithms", courseCode: "CSE 0541 2257", room: "Gallery 2", teacher: "MJI", type: "theory", periods: "Period 7 (1:45 - 2:30 PM)" },
    { time: "02:30 PM", endTime: "03:15 PM", course: "Numerical Analysis & Statistics", courseCode: "MAT 0541 2204D", room: "Room 629", teacher: "MAT", type: "theory", periods: "Period 8 (2:30 - 3:15 PM)" },
    { time: "03:15 PM", endTime: "04:00 PM", course: "Discrete Mathematics & Computational Structures", courseCode: "CSE 0613 2247", room: "Gallery 2", teacher: "MSC", type: "theory", periods: "Period 9 (3:15 - 4:00 PM)" },
  ],
  // Wednesday (3)
  3: [
    { time: "01:45 PM", endTime: "02:30 PM", course: "Electrical Technology & Circuits", courseCode: "EEE 0714 2201D", room: "Room 629", teacher: "EEE", type: "theory", periods: "Period 7 (1:45 - 2:30 PM)" },
    { time: "02:30 PM", endTime: "03:15 PM", course: "Numerical Analysis & Statistics", courseCode: "MAT 0541 2204D", room: "Room 629", teacher: "MAT", type: "theory", periods: "Period 8 (2:30 - 3:15 PM)" },
    { time: "03:15 PM", endTime: "04:00 PM", course: "Discrete Mathematics & Computational Structures", courseCode: "CSE 0613 2247", room: "Gallery 2", teacher: "MSC", type: "theory", periods: "Period 9 (3:15 - 4:00 PM)" },
  ],
  // Thursday (4)
  4: [
    { time: "09:00 AM", endTime: "11:15 AM", course: "Database Management Systems Sessional", courseCode: "CSE 0613 2234", room: "Room 304", teacher: "MHM", type: "lab", periods: "Periods 1–3 (9:00 - 11:15 AM)" },
    { time: "01:45 PM", endTime: "04:00 PM", course: "Web Technologies & Software Development Project", courseCode: "CSE 0688 2292", room: "Room 630", teacher: "FIF", type: "lab", periods: "Periods 7–9 (1:45 - 4:00 PM)" },
  ],
};

export const SECTION_B_ROUTINE: Record<number, RoutinePeriod[]> = {
  // Sunday (0)
  0: [
    { time: "10:30 AM", endTime: "12:45 PM", course: "Electrical Technology Sessional", courseCode: "EEE 0714 2202D", room: "Room EEE", teacher: "EEE", type: "lab", periods: "Periods 3–5 (10:30 AM - 12:45 PM)" },
    { time: "01:45 PM", endTime: "02:30 PM", course: "Data Structures and Algorithms", courseCode: "CSE 0541 2257", room: "Gallery 2", teacher: "MJI", type: "theory", periods: "Period 7 (1:45 - 2:30 PM)" },
    { time: "03:15 PM", endTime: "04:00 PM", course: "Differential Equations & Coordinate Geometry", courseCode: "MAT 0541 1011D", room: "Room 629", teacher: "MAT", type: "theory", periods: "Period 9 (3:15 - 4:00 PM)" },
  ],
  // Monday (1)
  1: [
    { time: "09:00 AM", endTime: "10:30 AM", course: "Object Oriented Programming Sessional", courseCode: "CSE 0612 2260", room: "Room 303", teacher: "MMH", type: "lab", periods: "Periods 1–2 (9:00 - 10:30 AM)" },
    { time: "10:30 AM", endTime: "12:45 PM", course: "Data Structures and Algorithms Sessional", courseCode: "CSE 0541 2258", room: "Room 630", teacher: "MJI", type: "lab", periods: "Periods 3–5 (10:30 AM - 12:45 PM)" },
    { time: "01:45 PM", endTime: "02:30 PM", course: "Electrical Technology & Circuits", courseCode: "EEE 0714 2201D", room: "Room 629", teacher: "EEE", type: "theory", periods: "Period 7 (1:45 - 2:30 PM)" },
    { time: "02:30 PM", endTime: "03:15 PM", course: "Numerical Analysis & Statistics", courseCode: "MAT 0541 2204D", room: "Room 629", teacher: "MAT", type: "theory", periods: "Period 8 (2:30 - 3:15 PM)" },
    { time: "03:15 PM", endTime: "04:00 PM", course: "Discrete Mathematics & Computational Structures", courseCode: "CSE 0613 2247", room: "Gallery 2", teacher: "MSC", type: "theory", periods: "Period 9 (3:15 - 4:00 PM)" },
  ],
  // Tuesday (2)
  2: [
    { time: "01:45 PM", endTime: "02:30 PM", course: "Data Structures and Algorithms", courseCode: "CSE 0541 2257", room: "Gallery 2", teacher: "MJI", type: "theory", periods: "Period 7 (1:45 - 2:30 PM)" },
    { time: "02:30 PM", endTime: "03:15 PM", course: "Numerical Analysis & Statistics", courseCode: "MAT 0541 2204D", room: "Room 629", teacher: "MAT", type: "theory", periods: "Period 8 (2:30 - 3:15 PM)" },
    { time: "03:15 PM", endTime: "04:00 PM", course: "Discrete Mathematics & Computational Structures", courseCode: "CSE 0613 2247", room: "Gallery 2", teacher: "MSC", type: "theory", periods: "Period 9 (3:15 - 4:00 PM)" },
  ],
  // Wednesday (3)
  3: [
    { time: "01:45 PM", endTime: "02:30 PM", course: "Electrical Technology & Circuits", courseCode: "EEE 0714 2201D", room: "Room 629", teacher: "EEE", type: "theory", periods: "Period 7 (1:45 - 2:30 PM)" },
    { time: "02:30 PM", endTime: "03:15 PM", course: "Numerical Analysis & Statistics", courseCode: "MAT 0541 2204D", room: "Room 629", teacher: "MAT", type: "theory", periods: "Period 8 (2:30 - 3:15 PM)" },
    { time: "03:15 PM", endTime: "04:00 PM", course: "Discrete Mathematics & Computational Structures", courseCode: "CSE 0613 2247", room: "Gallery 2", teacher: "MSC", type: "theory", periods: "Period 9 (3:15 - 4:00 PM)" },
  ],
  // Thursday (4)
  4: [
    { time: "09:00 AM", endTime: "11:15 AM", course: "Web Technologies & Software Development Project", courseCode: "CSE 0688 2292", room: "Room 630", teacher: "FIF", type: "lab", periods: "Periods 1–3 (9:00 - 11:15 AM)" },
    { time: "11:15 AM", endTime: "12:45 PM", course: "Object Oriented Programming Sessional", courseCode: "CSE 0612 2260", room: "Room 303", teacher: "MMH", type: "lab", periods: "Periods 4–5 (11:15 AM - 12:45 PM)" },
    { time: "01:45 PM", endTime: "04:00 PM", course: "Database Management Systems Sessional", courseCode: "CSE 0613 2234", room: "Room 304", teacher: "MHM", type: "lab", periods: "Periods 7–9 (1:45 - 4:00 PM)" },
  ],
};

// Full Weekly Timetable Grid Matrix for Section A and Section B
export interface GridCell {
  title: string;
  room?: string;
  teacher?: string;
  type: "lab" | "theory" | "break" | "empty";
  colSpan: number;
}

export const WEEKLY_GRID_A: Record<string, GridCell[]> = {
  "Sunday": [
    { title: "CSE 0612 2260", room: "Room 303", teacher: "MMH", type: "lab", colSpan: 2 },
    { title: "CSE 0541 2258", room: "Room 630", teacher: "MJI", type: "lab", colSpan: 3 },
    { title: "Lunch Break", type: "break", colSpan: 1 },
    { title: "CSE 0541 2257", room: "Gallery 2", teacher: "MJI", type: "theory", colSpan: 1 },
    { title: "—", type: "empty", colSpan: 1 },
    { title: "MAT 0541 1011D", room: "Room 629", teacher: "MAT", type: "theory", colSpan: 1 },
  ],
  "Monday": [
    { title: "—", type: "empty", colSpan: 2 },
    { title: "EEE 0714 2202D", room: "Room EEE", teacher: "EEE", type: "lab", colSpan: 3 },
    { title: "Lunch Break", type: "break", colSpan: 1 },
    { title: "EEE 0714 2201D", room: "Room 629", teacher: "EEE", type: "theory", colSpan: 1 },
    { title: "MAT 0541 2204D", room: "Room 629", teacher: "MAT", type: "theory", colSpan: 1 },
    { title: "CSE 0613 2247", room: "Gallery 2", teacher: "MSC", type: "theory", colSpan: 1 },
  ],
  "Tuesday": [
    { title: "—", type: "empty", colSpan: 3 },
    { title: "CSE 0612 2260", room: "Room 303", teacher: "MMH", type: "lab", colSpan: 2 },
    { title: "Lunch Break", type: "break", colSpan: 1 },
    { title: "CSE 0541 2257", room: "Gallery 2", teacher: "MJI", type: "theory", colSpan: 1 },
    { title: "MAT 0541 2204D", room: "Room 629", teacher: "MAT", type: "theory", colSpan: 1 },
    { title: "CSE 0613 2247", room: "Gallery 2", teacher: "MSC", type: "theory", colSpan: 1 },
  ],
  "Wednesday": [
    { title: "—", type: "empty", colSpan: 5 },
    { title: "Lunch Break", type: "break", colSpan: 1 },
    { title: "EEE 0714 2201D", room: "Room 629", teacher: "EEE", type: "theory", colSpan: 1 },
    { title: "MAT 0541 2204D", room: "Room 629", teacher: "MAT", type: "theory", colSpan: 1 },
    { title: "CSE 0613 2247", room: "Gallery 2", teacher: "MSC", type: "theory", colSpan: 1 },
  ],
  "Thursday": [
    { title: "CSE 0613 2234", room: "Room 304", teacher: "MHM", type: "lab", colSpan: 3 },
    { title: "—", type: "empty", colSpan: 2 },
    { title: "Lunch Break", type: "break", colSpan: 1 },
    { title: "CSE 0688 2292", room: "Room 630", teacher: "FIF", type: "lab", colSpan: 3 },
  ],
};

export const WEEKLY_GRID_B: Record<string, GridCell[]> = {
  "Sunday": [
    { title: "—", type: "empty", colSpan: 2 },
    { title: "EEE 0714 2202D", room: "Room EEE", teacher: "EEE", type: "lab", colSpan: 3 },
    { title: "Lunch Break", type: "break", colSpan: 1 },
    { title: "CSE 0541 2257", room: "Gallery 2", teacher: "MJI", type: "theory", colSpan: 1 },
    { title: "—", type: "empty", colSpan: 1 },
    { title: "MAT 0541 1011D", room: "Room 629", teacher: "MAT", type: "theory", colSpan: 1 },
  ],
  "Monday": [
    { title: "CSE 0612 2260", room: "Room 303", teacher: "MMH", type: "lab", colSpan: 2 },
    { title: "CSE 0541 2258", room: "Room 630", teacher: "MJI", type: "lab", colSpan: 3 },
    { title: "Lunch Break", type: "break", colSpan: 1 },
    { title: "EEE 0714 2201D", room: "Room 629", teacher: "EEE", type: "theory", colSpan: 1 },
    { title: "MAT 0541 2204D", room: "Room 629", teacher: "MAT", type: "theory", colSpan: 1 },
    { title: "CSE 0613 2247", room: "Gallery 2", teacher: "MSC", type: "theory", colSpan: 1 },
  ],
  "Tuesday": [
    { title: "—", type: "empty", colSpan: 5 },
    { title: "Lunch Break", type: "break", colSpan: 1 },
    { title: "CSE 0541 2257", room: "Gallery 2", teacher: "MJI", type: "theory", colSpan: 1 },
    { title: "MAT 0541 2204D", room: "Room 629", teacher: "MAT", type: "theory", colSpan: 1 },
    { title: "CSE 0613 2247", room: "Gallery 2", teacher: "MSC", type: "theory", colSpan: 1 },
  ],
  "Wednesday": [
    { title: "—", type: "empty", colSpan: 5 },
    { title: "Lunch Break", type: "break", colSpan: 1 },
    { title: "EEE 0714 2201D", room: "Room 629", teacher: "EEE", type: "theory", colSpan: 1 },
    { title: "MAT 0541 2204D", room: "Room 629", teacher: "MAT", type: "theory", colSpan: 1 },
    { title: "CSE 0613 2247", room: "Gallery 2", teacher: "MSC", type: "theory", colSpan: 1 },
  ],
  "Thursday": [
    { title: "CSE 0688 2292", room: "Room 630", teacher: "FIF", type: "lab", colSpan: 3 },
    { title: "CSE 0612 2260", room: "Room 303", teacher: "MMH", type: "lab", colSpan: 2 },
    { title: "Lunch Break", type: "break", colSpan: 1 },
    { title: "CSE 0613 2234", room: "Room 304", teacher: "MHM", type: "lab", colSpan: 3 },
  ],
};

function getScheduleForDate(date: Date, section: "A" | "B" = "B"): ScheduleEntry[] {
  const day = date.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  if (day === 5 || day === 6) return []; // BD weekend

  const routine = section === "B" ? SECTION_B_ROUTINE[day] : SECTION_A_ROUTINE[day];
  if (!routine) return [];

  return routine.map(p => ({
    time: p.time,
    endTime: p.endTime,
    course: p.course,
    courseCode: p.courseCode,
    room: p.room,
    teacher: p.teacher,
    type: p.type,
    periods: p.periods,
  }));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function gradeColor(g: string): string {
  if (g.startsWith("A")) return "#15803d"; // Emerald
  if (g.startsWith("B")) return "#1a5fb4"; // Blue
  if (g.startsWith("C")) return "#b45309"; // Amber
  return "#475569";
}

// ─── SVG ICONS ─────────────────────────────────────────────────────────────────

const IconGrad = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconBook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const IconChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconClock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconPin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const IconRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ─── 1. LANDING PAGE ──────────────────────────────────────────────────────────

function LandingPage({
  onLogin,
  onSignup,
}: {
  onLogin: () => void;
  onSignup: () => void;
  onQuickLogin?: (reg: string) => void;
}) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        backgroundImage: 'linear-gradient(180deg, rgba(11, 19, 41, 0.0) 0%, rgba(11, 19, 41, 0.0) 30%, rgba(11, 19, 41, 0.35) 60%, rgba(11, 19, 41, 0.85) 85%, #0b1329 100%), url("/batch_photo.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        color: "#ffffff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Bottom Floating Portal Card & Student Credits - No top bar */}
      <main
        style={{
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 20px 28px",
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: 620,
            width: "100%",
            textAlign: "center",
            background: "rgba(11, 19, 41, 0.80)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1.5px solid rgba(255, 255, 255, 0.22)",
            borderRadius: 22,
            padding: "26px 32px 24px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.75)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(37, 99, 235, 0.3)",
              border: "1px solid rgba(147, 197, 253, 0.45)",
              borderRadius: 999,
              padding: "5px 16px",
              fontSize: 12,
              fontWeight: 800,
              color: "#93c5fd",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 10,
            }}
          >
            <span>🎓 Student Academic Portal</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(22px, 3.4vw, 30px)",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              marginBottom: 8,
              lineHeight: 1.25,
            }}
          >
            Welcome to SUST CSE Student Portal
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "#cbd5e1",
              lineHeight: 1.5,
              maxWidth: 520,
              margin: "0 auto 20px",
              fontWeight: 500,
            }}
          >
            Department of Computer Science &amp; Engineering · Shahjalal University of Science &amp; Technology
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              id="hero-login-btn"
              onClick={onLogin}
              style={{
                background: "#2563eb",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.35)",
                borderRadius: 10,
                padding: "12px 34px",
                fontSize: 15,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(37, 99, 235, 0.5)",
                transition: "all 0.15s ease",
              }}
            >
              Sign In to Portal →
            </button>
            <button
              id="hero-signup-btn"
              onClick={onSignup}
              style={{
                background: "rgba(255, 255, 255, 0.14)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "#ffffff",
                border: "1.5px solid rgba(255, 255, 255, 0.38)",
                borderRadius: 10,
                padding: "12px 26px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Student Registration
            </button>
          </div>
        </div>

        {/* Clear & Sleek Student Credit */}
        <div
          style={{
            marginTop: 14,
            textAlign: "center",
            background: "rgba(11, 19, 41, 0.65)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: 999,
            padding: "7px 22px",
          }}
        >
          <span style={{ fontSize: 12, color: "#cbd5e1", fontWeight: 600 }}>
            Academic Project Developed by{" "}
            <span style={{ color: "#60a5fa", fontWeight: 800 }}>Afif Zaman Khan (2023331020)</span>
            {" "}&amp;{" "}
            <span style={{ color: "#4ade80", fontWeight: 800 }}>Usama (2023331088)</span>
          </span>
        </div>
      </main>
    </div>
  );
}

function AuthPage({
  mode,
  onSwitch,
  onSuccess,
  onBack,
  presetReg,
}: {
  mode: "login" | "signup";
  onSwitch: () => void;
  onSuccess: (u: User) => void;
  onBack: () => void;
  presetReg?: string;
}) {
  const [form, setForm] = useState({
    registration: presetReg || "2023331020",
    name: "",
    email: "",
    password: "Password@123",
    confirm: "Password@123",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 400));

    if (mode === "login") {
      const stu = STUDENTS[form.registration];
      if (!stu) {
        setError("Registration number not found. (Use 2023331020 or 2023331088)");
        setLoading(false);
        return;
      }
      if (stu.password !== form.password) {
        setError("Incorrect password. Hint: Password@123");
        setLoading(false);
        return;
      }
      const { password: _pw, ...user } = stu;
      onSuccess(user);
    } else {
      if (!form.name || !form.registration || !form.email || !form.password) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }
      if (form.password !== form.confirm) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      const stu = STUDENTS[form.registration];
      if (!stu) {
        setError("Registration number not in batch roster. Use 2023331020 or 2023331088.");
        setLoading(false);
        return;
      }
      const { password: _pw, ...user } = stu;
      onSuccess(user);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 24px" }}>
        <button id="auth-back-btn" onClick={onBack} className="btn btn-ghost" style={{ fontSize: 14, gap: 6, fontWeight: 700 }}>
          <IconLeft /> Back to Home
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{
          background: "#ffffff", border: "2px solid #cbd5e1", borderRadius: 20,
          padding: "36px 36px", width: "100%", maxWidth: 440,
          boxShadow: "0 10px 30px rgba(15,23,42,0.1)"
        }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: "#1a5fb4",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff",
              margin: "0 auto 14px", boxShadow: "0 4px 12px rgba(26,95,180,0.3)"
            }}>
              <IconGrad />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 24, color: "#0f172a", marginBottom: 6 }}>
              {mode === "login" ? "Student Sign In" : "Student Registration"}
            </h2>
            <p style={{ color: "#475569", fontSize: 14, fontWeight: 500 }}>
              SUST CSE Batch 2023–2024 Academic Portal
            </p>
          </div>

          {error && (
            <div style={{
              background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 8,
              padding: "10px 14px", marginBottom: 18, fontSize: 13, color: "#b91c1c", fontWeight: 600
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "signup" && (
              <div>
                <label className="input-label">Full Name</label>
                <input id="f-name" className="input-field" placeholder="e.g. Afif Zaman Khan" value={form.name} onChange={set("name")} />
              </div>
            )}

            <div>
              <label className="input-label">Registration Number</label>
              <input id="f-reg" className="input-field" placeholder="e.g. 2023331020" value={form.registration} onChange={set("registration")} />
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>Quick select:</span>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, registration: "2023331020" }))}
                  style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 700, cursor: "pointer", color: "#1a5fb4" }}
                >
                  Afif (2023331020)
                </button>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, registration: "2023331088" }))}
                  style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 700, cursor: "pointer", color: "#15803d" }}
                >
                  Usama (2023331088)
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="input-label">Student Email</label>
                <input id="f-email" className="input-field" type="email" placeholder="e.g. afif@student.sust.edu" value={form.email} onChange={set("email")} />
              </div>
            )}

            <div>
              <label className="input-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="f-pass"
                  className="input-field"
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={set("password")}
                  style={{ paddingRight: 56 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#475569",
                    fontSize: 12, fontWeight: 700
                  }}
                >
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              </div>
              <span style={{ fontSize: 12, color: "#64748b", marginTop: 4, display: "block" }}>Default demo password: <strong>Password@123</strong></span>
            </div>

            {mode === "signup" && (
              <div>
                <label className="input-label">Confirm Password</label>
                <input id="f-confirm" className="input-field" type="password" placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} />
              </div>
            )}

            <button id="auth-submit-btn" type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: 8 }}>
              {loading ? "Verifying Credentials..." : mode === "login" ? "Sign In →" : "Create Student Account →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ fontSize: 14, color: "#475569" }}>
              {mode === "login" ? "Don't have an account yet?" : "Already registered?"}
            </span>{" "}
            <button
              id="auth-switch-btn"
              onClick={onSwitch}
              style={{
                background: "none", border: "none", color: "#1a5fb4",
                fontWeight: 700, fontSize: 14, cursor: "pointer", textDecoration: "underline"
              }}
            >
              {mode === "login" ? "Register here" : "Sign in here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 3. SEMESTER SELECTION PAGE (AFTER LOGIN) ──────────────────────────────────

function SemesterSelectPage({
  user,
  onSelectSemester,
  onLogout,
}: {
  user: User;
  onSelectSemester: (semNumber: number) => void;
  onLogout: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(12px)", borderBottom: "1.5px solid #cbd5e1",
        padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1a5fb4", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
            <IconGrad />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>SUST CSE Academic Portal</div>
            <div style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>Batch 2023–2024 · Sylhet</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{user.name}</div>
            <div style={{ fontSize: 12, color: "#475569" }}>Reg: {user.registration}</div>
          </div>
          <button id="sem-logout-btn" onClick={onLogout} className="btn btn-ghost" style={{ padding: "8px 12px", gap: 6, fontSize: 13, fontWeight: 700 }}>
            <IconLogout /> Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: 1060, margin: "0 auto", width: "100%", padding: "36px 20px" }}>
        
        {/* Welcome Banner */}
        <div style={{
          background: "#ffffff", border: "2px solid #cbd5e1", borderRadius: 16,
          padding: "24px 28px", marginBottom: 32, boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#eff6ff", color: "#1a5fb4", padding: "4px 12px", borderRadius: 999,
              fontSize: 12, fontWeight: 800, marginBottom: 8
            }}>
              <span>👤 STUDENT VERIFIED</span>
              <span>·</span>
              <span>CSE BATCH 2023</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 6 }}>
              Welcome back, {user.name}!
            </h1>
            <p style={{ fontSize: 15, color: "#334155", fontWeight: 500, maxWidth: 680 }}>
              Select a semester below to view its specific courses, timetable, and academic records.
              Select <strong>4th Semester</strong> for the live class routine and current schedules.
            </p>
          </div>
          <div style={{
            background: "#f1f5f9", borderRadius: 12, padding: "12px 20px",
            textAlign: "center", border: "1.5px solid #cbd5e1"
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Cumulative CGPA</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#1a5fb4" }}>{user.cgpa}</div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Up to 3rd Sem</div>
          </div>
        </div>

        {/* Section Heading */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
            Select Semester to View Data
          </h2>
          <p style={{ fontSize: 14, color: "#475569" }}>
            Click on any semester card to explore its courses and academic details.
          </p>
        </div>

        {/* 4 Semesters Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {ALL_SEMESTERS.map(sem => {
            const isCurrent = sem.status === "current";
            return (
              <div
                key={sem.number}
                id={`semester-card-${sem.number}`}
                onClick={() => onSelectSemester(sem.number)}
                className={`semester-card ${isCurrent ? "active-sem" : ""}`}
                style={{
                  borderWidth: isCurrent ? 2.5 : 2,
                  borderColor: isCurrent ? "#1a5fb4" : "#cbd5e1",
                  background: isCurrent ? "#f0f7ff" : "#ffffff",
                }}
              >
                <div>
                  {/* Status Badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#64748b" }}>
                      SESSION {sem.session}
                    </span>
                    {isCurrent ? (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        background: "#dcfce7", color: "#15803d", border: "1.5px solid #86efac",
                        padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#15803d" }} />
                        CURRENT ACTIVE
                      </span>
                    ) : (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        background: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1",
                        padding: "3px 9px", borderRadius: 999, fontSize: 11, fontWeight: 700
                      }}>
                        <IconCheck /> COMPLETED
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", marginBottom: 4 }}>
                    {sem.number === 1 && "1st Semester"}
                    {sem.number === 2 && "2nd Semester"}
                    {sem.number === 3 && "3rd Semester"}
                    {sem.number === 4 && "4th Semester"}
                  </h3>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a5fb4", marginBottom: 14 }}>
                    {sem.term}
                  </div>

                  {/* Details */}
                  <div style={{
                    background: isCurrent ? "#ffffff" : "#f8fafc",
                    border: "1px solid #cbd5e1", borderRadius: 10, padding: "10px 14px", marginBottom: 16
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: "#475569", fontWeight: 600 }}>Total Courses:</span>
                      <strong style={{ color: "#0f172a" }}>{sem.courseCount} Courses</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: "#475569", fontWeight: 600 }}>Total Credits:</span>
                      <strong style={{ color: "#0f172a" }}>{sem.credits} Cr</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "#475569", fontWeight: 600 }}>{isCurrent ? "Status:" : "Term GPA:"}</span>
                      <strong style={{ color: isCurrent ? "#15803d" : "#1a5fb4" }}>
                        {isCurrent ? "In Progress" : sem.gpa.toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div style={{ fontSize: 12, color: "#334155", fontWeight: 500, lineHeight: 1.5, marginBottom: 18 }}>
                    {isCurrent ? (
                      <span style={{ color: "#15803d", fontWeight: 700 }}>
                        ⭐ Includes live class timetable, active courses &amp; routines!
                      </span>
                    ) : (
                      <span>
                        Key: {sem.courses.slice(0, 3).map(c => c.code).join(", ")}, etc.
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Button */}
                <button
                  className={`btn ${isCurrent ? "btn-primary" : "btn-secondary"}`}
                  style={{ width: "100%", padding: "11px 16px", fontSize: 14, fontWeight: 800 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSemester(sem.number);
                  }}
                >
                  {isCurrent ? "Open 4th Semester (Live) →" : `View ${sem.number}${sem.number === 1 ? "st" : sem.number === 2 ? "nd" : "rd"} Semester →`}
                </button>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}

// ─── 4. DASHBOARD (VIEWING SPECIFIC SEMESTER) ──────────────────────────────────

function Dashboard({
  user,
  selectedSemester,
  onChangeSemester,
  onLogout,
}: {
  user: User;
  selectedSemester: number;
  onChangeSemester: () => void;
  onLogout: () => void;
}) {
  const is4thSem = selectedSemester === 4;
  const [tab, setTab] = useState<DashTab>(is4thSem ? "schedule" : "courses");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calOffset, setCalOffset] = useState(0);

  // Student Section Auto-Detection:
  // Even registration last digits -> Section B
  // Odd registration last digits -> Section A
  const autoSection = getSectionByReg(user.registration);
  const [section, setSection] = useState<"A" | "B">(autoSection);

  // Day 2: Live Go Backend API States
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const [liveCurrent, setLiveCurrent] = useState<LiveCurrentClass | null>(null);
  const [liveAttendance, setLiveAttendance] = useState<LiveAttendanceProfile | null>(null);
  const [checkRoomName, setCheckRoomName] = useState<string>("Room 303");
  const [roomResult, setRoomResult] = useState<LiveRoomConflict | null>(null);
  const [isCheckingRoom, setIsCheckingRoom] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadLiveData() {
      const isHealthy = await checkBackendHealth();
      if (isMounted) setBackendConnected(isHealthy);
      if (isHealthy) {
        const cur = await fetchLiveCurrentClass(section);
        if (isMounted && cur) setLiveCurrent(cur);
        const att = await fetchLiveAttendance(user.registration);
        if (isMounted && att) setLiveAttendance(att);
      }
    }
    loadLiveData();
    const interval = setInterval(loadLiveData, 20000); // 20s auto refresh
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [section, user.registration]);

  const handleCheckRoom = async () => {
    setIsCheckingRoom(true);
    const day = selectedDate.getDay() >= 0 && selectedDate.getDay() <= 4 ? selectedDate.getDay() : 0;
    const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
    const res = await fetchRoomConflict(day, nowMin, nowMin + 45, checkRoomName);
    setRoomResult(res);
    setIsCheckingRoom(false);
  };
  const [scheduleMode, setScheduleMode] = useState<"daily" | "weekly">("daily");

  const today = new Date();
  const calBase = new Date(today.getFullYear(), today.getMonth() + calOffset, 1);
  const schedule = getScheduleForDate(selectedDate, section);
  const isWeekend = selectedDate.getDay() === 5 || selectedDate.getDay() === 6;

  const currentSemInfo = ALL_SEMESTERS.find(s => s.number === selectedSemester) || ALL_SEMESTERS[3];

  const firstDay = calBase.getDay();
  const daysInMonth = new Date(calBase.getFullYear(), calBase.getMonth() + 1, 0).getDate();
  const calCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (calCells.length % 7 !== 0) calCells.push(null);

  const isToday = (d: number | null) => {
    if (!d) return false;
    return new Date(calBase.getFullYear(), calBase.getMonth(), d).toDateString() === today.toDateString();
  };
  const isSelected = (d: number | null) => {
    if (!d) return false;
    return new Date(calBase.getFullYear(), calBase.getMonth(), d).toDateString() === selectedDate.toDateString();
  };
  const hasClass = (d: number | null) => {
    if (!d) return false;
    return getScheduleForDate(new Date(calBase.getFullYear(), calBase.getMonth(), d), section).length > 0;
  };
  const selectDay = (d: number | null) => {
    if (!d) return;
    setSelectedDate(new Date(calBase.getFullYear(), calBase.getMonth(), d));
  };

  const navItems: { id: DashTab; label: string; icon: React.ReactNode }[] = [
    ...(is4thSem ? [{ id: "schedule" as DashTab, label: "Daily Schedule", icon: <IconCalendar /> }] : []),
    { id: "courses", label: is4thSem ? "2/2 Courses (10)" : `Sem ${selectedSemester} Courses`, icon: <IconBook /> },
    { id: "transcript", label: "Academic Records", icon: <IconChart /> },
    { id: "profile", label: "Student Profile", icon: <IconUser /> },
  ];

  const activeWeeklyGrid = section === "B" ? WEEKLY_GRID_B : WEEKLY_GRID_A;
  const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const currentDayName = BD_DAY_NAMES[today.getDay()];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Top Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(12px)", borderBottom: "1.5px solid #cbd5e1", padding: "0 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
        boxShadow: "0 1px 3px rgba(15,23,42,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: "#1a5fb4",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff",
            boxShadow: "0 2px 8px rgba(26,95,180,0.35)"
          }}>
            <IconGrad />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", letterSpacing: "-0.01em" }}>
              SUST CSE Student Portal
            </div>
            <div style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>
              Batch 2023–2024 · 2/2 Semester (Spring 2024)
            </div>
          </div>
        </div>

        {/* Center: Semester & Section Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Day 2: Live Go Backend Status Pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px",
            borderRadius: 999, fontSize: 12, fontWeight: 700,
            background: backendConnected ? "#f0fdf4" : "#fefce8",
            border: `1px solid ${backendConnected ? "#86efac" : "#fde047"}`,
            color: backendConnected ? "#166534" : "#854d0e"
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: backendConnected ? "#16a34a" : "#ca8a04",
              display: "inline-block",
              boxShadow: backendConnected ? "0 0 8px #16a34a" : "none"
            }} />
            <span>{backendConnected ? "Live Go API (:8080)" : "Offline Mode"}</span>
          </div>
          <span style={{
            background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1a5fb4",
            padding: "5px 12px", borderRadius: 999, fontSize: 13, fontWeight: 800
          }}>
            {currentSemInfo.term}
          </span>
          <span style={{
            background: section === "B" ? "#f0fdf4" : "#fefce8",
            border: `1px solid ${section === "B" ? "#86efac" : "#fde047"}`,
            color: section === "B" ? "#166534" : "#854d0e",
            padding: "5px 12px", borderRadius: 999, fontSize: 13, fontWeight: 800
          }}>
            Section {section} ({section === "B" ? "Even Roll" : "Odd Roll"})
          </span>
          <button
            onClick={onChangeSemester}
            style={{
              background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 8,
              padding: "5px 12px", fontSize: 13, fontWeight: 700, color: "#1e293b",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 4
            }}
          >
            Switch Semester ▾
          </button>
        </div>

        {/* Right User Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>{user.name}</div>
            <div style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>Roll: {user.registration}</div>
          </div>
          <button
            id="dash-logout-btn"
            onClick={onLogout}
            style={{
              background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b",
              borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar Nav */}
        <aside style={{
          width: 240, background: "#ffffff", borderRight: "1.5px solid #cbd5e1",
          padding: "20px 14px", display: "flex", flexDirection: "column", gap: 6
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", padding: "0 10px 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Menu
          </div>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700,
                textAlign: "left", width: "100%", transition: "all 0.15s ease",
                background: tab === item.id ? "#1a5fb4" : "transparent",
                color: tab === item.id ? "#ffffff" : "#334155",
                boxShadow: tab === item.id ? "0 2px 8px rgba(26,95,180,0.3)" : "none"
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          {/* Section Information Box in Sidebar */}
          <div style={{
            marginTop: "auto", background: "#f8fafc", border: "1.5px solid #e2e8f0",
            borderRadius: 12, padding: "12px 14px"
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
              Section Assignment
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#0f172a", marginBottom: 2 }}>
              Section {section} ({section === "B" ? "Even Roll" : "Odd Roll"})
            </div>
            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>
              Roll #{user.registration} ends in {parseInt(user.registration.slice(-2)) % 2 === 0 ? "even" : "odd"} digit &rarr; assigned Section {autoSection}.
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main style={{ flex: 1, padding: "24px 32px", overflowY: "auto" }}>
          {/* TAB 1: SCHEDULE (DAILY + WEEKLY) */}
          {tab === "schedule" && is4thSem && (
            <div>
              {/* Day 2: Real-Time Live Class Monitor Banner (Go Backend) */}
              {liveCurrent && (
                <div style={{
                  background: liveCurrent.status === "in_class" 
                    ? "linear-gradient(135deg, #064e3b, #047857)" 
                    : liveCurrent.status === "between_classes"
                    ? "linear-gradient(135deg, #1e3a8a, #2563eb)"
                    : "linear-gradient(135deg, #0f172a, #1e293b)",
                  color: "#ffffff", borderRadius: 14, padding: "14px 20px", marginBottom: 16,
                  display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
                  boxShadow: "0 4px 12px rgba(15,23,42,0.12)", border: "1px solid rgba(255,255,255,0.1)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: liveCurrent.status === "in_class" ? "#4ade80" : "#fde047",
                      boxShadow: liveCurrent.status === "in_class" ? "0 0 10px #4ade80" : "none"
                    }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#93c5fd" }}>
                        ⚡ Real-Time Schedule Tracker (Section {liveCurrent.section})
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, marginTop: 1 }}>
                        {liveCurrent.status === "in_class" && liveCurrent.currentClass ? (
                          `Now in session: ${liveCurrent.currentClass.courseCode} — ${liveCurrent.currentClass.course}`
                        ) : liveCurrent.status === "between_classes" && liveCurrent.nextClass ? (
                          `Next upcoming: ${liveCurrent.nextClass.courseCode} (${liveCurrent.nextClass.time}) in ${liveCurrent.nextClass.room}`
                        ) : liveCurrent.status === "break" ? (
                          "☕ Lunch & Prayer Recess (12:45 PM – 01:45 PM)"
                        ) : liveCurrent.status === "weekend" ? (
                          "🎉 Weekend (Friday/Saturday) — Department Closed"
                        ) : (
                          "Classes concluded for today"
                        )}
                      </div>
                    </div>
                  </div>
                  {liveCurrent.currentClass && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ background: "rgba(255,255,255,0.18)", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                        📍 {liveCurrent.currentClass.room}
                      </span>
                      <span style={{ background: "rgba(255,255,255,0.18)", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                        👨‍🏫 {liveCurrent.currentClass.teacher}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {/* Section Selector & View Switcher Bar */}
              <div style={{
                background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 14,
                padding: "16px 20px", marginBottom: 18, boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14
              }}>
                {/* Section Toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#334155" }}>
                    Routine Section:
                  </span>
                  <div style={{ display: "inline-flex", background: "#f1f5f9", padding: 3, borderRadius: 10, border: "1px solid #cbd5e1" }}>
                    <button
                      id="sec-b-btn"
                      onClick={() => setSection("B")}
                      style={{
                        padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 800,
                        border: "none", cursor: "pointer", transition: "all 0.15s ease",
                        background: section === "B" ? "#1a5fb4" : "transparent",
                        color: section === "B" ? "#ffffff" : "#475569",
                        boxShadow: section === "B" ? "0 2px 6px rgba(26,95,180,0.3)" : "none"
                      }}
                    >
                      Section B (Even Roll {autoSection === "B" ? "★ Yours" : ""})
                    </button>
                    <button
                      id="sec-a-btn"
                      onClick={() => setSection("A")}
                      style={{
                        padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 800,
                        border: "none", cursor: "pointer", transition: "all 0.15s ease",
                        background: section === "A" ? "#1a5fb4" : "transparent",
                        color: section === "A" ? "#ffffff" : "#475569",
                        boxShadow: section === "A" ? "0 2px 6px rgba(26,95,180,0.3)" : "none"
                      }}
                    >
                      Section A (Odd Roll {autoSection === "A" ? "★ Yours" : ""})
                    </button>
                  </div>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                    {section === "B" ? "Showing routine for Even Roll Numbers (e.g. Afif 20, Usama 88)" : "Showing routine for Odd Roll Numbers (e.g. 01, 03, 19)"}
                  </span>
                </div>

                {/* Mode Switcher: Daily Timeline vs Full Weekly Routine */}
                <div style={{ display: "inline-flex", background: "#f1f5f9", padding: 3, borderRadius: 10, border: "1px solid #cbd5e1" }}>
                  <button
                    onClick={() => setScheduleMode("daily")}
                    style={{
                      padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 800,
                      border: "none", cursor: "pointer", transition: "all 0.15s ease",
                      background: scheduleMode === "daily" ? "#1e293b" : "transparent",
                      color: scheduleMode === "daily" ? "#ffffff" : "#475569",
                    }}
                  >
                    📅 Daily Timeline
                  </button>
                  <button
                    onClick={() => setScheduleMode("weekly")}
                    style={{
                      padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 800,
                      border: "none", cursor: "pointer", transition: "all 0.15s ease",
                      background: scheduleMode === "weekly" ? "#1e293b" : "transparent",
                      color: scheduleMode === "weekly" ? "#ffffff" : "#475569",
                    }}
                  >
                    📊 Official Weekly Routine Grid
                  </button>
                </div>
              </div>

              {/* MODE 1: DAILY TIMELINE */}
              {scheduleMode === "daily" ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: 18 }}>
                  {/* Daily Class Slots */}
                  <div>
                    {/* Header card */}
                    <div style={{
                      background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 14,
                      padding: "16px 20px", marginBottom: 14, boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
                      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10
                    }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <span style={{ color: "#1a5fb4" }}><IconCalendar /></span>
                          <h2 style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
                            Daily Class Timetable — Section {section}
                          </h2>
                        </div>
                        <p style={{ color: "#1e293b", fontSize: 13, fontWeight: 600 }}>{formatDate(selectedDate)}</p>
                      </div>

                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          id="day-prev"
                          onClick={() => {
                            const d = new Date(selectedDate);
                            d.setDate(d.getDate() - 1);
                            setSelectedDate(d);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: "6px 12px", fontSize: 13 }}
                        >
                          <IconLeft /> Prev
                        </button>
                        <button
                          id="day-today"
                          onClick={() => setSelectedDate(new Date())}
                          className="btn btn-primary"
                          style={{ padding: "6px 14px", fontSize: 13 }}
                        >
                          Today
                        </button>
                        <button
                          id="day-next"
                          onClick={() => {
                            const d = new Date(selectedDate);
                            d.setDate(d.getDate() + 1);
                            setSelectedDate(d);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: "6px 12px", fontSize: 13 }}
                        >
                          Next <IconRight />
                        </button>
                      </div>
                    </div>

                    {/* Day's Classes List */}
                    {isWeekend ? (
                      <div style={{
                        background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 14,
                        padding: "48px 24px", textAlign: "center", color: "#64748b"
                      }}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>🏖️</div>
                        <div style={{ fontWeight: 800, fontSize: 18, color: "#1e293b", marginBottom: 4 }}>
                          Weekend Recess (Friday &amp; Saturday)
                        </div>
                        <div style={{ fontSize: 14 }}>No academic classes scheduled on this day.</div>
                      </div>
                    ) : schedule.length === 0 ? (
                      <div style={{
                        background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 14,
                        padding: "48px 24px", textAlign: "center", color: "#64748b"
                      }}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>📖</div>
                        <div style={{ fontWeight: 800, fontSize: 18, color: "#1e293b", marginBottom: 4 }}>
                          No Classes Scheduled
                        </div>
                        <div style={{ fontSize: 14 }}>
                          There are no classes scheduled for Section {section} on {BD_DAY_NAMES[selectedDate.getDay()]}.
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {schedule.map((s, i) => (
                          <div
                            key={i}
                            style={{
                              background: "#ffffff",
                              border: "1.5px solid #cbd5e1",
                              borderLeft: `6px solid ${s.type === "lab" ? "#16a34a" : "#1a5fb4"}`,
                              borderRadius: 14,
                              padding: "16px 20px",
                              boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: 12
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              {/* Course Title */}
                              <div style={{ fontWeight: 900, fontSize: 17, color: "#0f172a", marginBottom: 6 }}>
                                {s.course}
                              </div>

                              {/* Course Code & Teacher */}
                              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                                <span style={{
                                  background: s.type === "lab" ? "#f0fdf4" : "#eff6ff",
                                  border: `1px solid ${s.type === "lab" ? "#86efac" : "#93c5fd"}`,
                                  color: s.type === "lab" ? "#166534" : "#1e40af",
                                  fontSize: 13, fontWeight: 800, padding: "2px 8px", borderRadius: 6
                                }}>
                                  {s.courseCode}
                                </span>
                                <span style={{ fontSize: 13, color: "#334155", fontWeight: 700 }}>
                                  Teacher: <span style={{ color: "#0f172a", fontWeight: 800 }}>{s.teacher}</span>
                                </span>
                              </div>

                              {/* Badges: Time, Period, Room, Type */}
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                <span style={{
                                  display: "inline-flex", alignItems: "center", gap: 5,
                                  background: "#f8fafc", border: "1px solid #cbd5e1",
                                  padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, color: "#1e293b"
                                }}>
                                  <IconClock /> {s.time} – {s.endTime}
                                </span>

                                <span style={{
                                  background: "#f1f5f9", border: "1px solid #cbd5e1",
                                  padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, color: "#334155"
                                }}>
                                  {s.periods || "Scheduled Period"}
                                </span>

                                <span style={{
                                  display: "inline-flex", alignItems: "center", gap: 5,
                                  background: "#fef3c7", border: "1px solid #fde047",
                                  padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 800, color: "#92400e"
                                }}>
                                  <IconPin /> {s.room}
                                </span>

                                <span style={{
                                  background: s.type === "lab" ? "#dcfce7" : "#e0e7ff",
                                  border: `1px solid ${s.type === "lab" ? "#86efac" : "#c7d2fe"}`,
                                  color: s.type === "lab" ? "#166534" : "#3730a3",
                                  padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 800
                                }}>
                                  {s.type === "lab" ? "🧪 Sessional / Lab" : "📖 Theory Lecture"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Calendar Widget */}
                  <div>
                    <div style={{
                      background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 14,
                      padding: 16, boxShadow: "0 2px 6px rgba(15,23,42,0.06)"
                    }}>
                      {/* Month navigation */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>
                          {calBase.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </span>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button
                            onClick={() => setCalOffset(c => c - 1)}
                            className="btn btn-secondary"
                            style={{ padding: "4px 8px", fontSize: 12 }}
                          >
                            <IconLeft />
                          </button>
                          <button
                            onClick={() => setCalOffset(c => c + 1)}
                            className="btn btn-secondary"
                            style={{ padding: "4px 8px", fontSize: 12 }}
                          >
                            <IconRight />
                          </button>
                        </div>
                      </div>

                      {/* Weekday headers */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4, textAlign: "center" }}>
                        {BD_DAY_NAMES_SHORT.map((day, i) => (
                          <div key={i} style={{ fontSize: 11, fontWeight: 800, color: i === 5 || i === 6 ? "#ef4444" : "#64748b", padding: "4px 0" }}>
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Day cells */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                        {calCells.map((d, i) => {
                          const todayCell = isToday(d);
                          const sel = isSelected(d);
                          const hc = hasClass(d);
                          const isWk = d ? (new Date(calBase.getFullYear(), calBase.getMonth(), d).getDay() === 5 || new Date(calBase.getFullYear(), calBase.getMonth(), d).getDay() === 6) : false;

                          return (
                            <button
                              key={i}
                              disabled={!d}
                              onClick={() => selectDay(d)}
                              style={{
                                height: 34,
                                border: sel ? "2px solid #1a5fb4" : "1px solid transparent",
                                borderRadius: 8,
                                background: sel ? "#eff6ff" : todayCell ? "#f1f5f9" : "transparent",
                                color: !d ? "transparent" : isWk ? "#94a3b8" : todayCell ? "#1a5fb4" : "#0f172a",
                                fontWeight: sel || todayCell ? 800 : 600,
                                fontSize: 12,
                                cursor: d ? "pointer" : "default",
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              {d}
                              {hc && !sel && (
                                <span style={{
                                  width: 4, height: 4, borderRadius: "50%", background: "#1a5fb4",
                                  position: "absolute", bottom: 3
                                }} />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 12, paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", fontWeight: 700 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a5fb4" }} />
                          Class Day
                        </span>
                        <span style={{ color: "#ef4444" }}>Fri/Sat: Weekend</span>
                      </div>
                    </div>

                    {/* Day 2: Live Room Vacancy Checker Widget (Go API) */}
                    <div style={{
                      background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 14,
                      padding: "16px 18px", marginBottom: 14, boxShadow: "0 2px 6px rgba(15,23,42,0.06)"
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#64748b", marginBottom: 6 }}>
                        🏢 Classroom Vacancy Checker
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>
                        Check if a lab or room is free right now:
                      </div>
                      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                        <select
                          value={checkRoomName}
                          onChange={(e) => setCheckRoomName(e.target.value)}
                          style={{
                            flex: 1, padding: "7px 10px", borderRadius: 8, border: "1.5px solid #cbd5e1",
                            fontSize: 13, fontWeight: 700, background: "#f8fafc", color: "#0f172a"
                          }}
                        >
                          <option value="Room 303">Room 303 (OOP Lab)</option>
                          <option value="Room 304">Room 304 (DBMS Lab)</option>
                          <option value="Room 629">Room 629 (Theory)</option>
                          <option value="Room 630">Room 630 (DSA Lab)</option>
                          <option value="Gallery 2">Gallery 2 (Theory)</option>
                          <option value="Room EEE">Room EEE (Circuit Lab)</option>
                        </select>
                        <button
                          onClick={handleCheckRoom}
                          disabled={isCheckingRoom}
                          style={{
                            background: "#1a5fb4", color: "#ffffff", border: "none",
                            borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 700,
                            cursor: "pointer", transition: "all 0.15s ease"
                          }}
                        >
                          {isCheckingRoom ? "..." : "Check"}
                        </button>
                      </div>

                      {roomResult && (
                        <div style={{
                          padding: "10px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                          background: roomResult.hasConflict ? "#fef2f2" : "#f0fdf4",
                          border: `1px solid ${roomResult.hasConflict ? "#fca5a5" : "#86efac"}`,
                          color: roomResult.hasConflict ? "#991b1b" : "#166534"
                        }}>
                          <div style={{ fontWeight: 800, marginBottom: 2 }}>
                            {roomResult.hasConflict ? "⚠️ Occupied Right Now" : "✅ Vacant & Free to Use"}
                          </div>
                          <div>{roomResult.message}</div>
                        </div>
                      )}
                    </div>

                    {/* Day 2: Attendance & Safe-Bunks Summary Card (Go API) */}
                    {liveAttendance && (
                      <div style={{
                        background: "linear-gradient(135deg, #f8fafc, #edf2f7)",
                        border: "1.5px solid #cbd5e1", borderRadius: 14,
                        padding: "16px 18px", boxShadow: "0 2px 6px rgba(15,23,42,0.06)"
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#64748b", marginBottom: 6 }}>
                          📊 Attendance & Safe-Bunks
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                          <span style={{ fontSize: 22, fontWeight: 900, color: "#166534" }}>
                            {liveAttendance.overallPercentage}%
                          </span>
                          <span style={{
                            background: "#dcfce7", color: "#15803d", border: "1px solid #86efac",
                            padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800
                          }}>
                            {liveAttendance.overallStatus}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.4, margin: 0 }}>
                          According to SUST 75% examination rules, you have good standing across all 10 courses with safe bunk buffers.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* MODE 2: OFFICIAL WEEKLY ROUTINE GRID (Matching Official Table) */
                <div style={{
                  background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 14,
                  padding: 22, boxShadow: "0 2px 6px rgba(15,23,42,0.06)", overflowX: "auto"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div>
                      <h3 style={{ fontWeight: 900, fontSize: 18, color: "#0f172a" }}>
                        Official Routine Grid — 2/2 (Session 2023–24) · Section {section}
                      </h3>
                      <p style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                        Shahjalal University of Science &amp; Technology · Dept. of Computer Science &amp; Engineering
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#166534" }}>
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: "#dcfce7", border: "1px solid #86efac" }} /> Lab Sessional
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#1e40af" }}>
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: "#eff6ff", border: "1px solid #93c5fd" }} /> Theory Lecture
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#475569" }}>
                        <span style={{ width: 12, height: 12, borderRadius: 3, background: "#f1f5f9", border: "1px solid #cbd5e1" }} /> Recess / Lunch
                      </span>
                    </div>
                  </div>

                  {/* Routine Table */}
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#f8fafc", borderBottom: "2px solid #cbd5e1" }}>
                        <th style={{ padding: "10px 8px", border: "1px solid #cbd5e1", fontWeight: 800, color: "#0f172a", width: 90 }}>
                          Day
                        </th>
                        <th style={{ padding: "10px 4px", border: "1px solid #cbd5e1", fontWeight: 800, color: "#0f172a" }}>
                          9:00 - 9:45 AM
                        </th>
                        <th style={{ padding: "10px 4px", border: "1px solid #cbd5e1", fontWeight: 800, color: "#0f172a" }}>
                          9:45 - 10:30 AM
                        </th>
                        <th style={{ padding: "10px 4px", border: "1px solid #cbd5e1", fontWeight: 800, color: "#0f172a" }}>
                          10:30 - 11:15 AM
                        </th>
                        <th style={{ padding: "10px 4px", border: "1px solid #cbd5e1", fontWeight: 800, color: "#0f172a" }}>
                          11:15 - 12:00 PM
                        </th>
                        <th style={{ padding: "10px 4px", border: "1px solid #cbd5e1", fontWeight: 800, color: "#0f172a" }}>
                          12:00 - 12:45 PM
                        </th>
                        <th style={{ padding: "10px 4px", border: "1px solid #cbd5e1", fontWeight: 800, background: "#e2e8f0", color: "#334155", width: 85 }}>
                          12:45 - 1:45 PM
                        </th>
                        <th style={{ padding: "10px 4px", border: "1px solid #cbd5e1", fontWeight: 800, color: "#0f172a" }}>
                          1:45 - 2:30 PM
                        </th>
                        <th style={{ padding: "10px 4px", border: "1px solid #cbd5e1", fontWeight: 800, color: "#0f172a" }}>
                          2:30 - 3:15 PM
                        </th>
                        <th style={{ padding: "10px 4px", border: "1px solid #cbd5e1", fontWeight: 800, color: "#0f172a" }}>
                          3:15 - 4:00 PM
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {daysOrder.map((dayName) => {
                        const isCurrentDay = currentDayName === dayName;
                        const cells = activeWeeklyGrid[dayName] || [];

                        return (
                          <tr key={dayName} style={{ background: isCurrentDay ? "#f0fdf4" : "#ffffff" }}>
                            <td style={{
                              padding: "14px 8px", border: "1px solid #cbd5e1", fontWeight: 800,
                              color: isCurrentDay ? "#166534" : "#0f172a", background: isCurrentDay ? "#dcfce7" : "#f8fafc"
                            }}>
                              {dayName}
                              {isCurrentDay && <div style={{ fontSize: 10, color: "#166534", fontWeight: 800 }}>★ Today</div>}
                            </td>

                            {cells.map((cell, cIdx) => {
                              if (cell.type === "break") {
                                return (
                                  <td
                                    key={cIdx}
                                    colSpan={cell.colSpan}
                                    style={{
                                      padding: "10px 4px", border: "1px solid #cbd5e1",
                                      background: "#f1f5f9", color: "#64748b", fontWeight: 800, fontSize: 11
                                    }}
                                  >
                                    Recess / Lunch
                                  </td>
                                );
                              }

                              if (cell.type === "empty") {
                                return (
                                  <td
                                    key={cIdx}
                                    colSpan={cell.colSpan}
                                    style={{
                                      padding: "10px 4px", border: "1px solid #cbd5e1",
                                      background: "#ffffff", color: "#cbd5e1", fontWeight: 600
                                    }}
                                  >
                                    —
                                  </td>
                                );
                              }

                              const isLab = cell.type === "lab";

                              return (
                                <td
                                  key={cIdx}
                                  colSpan={cell.colSpan}
                                  style={{
                                    padding: "10px 6px",
                                    border: "1px solid #cbd5e1",
                                    background: isLab ? "#f0fdf4" : "#eff6ff",
                                    color: isLab ? "#166534" : "#1e40af",
                                  }}
                                >
                                  <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 2 }}>
                                    {cell.title}
                                  </div>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: isLab ? "#15803d" : "#2563eb" }}>
                                    {cell.room}
                                  </div>
                                  <div style={{ fontSize: 11, fontWeight: 800, color: "#334155" }}>
                                    {cell.teacher}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COURSES */}
          {tab === "courses" && (
            <div>
              <div style={{
                background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 14,
                padding: "18px 22px", marginBottom: 16, boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ color: "#1a5fb4" }}><IconBook /></span>
                    <h2 style={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>
                      {currentSemInfo.term} Courses
                    </h2>
                  </div>
                  <p style={{ color: "#475569", fontSize: 14, fontWeight: 500 }}>
                    {is4thSem
                      ? `Enrolled in 10 Courses · 22.0 Credit Hours · Assigned Section ${section} (${section === "B" ? "Even Roll Numbers" : "Odd Roll Numbers"})`
                      : `Archived Course Records · ${currentSemInfo.credits} Credits · Completed`}
                  </p>
                </div>
                {is4thSem && (
                  <span style={{
                    background: "#f0fdf4", border: "1px solid #86efac", color: "#166534",
                    padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 800
                  }}>
                    Active Academic Session 2023–2024
                  </span>
                )}
              </div>

              {/* Course Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                {currentSemInfo.courses.map((course, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#ffffff", border: "1.5px solid #cbd5e1",
                      borderLeft: `5px solid ${course.type === "lab" ? "#16a34a" : "#1a5fb4"}`,
                      borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
                      display: "flex", flexDirection: "column", justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <span style={{
                          background: course.type === "lab" ? "#f0fdf4" : "#eff6ff",
                          border: `1px solid ${course.type === "lab" ? "#86efac" : "#bfdbfe"}`,
                          color: course.type === "lab" ? "#166534" : "#1a5fb4",
                          fontWeight: 800, fontSize: 13, padding: "2px 8px", borderRadius: 6
                        }}>
                          {course.code}
                        </span>
                        <span style={{
                          background: "#f1f5f9", color: "#334155",
                          fontWeight: 700, fontSize: 12, padding: "2px 8px", borderRadius: 6
                        }}>
                          {course.credits} Credits
                        </span>
                      </div>

                      <h3 style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", marginBottom: 6, lineHeight: 1.3 }}>
                        {course.name}
                      </h3>

                      <p style={{ color: "#475569", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                        Faculty: <span style={{ color: "#0f172a", fontWeight: 700 }}>{course.teacher}</span>
                      </p>
                    </div>

                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: course.type === "lab" ? "#16a34a" : "#1a5fb4"
                      }}>
                        {course.type === "lab" ? "🧪 Lab Sessional" : "📖 Theory Lecture"}
                      </span>
                      <span style={{
                        fontSize: 12, fontWeight: 800,
                        color: is4thSem ? "#16a34a" : gradeColor(course.grade || "")
                      }}>
                        {is4thSem ? "Enrolled & In Progress" : `Grade: ${course.grade}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TRANSCRIPT */}
          {tab === "transcript" && (
            <div>
              <div style={{
                background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 14,
                padding: "18px 22px", marginBottom: 16, boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ color: "#1a5fb4" }}><IconChart /></span>
                    <h2 style={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>Academic Transcript &amp; CGPA</h2>
                  </div>
                  <p style={{ color: "#475569", fontSize: 14, fontWeight: 500 }}>
                    Official Semester-by-Semester Academic Records
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 10, padding: "8px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#1e40af", textTransform: "uppercase" }}>Cumulative CGPA</div>
                    <div style={{ fontWeight: 900, fontSize: 20, color: "#1a5fb4" }}>{user.cgpa}</div>
                  </div>
                </div>
              </div>

              {/* Semester Summary Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 20 }}>
                {ALL_SEMESTERS.slice(0, 3).map(sem => (
                  <div key={sem.number} style={{
                    background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 14,
                    padding: "16px 18px", boxShadow: "0 2px 6px rgba(15,23,42,0.06)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>Semester {sem.number}</span>
                      <span style={{ fontWeight: 900, fontSize: 15, color: "#15803d" }}>GPA: {sem.gpa}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{sem.credits} Credits Completed</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {tab === "profile" && (
            <div>
              <div style={{
                background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 14,
                padding: "18px 22px", marginBottom: 16, boxShadow: "0 2px 6px rgba(15,23,42,0.06)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ color: "#1a5fb4" }}><IconUser /></span>
                  <h2 style={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>Student Profile</h2>
                </div>
                <p style={{ color: "#475569", fontSize: 14, fontWeight: 500 }}>
                  Personal and University Academic Information
                </p>
              </div>

              <div style={{ background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: 14, padding: 28, boxShadow: "0 2px 6px rgba(15,23,42,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, paddingBottom: 20, borderBottom: "1.5px solid #e2e8f0" }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: 18, background: "#eff6ff",
                    color: "#1a5fb4", fontWeight: 900, fontSize: 32, display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 900, fontSize: 22, color: "#0f172a", marginBottom: 4 }}>{user.name}</h3>
                    <p style={{ color: "#475569", fontSize: 14, fontWeight: 600 }}>{user.email}</p>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999, background: "#eff6ff", color: "#1a5fb4" }}>
                        Active Undergraduate Student
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 999, background: "#f0fdf4", color: "#166534" }}>
                        Section {autoSection} ({autoSection === "B" ? "Even Roll" : "Odd Roll"})
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "#f1f5f9", color: "#1e293b" }}>
                        Batch {user.batch}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                  {[
                    { label: "Registration Number", val: user.registration },
                    { label: "Assigned Section", val: `Section ${autoSection} (${autoSection === "B" ? "Even Roll" : "Odd Roll"})` },
                    { label: "Academic Department", val: user.department },
                    { label: "Current Enrolled Semester", val: "4th Semester (2/2)" },
                    { label: "Academic Session", val: "2023–2024" },
                    { label: "Cumulative CGPA", val: user.cgpa.toString() },
                    { label: "Institution", val: "Shahjalal University of Science & Technology (SUST)" },
                    { label: "Roster Status", val: "Verified Active Student" },
                  ].map((item, i) => (
                    <div key={i} style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", marginBottom: 4, textTransform: "uppercase" }}>{item.label}</div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


// ─── ROOT APP COMPONENT ────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [presetReg, setPresetReg] = useState<string>("2023331020");
  const [user, setUser] = useState<User | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number>(4);

  const handleAuthSuccess = useCallback((u: User) => {
    setUser(u);
    // User requirement: After login, go to semester selection!
    setView("semester-select");
  }, []);

  const handleSelectSemester = useCallback((semNumber: number) => {
    setSelectedSemester(semNumber);
    setView("dashboard");
  }, []);

  const handleQuickLogin = useCallback((reg: string) => {
    const stu = STUDENTS[reg];
    if (stu) {
      const { password: _pw, ...u } = stu;
      setUser(u);
      setView("semester-select");
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setView("landing");
  }, []);

  if (view === "landing") {
    return (
      <LandingPage
        onLogin={() => {
          setAuthMode("login");
          setPresetReg("2023331020");
          setView("login");
        }}
        onSignup={() => {
          setAuthMode("signup");
          setPresetReg("");
          setView("signup");
        }}
        onQuickLogin={handleQuickLogin}
      />
    );
  }

  if (view === "login" || view === "signup") {
    return (
      <AuthPage
        mode={authMode}
        presetReg={presetReg}
        onSwitch={() => setAuthMode(m => (m === "login" ? "signup" : "login"))}
        onSuccess={handleAuthSuccess}
        onBack={() => setView("landing")}
      />
    );
  }

  if (view === "semester-select" && user) {
    return (
      <SemesterSelectPage
        user={user}
        onSelectSemester={handleSelectSemester}
        onLogout={handleLogout}
      />
    );
  }

  if (view === "dashboard" && user) {
    return (
      <Dashboard
        user={user}
        selectedSemester={selectedSemester}
        onChangeSemester={() => setView("semester-select")}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}

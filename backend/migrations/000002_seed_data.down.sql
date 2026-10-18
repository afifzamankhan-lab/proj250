-- Migration: 000002_seed_data.down.sql
DELETE FROM notices WHERE title IN ('CSE 250 Project Presentation Schedule', 'SUST CSE Fest 2026 Registration Open');
DELETE FROM fees WHERE receipt_no = 'SUST-FEE-2024-001' OR fee_type = 'Shah Paran Hall Dining & Seat Rent';
DELETE FROM results WHERE student_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
DELETE FROM attendances WHERE student_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
DELETE FROM course_enrollments WHERE student_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
DELETE FROM routines WHERE room_no IN ('Gallery 1 (IICT)', 'Room 205 (IICT)', 'Software Lab 2');
DELETE FROM courses WHERE course_code IN ('CSE 250', 'CSE 231', 'CSE 232');
DELETE FROM students WHERE reg_no = '2023331045';
DELETE FROM teachers WHERE teacher_code = 'T-CSE-01';
DELETE FROM users WHERE email IN ('admin@sust.edu', 'teacher@sust.edu', 'student@student.sust.edu', 'parent@sust.edu', 'accountant@sust.edu');

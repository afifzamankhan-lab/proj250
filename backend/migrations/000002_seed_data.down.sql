-- Migration: 000002_seed_data.down.sql
DELETE FROM notices WHERE title IN ('CSE 0610 2250 (Project Work II) Progress Defense', 'SUST CSE Fest 2026 Registration Announcement');
DELETE FROM fees WHERE receipt_no IN ('SUST-FEE-2024-001', 'SUST-FEE-2024-002') OR fee_type = 'Shah Paran Hall Dining & Seat Rent';
DELETE FROM results WHERE student_id IN ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc');
DELETE FROM attendances WHERE student_id IN ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc');
DELETE FROM course_enrollments WHERE student_id IN ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc');
DELETE FROM routines WHERE room_no IN ('Software Engg Lab (IICT-304)', 'Network Lab (IICT-305)', 'Gallery 1 (IICT)', 'Room 205 (IICT)');
DELETE FROM courses WHERE semester IN ('4th Semester', '1st Semester', '2nd Semester', '3rd Semester');
DELETE FROM students WHERE reg_no IN ('2023331045', '2023331046');
DELETE FROM teachers WHERE teacher_code = 'T-CSE-01';
DELETE FROM users WHERE email IN ('admin@sust.edu', 'teacher@sust.edu', 'student@student.sust.edu', 'partner@student.sust.edu', 'parent@sust.edu', 'accountant@sust.edu');

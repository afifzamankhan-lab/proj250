-- Migration: 000002_seed_data.up.sql
-- Seed Data for SUST CSE 23/24 Academic Portal (Password for all accounts: Password@123)

-- 1. Insert Users for each Role
INSERT INTO users (id, email, password_hash, role) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@sust.edu', '$2a$10$URqexyY47v0A5mh/DIIOSeC4lwtWNxCdPuJ1f.k/1L4P78MAW14by', 'admin'),
('22222222-2222-2222-2222-222222222222', 'teacher@sust.edu', '$2a$10$URqexyY47v0A5mh/DIIOSeC4lwtWNxCdPuJ1f.k/1L4P78MAW14by', 'teacher'),
('33333333-3333-3333-3333-333333333333', 'student@student.sust.edu', '$2a$10$URqexyY47v0A5mh/DIIOSeC4lwtWNxCdPuJ1f.k/1L4P78MAW14by', 'student'),
('44444444-4444-4444-4444-444444444444', 'parent@sust.edu', '$2a$10$URqexyY47v0A5mh/DIIOSeC4lwtWNxCdPuJ1f.k/1L4P78MAW14by', 'parent'),
('55555555-5555-5555-5555-555555555555', 'accountant@sust.edu', '$2a$10$URqexyY47v0A5mh/DIIOSeC4lwtWNxCdPuJ1f.k/1L4P78MAW14by', 'accountant')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Teacher Profile
INSERT INTO teachers (id, user_id, teacher_code, full_name, designation, department, phone, room_no) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'T-CSE-01', 'Dr. M. Rezaul Karim', 'Professor', 'Computer Science & Engineering', '+8801712345678', 'IICT-302')
ON CONFLICT (teacher_code) DO NOTHING;

-- 3. Insert Student Profile
INSERT INTO students (id, user_id, reg_no, full_name, batch, session, current_semester, phone, guardian_name, guardian_phone, guardian_user_id, hall_name) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', '2023331045', 'Afif Zaman Khan', '2023', '2023-2024', '2-1', '+8801700000000', 'Mr. Zaman Khan', '+8801711000000', '44444444-4444-4444-4444-444444444444', 'Shah Paran Hall')
ON CONFLICT (reg_no) DO NOTHING;

-- 4. Insert Core SUST CSE Courses for 2-1 Semester
INSERT INTO courses (id, course_code, title, credit, semester, assigned_teacher_id) VALUES
('c1111111-1111-1111-1111-111111111111', 'CSE 250', 'System Analysis and Design', 3.00, '2-1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c2222222-2222-2222-2222-222222222222', 'CSE 231', 'Data Structures & Algorithms II', 3.00, '2-1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c3333333-3333-3333-3333-333333333333', 'CSE 232', 'Data Structures & Algorithms II Lab', 1.50, '2-1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
ON CONFLICT (course_code) DO NOTHING;

-- 5. Insert Class Routine
INSERT INTO routines (id, course_id, day_of_week, start_time, end_time, room_no) VALUES
('d1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Sunday', '09:00 AM', '10:30 AM', 'Gallery 1 (IICT)'),
('d2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Tuesday', '11:00 AM', '12:30 PM', 'Gallery 1 (IICT)'),
('d3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', 'Monday', '10:00 AM', '11:30 AM', 'Room 205 (IICT)'),
('d4444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333', 'Wednesday', '02:00 PM', '05:00 PM', 'Software Lab 2')
ON CONFLICT DO NOTHING;

-- 6. Enroll Student into Courses
INSERT INTO course_enrollments (student_id, course_id, semester) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1111111-1111-1111-1111-111111111111', '2-1'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c2222222-2222-2222-2222-222222222222', '2-1'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c3333333-3333-3333-3333-333333333333', '2-1')
ON CONFLICT DO NOTHING;

-- 7. Insert Attendance Records
INSERT INTO attendances (course_id, student_id, date, status, marked_by) VALUES
('c1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE - INTERVAL '2 days', 'present', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_DATE - INTERVAL '1 day', 'present', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
ON CONFLICT DO NOTHING;

-- 8. Insert Semester Results (UGC 4.0 Scale)
INSERT INTO results (course_id, student_id, semester, attendance_marks, quiz_assignment_marks, final_exam_marks, total_marks, grade, grade_point, remarks) VALUES
('c1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2-1', 9.50, 18.50, 60.00, 88.00, 'A+', 4.00, 'Excellent performance'),
('c2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2-1', 8.00, 16.00, 52.00, 76.00, 'A', 3.75, 'Good analytical skills')
ON CONFLICT DO NOTHING;

-- 9. Insert Fees (Semester & Hall dues)
INSERT INTO fees (student_id, fee_type, amount, due_date, paid_amount, status, payment_method, transaction_id, paid_at, receipt_no) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2-1 Semester Registration Fee', 3500.00, CURRENT_DATE + INTERVAL '15 days', 3500.00, 'paid', 'bKash', 'BK2489371092', NOW(), 'SUST-FEE-2024-001'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Shah Paran Hall Dining & Seat Rent', 2200.00, CURRENT_DATE + INTERVAL '10 days', 0.00, 'unpaid', NULL, NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- 10. Insert Departmental Notices
INSERT INTO notices (title, content, category, target_role, posted_by) VALUES
('CSE 250 Project Presentation Schedule', 'All 2023 Batch students must submit their system architecture design and project proposals by next Sunday at 11:59 PM.', 'Academic', 'all', '11111111-1111-1111-1111-111111111111'),
('SUST CSE Fest 2026 Registration Open', 'Department of CSE is pleased to announce National Hackathon and Programming Contest registrations are now live.', 'General', 'all', '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

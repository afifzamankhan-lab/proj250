-- Migration: 000002_seed_data.up.sql
-- SUST CSE 23/24 Academic Portal Seed Data (Password for all accounts: Password@123)

-- 1. Insert Users for each Role
-- Bcrypt Hash for "Password@123": $2a$10$URqexyY47v0A5mh/DIIOSeC4lwtWNxCdPuJ1f.k/1L4P78MAW14by
INSERT INTO users (id, email, password_hash, role) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@sust.edu', '$2a$10$URqexyY47v0A5mh/DIIOSeC4lwtWNxCdPuJ1f.k/1L4P78MAW14by', 'admin'),
('22222222-2222-2222-2222-222222222222', 'teacher@sust.edu', '$2a$10$URqexyY47v0A5mh/DIIOSeC4lwtWNxCdPuJ1f.k/1L4P78MAW14by', 'teacher'),
('33333333-3333-3333-3333-333333333333', 'student@student.sust.edu', '$2a$10$URqexyY47v0A5mh/DIIOSeC4lwtWNxCdPuJ1f.k/1L4P78MAW14by', 'student'),
('33333333-3333-3333-3333-333333333334', 'partner@student.sust.edu', '$2a$10$URqexyY47v0A5mh/DIIOSeC4lwtWNxCdPuJ1f.k/1L4P78MAW14by', 'student'),
('44444444-4444-4444-4444-444444444444', 'parent@sust.edu', '$2a$10$URqexyY47v0A5mh/DIIOSeC4lwtWNxCdPuJ1f.k/1L4P78MAW14by', 'parent'),
('55555555-5555-5555-5555-555555555555', 'accountant@sust.edu', '$2a$10$URqexyY47v0A5mh/DIIOSeC4lwtWNxCdPuJ1f.k/1L4P78MAW14by', 'accountant')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Teachers
INSERT INTO teachers (id, user_id, teacher_code, full_name, designation, department, phone, room_no) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'T-CSE-01', 'Prof. Dr. M. Rezaul Karim', 'Professor & Head', 'Computer Science & Engineering', '+8801712345678', 'IICT-302')
ON CONFLICT (teacher_code) DO NOTHING;

-- 3. Insert Students (Student 1: Afif Zaman Khan, Student 2: Teammate / Partner)
INSERT INTO students (id, user_id, reg_no, full_name, batch, session, current_semester, phone, guardian_name, guardian_phone, guardian_user_id, hall_name) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', '2023331045', 'Afif Zaman Khan', '2023', '2023-2024', '4th Semester', '+8801700000045', 'Mr. Zaman Khan', '+8801711000000', '44444444-4444-4444-4444-444444444444', 'Shah Paran Hall'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', '33333333-3333-3333-3333-333333333334', '2023331046', 'Project Teammate', '2023', '2023-2024', '4th Semester', '+8801700000046', 'Guardian Name', '+8801711000001', NULL, 'Shah Paran Hall')
ON CONFLICT (reg_no) DO NOTHING;

-- 4. Insert 4th Semester (2-2) Official SUST CSE Courses (from syllabus)
INSERT INTO courses (id, course_code, title, credit, type, semester, session, course_type, assigned_teacher_id) VALUES
('c1000000-0000-0000-0000-000000000001', 'CSE 0610 2250', 'Project Work II', 1.50, 'Lab', '4th Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c1000000-0000-0000-0000-000000000002', 'CSE 0612 2260', 'Web Technologies', 2.00, 'Lab', '4th Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c1000000-0000-0000-0000-000000000003', 'CSE 0613 2234', 'Introduction to Competitive Programming', 1.50, 'Lab', '4th Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c1000000-0000-0000-0000-000000000004', 'CSE 0613 2247', 'Theory of Computation', 3.00, 'Theory', '4th Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c1000000-0000-0000-0000-000000000005', 'CSE 0541 2257', 'Numerical Analysis', 2.00, 'Theory', '4th Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c1000000-0000-0000-0000-000000000006', 'CSE 0688 2292', 'Introduction to Data Science Lab', 1.50, 'Lab', '4th Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c1000000-0000-0000-0000-000000000007', 'CSE 0541 2258', 'Numerical Analysis Lab', 1.50, 'Lab', '4th Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c1000000-0000-0000-0000-000000000008', 'MAT 0541 2204D', 'Complex Variables, Laplace Transform and Fourier Series', 3.00, 'Theory', '4th Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c1000000-0000-0000-0000-000000000009', 'EEE 0714 2201D', 'Digital Logic Design', 3.00, 'Theory', '4th Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c1000000-0000-0000-0000-000000000010', 'EEE 0714 2202D', 'Digital Logic Design Lab', 2.00, 'Lab', '4th Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
ON CONFLICT (course_code) DO NOTHING;

-- 5. Insert Past Completed Semester Courses (1-1, 1-2, 2-1) to calculate Cumulative CGPA
INSERT INTO courses (id, course_code, title, credit, type, semester, session, course_type, assigned_teacher_id) VALUES
-- 1st Semester (1-1)
('c0100000-0000-0000-0000-000000000001', 'CSE 0613 1133', 'Structured Programming', 3.00, 'Theory', '1st Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c0100000-0000-0000-0000-000000000002', 'CSE 0613 1134', 'Structured Programming Lab', 1.50, 'Lab', '1st Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c0100000-0000-0000-0000-000000000003', 'MAT 0541 1101D', 'Differential & Integral Calculus', 3.00, 'Theory', '1st Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c0100000-0000-0000-0000-000000000004', 'PHY 0533 1101D', 'Physics for Engineers', 3.00, 'Theory', '1st Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
-- 2nd Semester (1-2)
('c0200000-0000-0000-0000-000000000001', 'CSE 0613 1233', 'Object Oriented Programming', 3.00, 'Theory', '2nd Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c0200000-0000-0000-0000-000000000002', 'CSE 0613 1234', 'Object Oriented Programming Lab', 1.50, 'Lab', '2nd Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c0200000-0000-0000-0000-000000000003', 'MAT 0541 1201D', 'Coordinate Geometry & Linear Algebra', 3.00, 'Theory', '2nd Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c0200000-0000-0000-0000-000000000004', 'EEE 0714 1201D', 'Electrical Circuit Analysis', 3.00, 'Theory', '2nd Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
-- 3rd Semester (2-1)
('c0300000-0000-0000-0000-000000000001', 'CSE 0613 2133', 'Data Structures and Algorithms I', 3.00, 'Theory', '3rd Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c0300000-0000-0000-0000-000000000002', 'CSE 0613 2134', 'Data Structures and Algorithms I Lab', 1.50, 'Lab', '3rd Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c0300000-0000-0000-0000-000000000003', 'CSE 0613 2147', 'Discrete Mathematics', 3.00, 'Theory', '3rd Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('c0300000-0000-0000-0000-000000000004', 'STA 0542 2101D', 'Statistics for Engineers', 3.00, 'Theory', '3rd Semester', '2023-2024', 'Regular', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
ON CONFLICT (course_code) DO NOTHING;

-- 6. Enroll Both Students into All 10 Courses of 4th Semester (2-2)
INSERT INTO course_enrollments (student_id, course_id, semester) VALUES
-- Student 1 (Afif)
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1000000-0000-0000-0000-000000000001', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1000000-0000-0000-0000-000000000002', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1000000-0000-0000-0000-000000000003', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1000000-0000-0000-0000-000000000004', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1000000-0000-0000-0000-000000000005', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1000000-0000-0000-0000-000000000006', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1000000-0000-0000-0000-000000000007', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1000000-0000-0000-0000-000000000008', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1000000-0000-0000-0000-000000000009', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1000000-0000-0000-0000-000000000010', '4th Semester'),
-- Student 2 (Teammate)
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'c1000000-0000-0000-0000-000000000001', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'c1000000-0000-0000-0000-000000000002', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'c1000000-0000-0000-0000-000000000003', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'c1000000-0000-0000-0000-000000000004', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'c1000000-0000-0000-0000-000000000005', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'c1000000-0000-0000-0000-000000000006', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'c1000000-0000-0000-0000-000000000007', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'c1000000-0000-0000-0000-000000000008', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'c1000000-0000-0000-0000-000000000009', '4th Semester'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', 'c1000000-0000-0000-0000-000000000010', '4th Semester')
ON CONFLICT DO NOTHING;

-- 7. Seed Past Semesters Results for Both Students (for CGPA calculation)
INSERT INTO results (course_id, student_id, semester, attendance_marks, quiz_assignment_marks, final_exam_marks, total_marks, grade, grade_point, remarks) VALUES
-- Student 1 (Afif) - 1st Semester (SGPA: 3.86)
('c0100000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '1st Semester', 9.50, 19.00, 58.00, 86.50, 'A+', 4.00, 'Excellent programming fundamentals'),
('c0100000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '1st Semester', 10.00, 19.50, 60.00, 89.50, 'A+', 4.00, 'Outstanding lab performance'),
('c0100000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '1st Semester', 8.50, 16.50, 52.00, 77.00, 'A', 3.75, 'Solid grasp of calculus'),
('c0100000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '1st Semester', 9.00, 17.00, 51.00, 77.00, 'A', 3.75, 'Very good analytical physics'),
-- Student 1 (Afif) - 2nd Semester (SGPA: 3.88)
('c0200000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2nd Semester', 10.00, 18.50, 56.50, 85.00, 'A+', 4.00, 'Mastered OOP concepts'),
('c0200000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2nd Semester', 9.50, 19.00, 58.50, 87.00, 'A+', 4.00, 'Great software design in lab'),
('c0200000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2nd Semester', 8.00, 15.00, 48.00, 71.00, 'A-', 3.50, 'Passed with good standing'),
('c0200000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2nd Semester', 9.00, 17.50, 51.50, 78.00, 'A', 3.75, 'Very good circuits solving'),
-- Student 1 (Afif) - 3rd Semester (SGPA: 3.93)
('c0300000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '3rd Semester', 10.00, 19.00, 59.00, 88.00, 'A+', 4.00, 'Exceptional algorithms knowledge'),
('c0300000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '3rd Semester', 9.50, 19.50, 60.00, 89.00, 'A+', 4.00, 'Perfect DSA problem solving'),
('c0300000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '3rd Semester', 9.00, 18.00, 53.00, 80.00, 'A+', 4.00, 'Excellent discrete logic'),
('c0300000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '3rd Semester', 8.50, 17.00, 51.50, 77.00, 'A', 3.75, 'Good statistics concepts')
ON CONFLICT DO NOTHING;

-- 8. Routine Slots for 4th Semester (Editable schedule)
INSERT INTO routines (id, course_id, day_of_week, start_time, end_time, room_no) VALUES
('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Sunday', '11:00 AM', '01:00 PM', 'Software Engg Lab (IICT-304)'),
('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Monday', '02:00 PM', '04:30 PM', 'Network Lab (IICT-305)'),
('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000004', 'Tuesday', '09:00 AM', '10:30 AM', 'Gallery 1 (IICT)'),
('d1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000009', 'Wednesday', '10:30 AM', '12:00 PM', 'Room 205 (IICT)')
ON CONFLICT DO NOTHING;

-- 9. Insert Semester Dues & Payments for 4th Semester
INSERT INTO fees (student_id, fee_type, amount, due_date, paid_amount, status, payment_method, transaction_id, paid_at, receipt_no) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '4th Semester (2-2) Registration Fee', 3500.00, CURRENT_DATE + INTERVAL '20 days', 3500.00, 'paid', 'bKash', 'BK2489371092', NOW(), 'SUST-FEE-2024-001'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Shah Paran Hall Dining & Seat Rent', 2200.00, CURRENT_DATE + INTERVAL '10 days', 0.00, 'unpaid', NULL, NULL, NULL, NULL),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc', '4th Semester (2-2) Registration Fee', 3500.00, CURRENT_DATE + INTERVAL '20 days', 3500.00, 'paid', 'Nagad', 'NG9876543210', NOW(), 'SUST-FEE-2024-002')
ON CONFLICT DO NOTHING;

-- 10. Departmental Notices
INSERT INTO notices (title, content, category, target_role, posted_by) VALUES
('CSE 0610 2250 (Project Work II) Progress Defense', 'All 4th Semester (2023-2024 session) students must present their system architecture, database schema, and live demonstration of Auth & RBAC modules this week.', 'Academic', 'all', '11111111-1111-1111-1111-111111111111'),
('SUST CSE Fest 2026 Registration Announcement', 'Registrations for the National Hackathon, ICPC Preliminary mock, and Gaming contests are now open on the department portal.', 'General', 'all', '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

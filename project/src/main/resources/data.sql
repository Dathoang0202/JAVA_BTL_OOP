INSERT INTO users (id, username, email, password, full_name, role) 
VALUES (1, 'demo', 'demo@student.edu.vn', '$2a$10$UMP89HP4x0WHWc.5Q4MkmeRw8LtuuN.upVL732tNtyF84IAMhwet6', 'Nguyễn Văn A', 'STUDENT')
ON CONFLICT (id) DO NOTHING;

INSERT INTO courses (id, user_id, title, category, description, target_date, status, color) VALUES
(1, 1, 'Lập trình Java Spring Boot', 'Công nghệ thông tin', 'Khóa học Spring Boot REST API và Microservices', '2026-10-15', 'IN_PROGRESS', '#6366f1'),
(2, 1, 'Cơ sở dữ liệu MySQL', 'Khoa học máy tính', 'Thiết kế CSDL, Tối ưu câu lệnh SQL và Triggers', '2026-09-30', 'IN_PROGRESS', '#06b6d4'),
(3, 1, 'Tiếng Anh Chuyên Nành IT', 'Ngoại ngữ', 'Từ vựng chuyên ngành & Đọc hiểu tài liệu kỹ thuật', '2026-11-20', 'IN_PROGRESS', '#10b981')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, course_id, user_id, title, priority, status, estimated_hours, spent_hours, due_date) VALUES
(1, 1, 1, 'Tạo dự án Maven và cấu hình Spring Boot', 'HIGH', 'COMPLETED', 2.0, 2.5, '2026-08-25'),
(2, 1, 1, 'Viết Entity và REST Controller cho User Auth', 'HIGH', 'IN_PROGRESS', 4.0, 2.0, '2026-08-30'),
(3, 1, 1, 'Thiết kế giao diện HTML/CSS Dashboard', 'MEDIUM', 'IN_PROGRESS', 5.0, 3.0, '2026-09-02'),
(4, 2, 1, 'Tạo các bảng User, Course, Task trong MySQL Workbench', 'HIGH', 'COMPLETED', 3.0, 3.0, '2026-08-27'),
(5, 2, 1, 'Viết Stored Procedures & Indexes', 'LOW', 'TODO', 3.0, 0.0, '2026-09-10'),
(6, 3, 1, 'Học 50 từ vựng mảng System Architecture', 'MEDIUM', 'IN_PROGRESS', 2.0, 1.0, '2026-09-01')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- SQL Script khoi tao Database & Bang cho Web Theo Doi Tien Do Hoc Tap
-- Huong dan: Mo file nay trong MySQL Workbench va Nhan bieu tuong Tia set (Execute)
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `learning_progress_db` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `learning_progress_db`;

-- 0. Bang Lop hoc / Phong hoc (classrooms)
CREATE TABLE IF NOT EXISTS `classrooms` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `class_code` VARCHAR(30) NOT NULL UNIQUE,
    `description` TEXT,
    `teacher_name` VARCHAR(100),
    `room_number` VARCHAR(50),
    `semester` VARCHAR(30) DEFAULT 'HK1 - 2026',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1. Bang Nguoi dung (users)
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) DEFAULT 'STUDENT',
    `avatar` VARCHAR(255) DEFAULT 'default_avatar.png',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bang Mon hoc / Khoa hoc (courses)
CREATE TABLE IF NOT EXISTS `courses` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `description` TEXT,
    `target_date` DATE,
    `status` VARCHAR(20) DEFAULT 'IN_PROGRESS',
    `color` VARCHAR(20) DEFAULT '#4f46e5',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bang Nhiem vu / Bai hoc (tasks)
CREATE TABLE IF NOT EXISTS `tasks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `course_id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `priority` VARCHAR(20) DEFAULT 'MEDIUM',
    `status` VARCHAR(20) DEFAULT 'TODO',
    `estimated_hours` DOUBLE DEFAULT 1.0,
    `spent_hours` DOUBLE DEFAULT 0.0,
    `due_date` DATE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bang Nhat ky hoc tap (study_logs)
CREATE TABLE IF NOT EXISTS `study_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `task_id` BIGINT DEFAULT NULL,
    `duration_minutes` INT NOT NULL,
    `notes` TEXT,
    `log_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- Du lieu mau khoi tao (Seed Data)
-- Pass: 123456 (duoc hash BCrypt)
-- =========================================================================

INSERT IGNORE INTO `classrooms` (`id`, `name`, `class_code`, `description`, `teacher_name`, `room_number`, `semester`) VALUES
(1, 'Lập Trình Java Nâng Cao - Nhóm 01', 'JAVA2026_01', 'Lớp học lập trình Spring Boot & REST APIs', 'TS. Nguyễn Văn B', 'A2-501', 'HK1 - 2026'),
(2, 'Cơ Sở Dữ Liệu MySQL - Nhóm 02', 'SQL2026_02', 'Lớp thực hành thiết kế CSDL & MySQL Workbench', 'ThS. Trần Thị C', 'B1-302', 'HK1 - 2026');

INSERT IGNORE INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `role`) 
VALUES (1, 'demo', 'demo@student.edu.vn', '$2a$10$UMP89HP4x0WHWc.5Q4MkmeRw8LtuuN.upVL732tNtyF84IAMhwet6', 'Nguyễn Văn A', 'STUDENT');

INSERT IGNORE INTO `courses` (`id`, `user_id`, `title`, `category`, `description`, `target_date`, `status`, `color`) VALUES
(1, 1, 'Lập trình Java Spring Boot', 'Công nghệ thông tin', 'Khóa học Spring Boot REST API và Microservices', '2026-10-15', 'IN_PROGRESS', '#6366f1'),
(2, 1, 'Cơ sở dữ liệu MySQL', 'Khoa học máy tính', 'Thiết kế CSDL, Tối ưu câu lệnh SQL và Triggers', '2026-09-30', 'IN_PROGRESS', '#06b6d4'),
(3, 1, 'Tiếng Anh Chuyên Nành IT', 'Ngoại ngữ', 'Từ vựng chuyên ngành & Đọc hiểu tài liệu kỹ thuật', '2026-11-20', 'IN_PROGRESS', '#10b981');

INSERT IGNORE INTO `tasks` (`id`, `course_id`, `user_id`, `title`, `priority`, `status`, `estimated_hours`, `spent_hours`, `due_date`) VALUES
(1, 1, 1, 'Tạo dự án Maven và cấu hình Spring Boot', 'HIGH', 'COMPLETED', 2.0, 2.5, '2026-08-25'),
(2, 1, 1, 'Viết Entity và REST Controller cho User Auth', 'HIGH', 'IN_PROGRESS', 4.0, 2.0, '2026-08-30'),
(3, 1, 1, 'Thiết kế giao diện HTML/CSS Dashboard', 'MEDIUM', 'IN_PROGRESS', 5.0, 3.0, '2026-09-02'),
(4, 2, 1, 'Tạo các bảng User, Course, Task trong MySQL Workbench', 'HIGH', 'COMPLETED', 3.0, 3.0, '2026-08-27'),
(5, 2, 1, 'Viết Stored Procedures & Indexes', 'LOW', 'TODO', 3.0, 0.0, '2026-09-10'),
(6, 3, 1, 'Học 50 từ vựng mảng System Architecture', 'MEDIUM', 'IN_PROGRESS', 2.0, 1.0, '2026-09-01');

INSERT IGNORE INTO `study_logs` (`id`, `user_id`, `task_id`, `duration_minutes`, `notes`, `log_date`) VALUES
(1, 1, 1, 120, 'Hoàn thành cấu hình pom.xml và application.properties', '2026-08-25 14:30:00'),
(2, 1, 4, 180, 'Thực thi schema.sql trên MySQL Workbench thành công', '2026-08-27 16:00:00'),
(3, 1, 2, 60, 'Tìm hiểu JPA Annotations @Entity, @Table', '2026-08-28 09:00:00');

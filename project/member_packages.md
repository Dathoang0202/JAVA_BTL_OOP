# BẢNG PHÂN CHIA NHÓM FULL-STACK & MÔ ĐUN LỚP HỌC (5 THÀNH VIÊN)

Dự án **EduTrack - Web Theo Dõi Tiến Độ Học Tập** đã được tích hợp mô đun **Quản Lý Lớp Học (Classroom Management Module)** và biên dịch thành công 100%!

---

## 📦 GÓI 1: XÁC THỰC & BẢO MẬT (Thành viên 1 - Auth & Security)
- **Backend**:
  - `src/main/java/minhdat/dev/project/config/` (`AuthInterceptor.java`, `WebConfig.java`)
  - `src/main/java/minhdat/dev/project/controller/AuthController.java`
  - `src/main/java/minhdat/dev/project/service/AuthService.java`
  - `src/main/java/minhdat/dev/project/repository/UserRepository.java`
  - `src/main/java/minhdat/dev/project/entity/User.java`
  - `src/main/java/minhdat/dev/project/dto/` (`RegisterRequest.java`, `LoginRequest.java`, `UserResponse.java`)
- **Frontend Component**:
  - `src/main/resources/static/components/auth-modal.html`
  - `src/main/resources/static/components/sidebar.html`

---

## 📦 GÓI 2: LỚP HỌC & MÔN HỌC (Thành viên 2 - Classroom & Course Module)
- **Backend Classrooms & Courses**:
  - `src/main/java/minhdat/dev/project/entity/Classroom.java` & `Course.java`
  - `src/main/java/minhdat/dev/project/repository/ClassroomRepository.java` & `CourseRepository.java`
  - `src/main/java/minhdat/dev/project/service/ClassroomService.java` & `CourseService.java`
  - `src/main/java/minhdat/dev/project/controller/ClassroomController.java` & `CourseController.java`
  - `src/main/java/minhdat/dev/project/dto/ClassroomDto.java` & `CourseDto.java`
- **Frontend Components**:
  - `src/main/resources/static/components/classrooms-tab.html`
  - `src/main/resources/static/components/courses-tab.html`

---

## 📦 GÓI 3: BÀI TẬP & KANBAN (Thành viên 3 - Task & Kanban Module)
- **Backend**:
  - `src/main/java/minhdat/dev/project/controller/TaskController.java`
  - `src/main/java/minhdat/dev/project/service/TaskService.java`
  - `src/main/java/minhdat/dev/project/repository/TaskRepository.java`
  - `src/main/java/minhdat/dev/project/entity/Task.java`
  - `src/main/java/minhdat/dev/project/dto/TaskDto.java`
- **Frontend Component**:
  - `src/main/resources/static/components/tasks-tab.html`

---

## 📦 GÓI 4: DASHBOARD & POMODORO (Thành viên 4 - Analytics & Logs)
- **Backend**:
  - `src/main/java/minhdat/dev/project/controller/` (`DashboardController.java`, `StudyLogController.java`)
  - `src/main/java/minhdat/dev/project/service/` (`DashboardService.java`, `StudyLogService.java`)
  - `src/main/java/minhdat/dev/project/repository/StudyLogRepository.java`
  - `src/main/java/minhdat/dev/project/entity/StudyLog.java`
  - `src/main/java/minhdat/dev/project/dto/` (`DashboardSummaryDto.java`, `StudyLogDto.java`)
- **Frontend Components**:
  - `src/main/resources/static/components/dashboard-tab.html`
  - `src/main/resources/static/components/studylogs-tab.html`

---

## 📦 GÓI 5: DATABASE, SYSTEM & QA (Thành viên 5 - DB, System & QA)
- **Database & Properties**:
  - `schema.sql` (File tạo bảng `classrooms`, `users`, `courses`, `tasks`, `study_logs` trong MySQL Workbench)
  - `data.sql`, `application.properties`, `application-h2.properties`, `pom.xml`
- **Exception & System**:
  - `src/main/java/minhdat/dev/project/exception/GlobalExceptionHandler.java`
  - `src/main/java/minhdat/dev/project/dto/ApiResponse.java`
- **System Frontend**:
  - `src/main/resources/static/index.html`
  - `src/main/resources/static/css/style.css`
  - `src/main/resources/static/js/app.js`

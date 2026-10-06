# EduTrack — Theo dõi tiến độ học tập

Ứng dụng gồm giao diện HTML/CSS/JavaScript, API Spring Boot và cơ sở dữ liệu MySQL. Người dùng đăng ký/đăng nhập, quản lý môn học, nhiệm vụ, lớp học, nhật ký học tập và xem dashboard.

## Chạy trên MySQL của bạn

1. Cài Java 25 và chạy MySQL. Trong [`project/src/main/resources/application.properties`](project/src/main/resources/application.properties), tự đặt `spring.datasource.url`, `spring.datasource.username` và `spring.datasource.password` đúng với máy của bạn. Mặc định ứng dụng dùng MySQL; không cần bật profile H2.
2. Nếu muốn có dữ liệu mẫu, chạy [`project/schema.sql`](project/schema.sql) trong MySQL Workbench. Script tạo database, các bảng và tài khoản `demo` với mật khẩu `123456`. Nếu database đã có tài khoản `demo`, `INSERT IGNORE` sẽ giữ nguyên mật khẩu cũ; bạn có thể đăng ký tài khoản mới trên giao diện.
3. Mở PowerShell tại thư mục `project`, chạy `./mvnw.cmd spring-boot:run`.
4. Mở `http://localhost:8080`.

Lệnh kiểm thử: `./mvnw.cmd test`. Các kiểm thử tự dùng H2 trong bộ nhớ, không truy cập MySQL của bạn. Profile H2 cũng có thể dùng để chạy thử một cơ sở dữ liệu rỗng bằng `./mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2`.

## Cách đọc chương trình

Bắt đầu từ một thao tác cụ thể, ví dụ **tạo nhiệm vụ**:

1. [`project/src/main/resources/static/index.html`](project/src/main/resources/static/index.html) chứa form, nút bấm và các vùng hiển thị.
2. [`project/src/main/resources/static/js/app.js`](project/src/main/resources/static/js/app.js) khởi tạo các component và nối callback để làm mới dữ liệu.
3. [`TaskComponent.js`](project/src/main/resources/static/js/components/TaskComponent.js) đọc form, gọi [`TaskService.js`](project/src/main/resources/static/js/services/TaskService.js), rồi hiển thị kết quả.
4. [`TaskController.java`](project/src/main/java/minhdat/dev/project/controller/TaskController.java) nhận HTTP `POST /api/tasks`, lấy người dùng từ session và gọi service.
5. [`TaskService.java`](project/src/main/java/minhdat/dev/project/service/TaskService.java) kiểm tra dữ liệu, xác nhận môn học thuộc người dùng và tạo nhiệm vụ.
6. [`TaskRepository.java`](project/src/main/java/minhdat/dev/project/repository/TaskRepository.java) làm việc với database thông qua Spring Data JPA; [`Task.java`](project/src/main/java/minhdat/dev/project/entity/Task.java) mô tả bảng `tasks`.
7. [`TaskDto.java`](project/src/main/java/minhdat/dev/project/dto/TaskDto.java) là dữ liệu API trả về cho giao diện. [`ApiResponse.java`](project/src/main/java/minhdat/dev/project/dto/ApiResponse.java) bọc dữ liệu và thông báo thành công/lỗi.

Các nhóm file khác cũng đi theo đường đi tương tự: `Course`, `StudyLog`, `Classroom`, `Dashboard`, `Auth`. Hãy đọc một nhóm từ giao diện tới database, sau đó mới chuyển sang nhóm khác.

## Những khái niệm Java nên nhận ra

- **Entity** (`entity/`): lớp Java ánh xạ một bảng MySQL; mỗi đối tượng thường là một dòng dữ liệu. `@Entity`, `@Table`, `@Id` là annotation JPA.
- **Repository** (`repository/`): interface để tìm, lưu, xóa dữ liệu. Spring tự tạo phần thực thi của các phương thức như `findByIdAndUserId`.
- **Service** (`service/`): nơi đặt quy tắc nghiệp vụ. Ví dụ chỉ cho phép thêm nhiệm vụ vào môn học của chính người đăng nhập.
- **Controller** (`controller/`): nhận request từ trình duyệt, gọi service và trả JSON. `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping` tương ứng các thao tác HTTP.
- **DTO** (`dto/`): dữ liệu trao đổi qua API; giúp giao diện không phải nhận trực tiếp entity.
- **Constructor injection**: controller nhận service qua constructor; service nhận repository theo cách tương tự. Spring cung cấp các đối tượng này nhờ `@RestController`, `@Service`, `@Repository`.
- **Session**: [`AuthInterceptor.java`](project/src/main/java/minhdat/dev/project/config/AuthInterceptor.java) chặn phần lớn API nếu chưa đăng nhập. [`AuthService.java`](project/src/main/java/minhdat/dev/project/service/AuthService.java) xử lý tài khoản và mật khẩu BCrypt.

Điểm bắt đầu của chương trình Java là [`ProjectApplication.java`](project/src/main/java/minhdat/dev/project/ProjectApplication.java). Phương thức `main` khởi động Spring Boot; từ đó framework tự phát hiện controller, service, repository và entity.

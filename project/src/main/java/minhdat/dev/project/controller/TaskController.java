package minhdat.dev.project.controller;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import minhdat.dev.project.config.AuthInterceptor;
import minhdat.dev.project.dto.ApiResponse;
import minhdat.dev.project.dto.TaskDto;
import minhdat.dev.project.dto.UserResponse;
import minhdat.dev.project.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskDto>>> getAllTasks(@RequestParam(required = false) Long courseId, HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        List<TaskDto> tasks;
        if (courseId != null) {
            tasks = taskService.getTasksByCourseId(courseId, user.getId());
        } else {
            tasks = taskService.getTasksByUserId(user.getId());
        }
        return ResponseEntity.ok(ApiResponse.success("Danh sách nhiệm vụ", tasks));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskDto>> createTask(@Valid @RequestBody TaskDto dto, HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        TaskDto created = taskService.createTask(dto, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tạo nhiệm vụ thành công", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(@PathVariable Long id, @Valid @RequestBody TaskDto dto, HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        TaskDto updated = taskService.updateTask(id, dto, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Cập nhật nhiệm vụ thành công", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskDto>> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body, HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Trạng thái không hợp lệ"));
        }
        TaskDto updated = taskService.updateTaskStatus(id, status, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái nhiệm vụ thành công", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id, HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        taskService.deleteTask(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Xóa nhiệm vụ thành công", null));
    }
}

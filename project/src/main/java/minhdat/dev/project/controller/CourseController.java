package minhdat.dev.project.controller;

import jakarta.servlet.http.HttpSession;
import minhdat.dev.project.config.AuthInterceptor;
import minhdat.dev.project.dto.ApiResponse;
import minhdat.dev.project.dto.CourseDto;
import minhdat.dev.project.dto.UserResponse;
import minhdat.dev.project.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseDto>>> getAllCourses(HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        List<CourseDto> courses = courseService.getCoursesByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Danh sách môn học", courses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDto>> getCourseById(@PathVariable Long id, HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        CourseDto course = courseService.getCourseById(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Chi tiết môn học", course));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CourseDto>> createCourse(@RequestBody CourseDto dto, HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        CourseDto created = courseService.createCourse(dto, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Thêm môn học thành công", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDto>> updateCourse(@PathVariable Long id, @RequestBody CourseDto dto, HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        CourseDto updated = courseService.updateCourse(id, dto, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Cập nhật môn học thành công", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id, HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        courseService.deleteCourse(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Xóa môn học thành công", null));
    }
}

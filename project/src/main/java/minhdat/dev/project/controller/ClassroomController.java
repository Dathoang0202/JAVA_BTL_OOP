package minhdat.dev.project.controller;

import minhdat.dev.project.dto.ApiResponse;
import minhdat.dev.project.dto.ClassroomDto;
import minhdat.dev.project.service.ClassroomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {

    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClassroomDto>>> getAllClassrooms() {
        List<ClassroomDto> classrooms = classroomService.getAllClassrooms();
        return ResponseEntity.ok(ApiResponse.success("Danh sách lớp học", classrooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassroomDto>> getClassroomById(@PathVariable Long id) {
        ClassroomDto classroom = classroomService.getClassroomById(id);
        return ResponseEntity.ok(ApiResponse.success("Chi tiết lớp học", classroom));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClassroomDto>> createClassroom(@RequestBody ClassroomDto dto) {
        ClassroomDto created = classroomService.createClassroom(dto);
        return ResponseEntity.ok(ApiResponse.success("Thêm lớp học thành công", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassroomDto>> updateClassroom(@PathVariable Long id, @RequestBody ClassroomDto dto) {
        ClassroomDto updated = classroomService.updateClassroom(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lớp học thành công", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClassroom(@PathVariable Long id) {
        classroomService.deleteClassroom(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa lớp học thành công", null));
    }
}

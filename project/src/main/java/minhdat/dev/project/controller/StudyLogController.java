package minhdat.dev.project.controller;

import jakarta.servlet.http.HttpSession;
import minhdat.dev.project.config.AuthInterceptor;
import minhdat.dev.project.dto.ApiResponse;
import minhdat.dev.project.dto.StudyLogDto;
import minhdat.dev.project.dto.UserResponse;
import minhdat.dev.project.service.StudyLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/studylogs")
public class StudyLogController {

    private final StudyLogService studyLogService;

    public StudyLogController(StudyLogService studyLogService) {
        this.studyLogService = studyLogService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudyLogDto>>> getLogs(HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        List<StudyLogDto> logs = studyLogService.getStudyLogsByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Lịch sử học tập", logs));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudyLogDto>> addLog(@RequestBody StudyLogDto dto, HttpSession session) {
        UserResponse user = AuthInterceptor.getLoggedInUser(session);
        StudyLogDto created = studyLogService.addStudyLog(dto, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Lưu nhật ký học tập thành công", created));
    }
}

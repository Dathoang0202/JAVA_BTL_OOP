package minhdat.dev.project.service;

import minhdat.dev.project.dto.StudyLogDto;
import minhdat.dev.project.entity.StudyLog;
import minhdat.dev.project.entity.Task;
import minhdat.dev.project.repository.StudyLogRepository;
import minhdat.dev.project.repository.TaskRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudyLogService {

    private final StudyLogRepository studyLogRepository;
    private final TaskRepository taskRepository;

    public StudyLogService(StudyLogRepository studyLogRepository, TaskRepository taskRepository) {
        this.studyLogRepository = studyLogRepository;
        this.taskRepository = taskRepository;
    }

    public List<StudyLogDto> getStudyLogsByUserId(Long userId) {
        List<StudyLog> logs = studyLogRepository.findByUserIdOrderByLogDateDesc(userId);
        return logs.stream().map(this::mapToStudyLogDto).toList();
    }

    @Transactional
    public StudyLogDto addStudyLog(StudyLogDto dto, Long userId) {
        if (dto.getDurationMinutes() == null || dto.getDurationMinutes() <= 0) {
            throw new IllegalArgumentException("Thời gian học phải lớn hơn 0 phút");
        }
        Task task = null;
        if (dto.getTaskId() != null) {
            task = taskRepository.findByIdAndUserId(dto.getTaskId(), userId)
                    .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhiệm vụ liên kết"));
        }

        StudyLog log = new StudyLog();
        log.setUserId(userId);
        log.setTaskId(dto.getTaskId());
        log.setDurationMinutes(dto.getDurationMinutes());
        log.setNotes(dto.getNotes());

        StudyLog saved = studyLogRepository.save(log);

        // Update task spent hours if taskId is provided
        if (task != null) {
            double addedHours = dto.getDurationMinutes() / 60.0;
            task.setSpentHours((task.getSpentHours() != null ? task.getSpentHours() : 0.0) + addedHours);
            taskRepository.save(task);
        }

        return mapToStudyLogDto(saved);
    }

    public StudyLogDto mapToStudyLogDto(StudyLog log) {
        StudyLogDto dto = new StudyLogDto();
        dto.setId(log.getId());
        dto.setUserId(log.getUserId());
        dto.setTaskId(log.getTaskId());
        dto.setDurationMinutes(log.getDurationMinutes());
        dto.setNotes(log.getNotes());
        dto.setLogDate(log.getLogDate());

        if (log.getTaskId() != null) {
            taskRepository.findByIdAndUserId(log.getTaskId(), log.getUserId())
                    .ifPresent(task -> dto.setTaskTitle(task.getTitle()));
        }

        return dto;
    }
}

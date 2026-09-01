package minhdat.dev.project.service;

import minhdat.dev.project.dto.StudyLogDto;
import minhdat.dev.project.entity.StudyLog;
import minhdat.dev.project.entity.Task;
import minhdat.dev.project.repository.StudyLogRepository;
import minhdat.dev.project.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public StudyLogDto addStudyLog(StudyLogDto dto, Long userId) {
        StudyLog log = new StudyLog();
        log.setUserId(userId);
        log.setTaskId(dto.getTaskId());
        log.setDurationMinutes(dto.getDurationMinutes());
        log.setNotes(dto.getNotes());

        StudyLog saved = studyLogRepository.save(log);

        // Update task spent hours if taskId is provided
        if (dto.getTaskId() != null) {
            Optional<Task> optionalTask = taskRepository.findByIdAndUserId(dto.getTaskId(), userId);
            if (optionalTask.isPresent()) {
                Task task = optionalTask.get();
                double addedHours = dto.getDurationMinutes() / 60.0;
                task.setSpentHours((task.getSpentHours() != null ? task.getSpentHours() : 0.0) + addedHours);
                taskRepository.save(task);
            }
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
            taskRepository.findById(log.getTaskId())
                    .ifPresent(task -> dto.setTaskTitle(task.getTitle()));
        }

        return dto;
    }
}

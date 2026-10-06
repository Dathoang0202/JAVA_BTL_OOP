package minhdat.dev.project.service;

import minhdat.dev.project.dto.TaskDto;
import minhdat.dev.project.entity.Course;
import minhdat.dev.project.entity.Task;
import minhdat.dev.project.repository.CourseRepository;
import minhdat.dev.project.repository.TaskRepository;
import minhdat.dev.project.repository.StudyLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final CourseRepository courseRepository;
    private final StudyLogRepository studyLogRepository;

    public TaskService(TaskRepository taskRepository, CourseRepository courseRepository, StudyLogRepository studyLogRepository) {
        this.taskRepository = taskRepository;
        this.courseRepository = courseRepository;
        this.studyLogRepository = studyLogRepository;
    }

    public List<TaskDto> getTasksByUserId(Long userId) {
        List<Task> tasks = taskRepository.findByUserIdOrderByDueDateAsc(userId);
        return tasks.stream().map(this::mapToTaskDto).toList();
    }

    public List<TaskDto> getTasksByCourseId(Long courseId, Long userId) {
        List<Task> tasks = taskRepository.findByCourseIdAndUserId(courseId, userId);
        return tasks.stream().map(this::mapToTaskDto).toList();
    }

    public TaskDto createTask(TaskDto dto, Long userId) {
        validateTask(dto);
        Course course = courseRepository.findByIdAndUserId(dto.getCourseId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học liên kết"));

        Task task = new Task();
        task.setCourseId(course.getId());
        task.setUserId(userId);
        task.setTitle(dto.getTitle());
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : "TODO");
        task.setEstimatedHours(dto.getEstimatedHours() != null ? dto.getEstimatedHours() : 1.0);
        task.setSpentHours(dto.getSpentHours() != null ? dto.getSpentHours() : 0.0);
        task.setDueDate(dto.getDueDate());

        Task saved = taskRepository.save(task);
        return mapToTaskDto(saved);
    }

    public TaskDto updateTask(Long id, TaskDto dto, Long userId) {
        validateTask(dto);
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhiệm vụ"));

        task.setTitle(dto.getTitle());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getStatus() != null) task.setStatus(dto.getStatus());
        if (dto.getEstimatedHours() != null) task.setEstimatedHours(dto.getEstimatedHours());
        if (dto.getSpentHours() != null) task.setSpentHours(dto.getSpentHours());
        if (dto.getDueDate() != null) task.setDueDate(dto.getDueDate());

        Task updated = taskRepository.save(task);
        return mapToTaskDto(updated);
    }

    public TaskDto updateTaskStatus(Long id, String status, Long userId) {
        validateStatus(status);
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhiệm vụ"));

        task.setStatus(status);
        Task updated = taskRepository.save(task);
        return mapToTaskDto(updated);
    }

    @Transactional
    public void deleteTask(Long id, Long userId) {
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhiệm vụ"));
        detachStudyLogs(task.getId());
        taskRepository.delete(task);
    }

    @Transactional
    public void deleteTasksForCourse(Long courseId, Long userId) {
        List<Task> tasks = taskRepository.findByCourseIdAndUserIdOrderByIdAsc(courseId, userId);
        for (Task task : tasks) {
            detachStudyLogs(task.getId());
        }
        taskRepository.deleteAll(tasks);
    }

    private void detachStudyLogs(Long taskId) {
        var logs = studyLogRepository.findByTaskId(taskId);
        logs.forEach(log -> log.setTaskId(null));
        studyLogRepository.saveAll(logs);
    }

    private void validateTask(TaskDto dto) {
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new IllegalArgumentException("Tên nhiệm vụ không được để trống");
        }
        if (dto.getPriority() != null && !List.of("HIGH", "MEDIUM", "LOW").contains(dto.getPriority())) {
            throw new IllegalArgumentException("Mức ưu tiên không hợp lệ");
        }
        if (dto.getStatus() != null) validateStatus(dto.getStatus());
        if (dto.getEstimatedHours() != null && (!Double.isFinite(dto.getEstimatedHours()) || dto.getEstimatedHours() <= 0)) {
            throw new IllegalArgumentException("Số giờ dự kiến phải lớn hơn 0");
        }
        if (dto.getSpentHours() != null && (!Double.isFinite(dto.getSpentHours()) || dto.getSpentHours() < 0)) {
            throw new IllegalArgumentException("Số giờ đã học không hợp lệ");
        }
    }

    private void validateStatus(String status) {
        if (!List.of("TODO", "IN_PROGRESS", "COMPLETED").contains(status)) {
            throw new IllegalArgumentException("Trạng thái nhiệm vụ không hợp lệ");
        }
    }

    public TaskDto mapToTaskDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setCourseId(task.getCourseId());
        dto.setUserId(task.getUserId());
        dto.setTitle(task.getTitle());
        dto.setPriority(task.getPriority());
        dto.setStatus(task.getStatus());
        dto.setEstimatedHours(task.getEstimatedHours());
        dto.setSpentHours(task.getSpentHours());
        dto.setDueDate(task.getDueDate());
        dto.setCreatedAt(task.getCreatedAt());

        courseRepository.findById(task.getCourseId())
                .ifPresent(course -> dto.setCourseTitle(course.getTitle()));

        return dto;
    }
}

package minhdat.dev.project.service;

import minhdat.dev.project.dto.CourseDto;
import minhdat.dev.project.entity.Course;
import minhdat.dev.project.repository.CourseRepository;
import minhdat.dev.project.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final TaskRepository taskRepository;

    public CourseService(CourseRepository courseRepository, TaskRepository taskRepository) {
        this.courseRepository = courseRepository;
        this.taskRepository = taskRepository;
    }

    public List<CourseDto> getCoursesByUserId(Long userId) {
        List<Course> courses = courseRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return courses.stream().map(this::mapToCourseDto).toList();
    }

    public CourseDto getCourseById(Long id, Long userId) {
        Course course = courseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học"));
        return mapToCourseDto(course);
    }

    public CourseDto createCourse(CourseDto dto, Long userId) {
        Course course = new Course();
        course.setUserId(userId);
        course.setTitle(dto.getTitle());
        course.setCategory(dto.getCategory() != null ? dto.getCategory() : "Tổng hợp");
        course.setDescription(dto.getDescription());
        course.setTargetDate(dto.getTargetDate());
        course.setStatus(dto.getStatus() != null ? dto.getStatus() : "IN_PROGRESS");
        course.setColor(dto.getColor() != null ? dto.getColor() : "#6366f1");

        Course saved = courseRepository.save(course);
        return mapToCourseDto(saved);
    }

    public CourseDto updateCourse(Long id, CourseDto dto, Long userId) {
        Course course = courseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học"));

        course.setTitle(dto.getTitle());
        if (dto.getCategory() != null) course.setCategory(dto.getCategory());
        course.setDescription(dto.getDescription());
        if (dto.getTargetDate() != null) course.setTargetDate(dto.getTargetDate());
        if (dto.getStatus() != null) course.setStatus(dto.getStatus());
        if (dto.getColor() != null) course.setColor(dto.getColor());

        Course updated = courseRepository.save(course);
        return mapToCourseDto(updated);
    }

    public void deleteCourse(Long id, Long userId) {
        Course course = courseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học"));
        courseRepository.delete(course);
    }

    public CourseDto mapToCourseDto(Course course) {
        CourseDto dto = new CourseDto();
        dto.setId(course.getId());
        dto.setUserId(course.getUserId());
        dto.setTitle(course.getTitle());
        dto.setCategory(course.getCategory());
        dto.setDescription(course.getDescription());
        dto.setTargetDate(course.getTargetDate());
        dto.setStatus(course.getStatus());
        dto.setColor(course.getColor());
        dto.setCreatedAt(course.getCreatedAt());

        // Calculate progress % based on tasks
        long totalTasks = taskRepository.countByCourseId(course.getId());
        long completedTasks = taskRepository.countByCourseIdAndStatus(course.getId(), "COMPLETED");

        dto.setTotalTasks((int) totalTasks);
        dto.setCompletedTasks((int) completedTasks);

        if (totalTasks > 0) {
            double percentage = ((double) completedTasks / totalTasks) * 100.0;
            dto.setProgressPercentage(Math.round(percentage * 10.0) / 10.0);
        } else {
            dto.setProgressPercentage(0.0);
        }

        return dto;
    }
}

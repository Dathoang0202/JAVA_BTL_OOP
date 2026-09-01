package minhdat.dev.project.service;

import minhdat.dev.project.dto.CourseDto;
import minhdat.dev.project.dto.DashboardSummaryDto;
import minhdat.dev.project.dto.TaskDto;
import minhdat.dev.project.repository.CourseRepository;
import minhdat.dev.project.repository.StudyLogRepository;
import minhdat.dev.project.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final CourseRepository courseRepository;
    private final TaskRepository taskRepository;
    private final StudyLogRepository studyLogRepository;
    private final CourseService courseService;
    private final TaskService taskService;

    public DashboardService(CourseRepository courseRepository,
                            TaskRepository taskRepository,
                            StudyLogRepository studyLogRepository,
                            CourseService courseService,
                            TaskService taskService) {
        this.courseRepository = courseRepository;
        this.taskRepository = taskRepository;
        this.studyLogRepository = studyLogRepository;
        this.courseService = courseService;
        this.taskService = taskService;
    }

    public DashboardSummaryDto getDashboardSummary(Long userId) {
        DashboardSummaryDto dto = new DashboardSummaryDto();

        long totalCourses = courseRepository.countByUserId(userId);
        long totalTasks = taskRepository.countByUserId(userId);
        long completedTasks = taskRepository.countByUserIdAndStatus(userId, "COMPLETED");
        long inProgressTasks = taskRepository.countByUserIdAndStatus(userId, "IN_PROGRESS");
        long todoTasks = taskRepository.countByUserIdAndStatus(userId, "TODO");

        double overallCompletionRate = totalTasks > 0 ? ((double) completedTasks / totalTasks) * 100.0 : 0.0;
        overallCompletionRate = Math.round(overallCompletionRate * 10.0) / 10.0;

        Long totalMinutes = studyLogRepository.sumDurationMinutesByUserId(userId);
        double totalStudyHours = Math.round((totalMinutes / 60.0) * 10.0) / 10.0;

        List<CourseDto> recentCourses = courseService.getCoursesByUserId(userId);
        List<TaskDto> upcomingTasks = taskService.getTasksByUserId(userId);

        dto.setTotalCourses(totalCourses);
        dto.setTotalTasks(totalTasks);
        dto.setCompletedTasks(completedTasks);
        dto.setInProgressTasks(inProgressTasks);
        dto.setTodoTasks(todoTasks);
        dto.setOverallCompletionRate(overallCompletionRate);
        dto.setTotalStudyHours(totalStudyHours);
        dto.setRecentCourses(recentCourses);
        dto.setUpcomingTasks(upcomingTasks);

        return dto;
    }
}

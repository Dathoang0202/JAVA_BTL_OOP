package minhdat.dev.project.dto;

import java.util.List;

public class DashboardSummaryDto {

    private long totalCourses;
    private long totalTasks;
    private long completedTasks;
    private long inProgressTasks;
    private long todoTasks;
    private double overallCompletionRate; // Percentage 0 - 100
    private double totalStudyHours;
    
    private List<CourseDto> recentCourses;
    private List<TaskDto> upcomingTasks;

    public DashboardSummaryDto() {}

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getTodoTasks() {
        return todoTasks;
    }

    public void setTodoTasks(long todoTasks) {
        this.todoTasks = todoTasks;
    }

    public double getOverallCompletionRate() {
        return overallCompletionRate;
    }

    public void setOverallCompletionRate(double overallCompletionRate) {
        this.overallCompletionRate = overallCompletionRate;
    }

    public double getTotalStudyHours() {
        return totalStudyHours;
    }

    public void setTotalStudyHours(double totalStudyHours) {
        this.totalStudyHours = totalStudyHours;
    }

    public List<CourseDto> getRecentCourses() {
        return recentCourses;
    }

    public void setRecentCourses(List<CourseDto> recentCourses) {
        this.recentCourses = recentCourses;
    }

    public List<TaskDto> getUpcomingTasks() {
        return upcomingTasks;
    }

    public void setUpcomingTasks(List<TaskDto> upcomingTasks) {
        this.upcomingTasks = upcomingTasks;
    }
}

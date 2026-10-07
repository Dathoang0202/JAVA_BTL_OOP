package minhdat.dev.project.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDto {

    private Long id;
    @NotNull(message = "Vui lòng chọn môn học")
    private Long courseId;
    private String courseTitle;
    private Long userId;
    @NotBlank(message = "Tên bài tập không được để trống")
    @Size(max = 200, message = "Tên bài tập không được vượt quá 200 ký tự")
    private String title;
    @NotBlank(message = "Vui lòng chọn mức độ ưu tiên")
    @Pattern(regexp = "HIGH|MEDIUM|LOW", message = "Mức độ ưu tiên không hợp lệ")
    private String priority;
    @NotBlank(message = "Vui lòng chọn trạng thái nhiệm vụ")
    @Pattern(regexp = "TODO|IN_PROGRESS|COMPLETED", message = "Trạng thái nhiệm vụ không hợp lệ")
    private String status;
    @NotNull(message = "Vui lòng nhập số giờ dự kiến")
    @DecimalMin(value = "0.5", message = "Giờ dự kiến phải từ 0.5 giờ trở lên")
    private Double estimatedHours;
    @DecimalMin(value = "0.0", message = "Giờ đã học không được âm")
    private Double spentHours;
    private LocalDate dueDate;
    private LocalDateTime createdAt;

    public TaskDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(Double estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public Double getSpentHours() {
        return spentHours;
    }

    public void setSpentHours(Double spentHours) {
        this.spentHours = spentHours;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

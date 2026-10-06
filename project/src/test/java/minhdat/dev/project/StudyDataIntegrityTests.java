package minhdat.dev.project;

import minhdat.dev.project.dto.CourseDto;
import minhdat.dev.project.dto.StudyLogDto;
import minhdat.dev.project.dto.TaskDto;
import minhdat.dev.project.entity.User;
import minhdat.dev.project.repository.StudyLogRepository;
import minhdat.dev.project.repository.TaskRepository;
import minhdat.dev.project.repository.UserRepository;
import minhdat.dev.project.service.CourseService;
import minhdat.dev.project.service.StudyLogService;
import minhdat.dev.project.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("h2")
@SpringBootTest(properties = {"spring.sql.init.mode=never", "spring.jpa.hibernate.ddl-auto=create-drop"})
@Transactional
class StudyDataIntegrityTests {

    @Autowired UserRepository userRepository;
    @Autowired CourseService courseService;
    @Autowired TaskService taskService;
    @Autowired StudyLogService studyLogService;
    @Autowired TaskRepository taskRepository;
    @Autowired StudyLogRepository studyLogRepository;

    @Test
    void deletingCourseRemovesTasksAndKeepsStudyHistory() {
        Long userId = createUser("owner");
        CourseDto course = new CourseDto();
        course.setTitle("Java");
        Long courseId = courseService.createCourse(course, userId).getId();

        TaskDto task = new TaskDto();
        task.setCourseId(courseId);
        task.setTitle("Bài tập 1");
        Long taskId = taskService.createTask(task, userId).getId();

        StudyLogDto log = new StudyLogDto();
        log.setTaskId(taskId);
        log.setDurationMinutes(30);
        Long logId = studyLogService.addStudyLog(log, userId).getId();

        courseService.deleteCourse(courseId, userId);

        assertFalse(taskRepository.existsById(taskId));
        assertNull(studyLogRepository.findById(logId).orElseThrow().getTaskId());
    }

    @Test
    void studyLogCannotAttachToAnotherUsersTask() {
        Long ownerId = createUser("taskowner");
        Long otherId = createUser("other");
        CourseDto course = new CourseDto();
        course.setTitle("Java");
        Long courseId = courseService.createCourse(course, ownerId).getId();
        TaskDto task = new TaskDto();
        task.setCourseId(courseId);
        task.setTitle("Riêng tư");
        Long taskId = taskService.createTask(task, ownerId).getId();

        StudyLogDto log = new StudyLogDto();
        log.setTaskId(taskId);
        log.setDurationMinutes(30);

        assertThrows(IllegalArgumentException.class, () -> studyLogService.addStudyLog(log, otherId));
        assertTrue(studyLogRepository.findByUserIdOrderByLogDateDesc(otherId).isEmpty());
    }

    private Long createUser(String name) {
        User user = new User();
        user.setUsername(name);
        user.setEmail(name + "@example.com");
        user.setFullName(name);
        user.setPassword("unused");
        return userRepository.save(user).getId();
    }
}

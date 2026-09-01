package minhdat.dev.project.repository;

import minhdat.dev.project.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserIdOrderByDueDateAsc(Long userId);

    List<Task> findByCourseId(Long courseId);

    List<Task> findByCourseIdAndUserId(Long courseId, Long userId);

    Optional<Task> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, String status);

    long countByCourseId(Long courseId);

    long countByCourseIdAndStatus(Long courseId, String status);
}

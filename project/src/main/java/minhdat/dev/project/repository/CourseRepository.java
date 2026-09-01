package minhdat.dev.project.repository;

import minhdat.dev.project.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Course> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);
}

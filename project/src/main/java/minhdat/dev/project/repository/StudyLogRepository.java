package minhdat.dev.project.repository;

import minhdat.dev.project.entity.StudyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyLogRepository extends JpaRepository<StudyLog, Long> {

    List<StudyLog> findByUserIdOrderByLogDateDesc(Long userId);

    List<StudyLog> findByTaskId(Long taskId);

    @Query("SELECT COALESCE(SUM(s.durationMinutes), 0) FROM StudyLog s WHERE s.userId = :userId")
    Long sumDurationMinutesByUserId(@Param("userId") Long userId);
}

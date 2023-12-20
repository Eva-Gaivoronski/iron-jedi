package com.example.triviaApplication.repositories;

import com.example.triviaApplication.models.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByUserId(Long userId);
    @Modifying
    @Query("DELETE FROM Quiz q WHERE q.id = :quizId AND q.user.id = :userId")
    void deleteByIdAndUserId(@Param("quizId") Long quizId, @Param("userId") Long userId);
}

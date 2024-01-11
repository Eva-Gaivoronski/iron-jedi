package com.example.triviaApplication.repositories;

import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.models.Quiz;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByUserId(Long userId);
    Quiz findByIdAndUserId(Long id, Long userId);

    // Update quiz
    @Modifying
    @Query("UPDATE Quiz q SET q.title = :title WHERE q.id = :id")
    void updateQuiz(@Param("id") Long id, @Param("title") String title);

    @Modifying
    @Query("DELETE FROM Quiz q WHERE q.id = :quizId AND q.user.id = :userId")
    void deleteByIdAndUserId(@Param("quizId") Long quizId, @Param("userId") Long userId);

    @Query("SELECT q FROM Quiz q JOIN FETCH q.questions WHERE q.id = :quizId")
    Optional<Quiz> findByIdWithQuestions(@Param("quizId") Long quizId);

}


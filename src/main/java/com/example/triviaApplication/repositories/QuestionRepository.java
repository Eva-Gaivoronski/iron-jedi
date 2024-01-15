package com.example.triviaApplication.repositories;

import com.example.triviaApplication.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.transaction.Transactional;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findQuestionsByUserUsername(String username);

    // New method to find questions by user ID
    @Query("SELECT q FROM Question q WHERE q.user.id = :userId")
    List<Question> findQuestionsByUserId(@Param("userId") Long userId);

    @Query("SELECT q FROM Question q JOIN q.answers a WHERE q.user.username = :username AND (q.text LIKE %:keyword% OR a.text LIKE %:keyword%)")
    List<Question> searchByUserAndKeyword(@Param("username") String username, @Param("keyword") String keyword);

    // Method to add a question to a quiz
    @Modifying
    @Query(value = "UPDATE question q SET q.quiz_id = :quizId WHERE q.id = :questionId", nativeQuery = true)
    @Transactional
    void addQuestionToQuiz(@Param("quizId") Long quizId, @Param("questionId") Long questionId);
}
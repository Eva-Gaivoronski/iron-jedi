package com.example.triviaApplication.repositories;

import com.example.triviaApplication.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    // Method to find questions by username
    List<Question> findQuestionsByUserUsername(String username);

    @Modifying
    @Query(value = "UPDATE Question SET quiz_id = :quizId WHERE id = :questionID", nativeQuery = true)
    void addQuestionToQuiz(@Param("quizId") Long quizId, @Param("questionID") Long questionID);
}
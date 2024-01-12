package com.example.triviaApplication.repositories;

import com.example.triviaApplication.models.Question;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    // Method to find questions by username
    List<Question> findQuestionsByUserUsername(String username);

    //Iryna changed
    @Modifying
    @Query(value = "UPDATE Question q SET q.quiz_id = :quizId WHERE q.id = :questionId", nativeQuery = true)
    @Transactional
    void addQuestionToQuiz(@Param("quizId") Long quizId, @Param("questionId") Long questionId);

        //Iryna changed end
}
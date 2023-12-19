package com.example.triviaApplication.repositories;

import com.example.triviaApplication.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    // Method to find questions by username
    List<Question> findQuestionsByUserUsername(String username);
}
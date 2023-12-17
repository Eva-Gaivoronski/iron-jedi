package com.example.triviaApplication.repositories;

import com.example.triviaApplication.models.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
}
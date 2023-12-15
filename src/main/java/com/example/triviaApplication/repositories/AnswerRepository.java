package com.example.triviaApplication.repositories;


import com.example.triviaApplication.models.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
}

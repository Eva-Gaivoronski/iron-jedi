package com.example.triviaApplication.repositories;

import com.example.triviaApplication.models.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // Import Repository annotation
import jakarta.transaction.Transactional; // Use only Jakarta Transactional
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    Optional<Answer> findById(Long id);
}
package com.example.triviaApplication.repositories;

import com.example.triviaApplication.models.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Interface for CRUD operations on a repository for the Answer entity.
 * It extends JpaRepository which provides JPA related methods for standard data access.
 */
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    // This interface currently does not define any additional methods.
    // It relies on the standard methods provided by JpaRepository.
}
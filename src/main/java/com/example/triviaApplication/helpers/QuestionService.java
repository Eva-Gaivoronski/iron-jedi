package com.example.triviaApplication.helpers;

import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.QuestionRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

/**
 * Service class for handling question-related operations.
 */
@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    /**
     * Constructor to autowire the QuestionRepository and UserRepository.
     */
    @Autowired
    public QuestionService(QuestionRepository questionRepository, UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    /**
     * Method to create or update a question.
     */
    @Transactional
    public Question createOrUpdateQuestion(Question question) {
        // Ensure a user is associated with the question
        if (question.getUser() == null || question.getUser().getUsername() == null) {
            throw new IllegalArgumentException("User information must be provided for the question");
        }

        // Check if the user already exists in the database
        String username = question.getUser().getUsername();
        Optional<User> existingUser = userRepository.findByUsername(username);

        if (existingUser.isEmpty()) {
            // If the user doesn't exist, create a new user
            User newUser = new User();
            newUser.setUsername(username);
            userRepository.save(newUser);
            question.setUser(newUser);
        } else {
            // If the user exists, associate the existing user with the question
            question.setUser(existingUser.get());
        }

        // Validate the question's content
        validateQuestion(question);
        // Save the question to the repository (database)
        return questionRepository.save(question);
    }

    /**
     * Validates the provided question.
     */
    private void validateQuestion(Question question) {
        if (question.getText() == null || question.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("Question text cannot be empty");
        }
    }

    /**
     * Finds a question by its ID.
     */
    public Question findQuestionById(Long id) {
        return questionRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Question not found with id: " + id));
    }

    /**
     * Deletes a question by its ID.
     */
    @Transactional
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    /**
     * Finds all questions associated with a specific user ID.
     */
    public List<Question> findQuestionsByUserId(Long userId) {
        return questionRepository.findQuestionsByUserId(userId);
    }

    /**
     * Searches questions based on a keyword and a user ID.
     */
    public List<Question> searchQuestions(String keyword, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        return questionRepository.findByKeywordAndUserId(keyword, userId);
    }
}
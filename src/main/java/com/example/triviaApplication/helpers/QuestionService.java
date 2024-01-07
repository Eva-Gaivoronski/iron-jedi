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

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;  // Add UserRepository dependency

    @Autowired
    public QuestionService(QuestionRepository questionRepository, UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;  // Initialize UserRepository
    }

    @Transactional
    public Question createOrUpdateQuestion(Question question) {
        if (question.getUser() != null && question.getUser().getUsername() != null) {
            // Look up User by username
            User user = userRepository.findByUsername(question.getUser().getUsername())
                    .orElseThrow(() -> new NoSuchElementException("User not found with username: " + question.getUser().getUsername()));
            question.setUser(user);
        } else {
            throw new IllegalArgumentException("User information must be provided for the question");
        }

        // Handle answers if necessary, e.g., setting the question for each answer

        return questionRepository.save(question);
    }

    public List<Question> findAllQuestions() {
        // Logic to retrieve all questions
        return questionRepository.findAll();
    }

    public Question findQuestionById(Long id) {
        // Logic to find a question by its ID
        return questionRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Question not found with id: " + id));
    }

    @Transactional
    public void deleteQuestion(Long id) {
        // Logic to delete a question
        questionRepository.deleteById(id);
    }

    public List<Question> findQuestionsByUserUsername(String username) {
        // Logic to find questions by a specific user's username
        return questionRepository.findQuestionsByUserUsername(username);
    }

    // Additional methods as required for business logic
}
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

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    @Autowired
    public QuestionService(QuestionRepository questionRepository, UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Question createOrUpdateQuestion(Question question) {
        // Check if the user is provided
        if (question.getUser() == null || question.getUser().getUsername() == null) {
            throw new IllegalArgumentException("User information must be provided for the question");
        }

        // Check if the user already exists
        String username = question.getUser().getUsername();
        Optional<User> existingUser = userRepository.findByUsername(username);

        if (existingUser.isEmpty()) {
            // User does not exist, create a new user
            User newUser = new User();
            newUser.setUsername(username);
            // Set other user properties if necessary
            userRepository.save(newUser);
            question.setUser(newUser);
        } else {
            // User exists, set the user to the existing one
            question.setUser(existingUser.get());
        }

        // Validate and save the question
        validateQuestion(question);
        return questionRepository.save(question);
    }

    private void validateQuestion(Question question) {
        // Validation logic for the question
        // For example, check if the question text is not empty
        if (question.getText() ==null || question.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("Question text cannot be empty");
        }
        // Check other necessary validations as per your requirements
    }

    public Question findQuestionById(Long id) {
        return questionRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Question not found with id: " + id));
    }

    @Transactional
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

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
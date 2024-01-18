package com.example.triviaApplication.helpers;

import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.QuestionRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
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
        // Retrieve the username from the security context
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent()) {
            question.setUser(user.get());
        } else {
            throw new NoSuchElementException("Logged-in user not found");
        }

        // Validate and save the question
        validateQuestion(question);
        return questionRepository.save(question);
    }

    private void validateQuestion(Question question) {
        if (question.getText() == null || question.getText().trim().isEmpty()) {
            throw new IllegalArgumentException("Question text cannot be empty");
        }
        // Additional validation as per your requirements
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


}
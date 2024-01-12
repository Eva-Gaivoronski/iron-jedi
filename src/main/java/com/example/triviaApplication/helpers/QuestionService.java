package com.example.triviaApplication.helpers;

import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.models.Answer;
import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.QuestionRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.NoSuchElementException;
import java.util.List;

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
        if (question.getUser() != null && question.getUser().getUsername() != null) {
            User user = userRepository.findByUsername(question.getUser().getUsername())
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setUsername(question.getUser().getUsername());
                        return userRepository.save(newUser);
                    });
            question.setUser(user);
        } else {
            throw new IllegalArgumentException("User information must be provided for the question");
        }

        int correctAnswerCount = 0;
        for (Answer answer : question.getAnswers()) {
            System.out.println("Answer text: " + answer.getText() + ", isCorrect: " + answer.getIsCorrect());
            if (answer.getIsCorrect()) {
                correctAnswerCount++;
            }
            answer.setQuestion(question); // Set the parent question for each answer
        }

        if (correctAnswerCount != 1) {
            throw new IllegalArgumentException("There must be exactly one correct answer for the question");
        }

        return questionRepository.save(question);
    }
    public List<Question> findAllQuestions() {return questionRepository.findAll();
    }

    public Question findQuestionById(Long id) {
        return questionRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("Question not found with id: " + id));
    }

    @Transactional
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public List<Question> findQuestionsByUserUsername(String username) {
        return questionRepository.findQuestionsByUserUsername(username);
    }

    // Additional methods as required for business logic
}
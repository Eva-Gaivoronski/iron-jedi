package com.example.triviaApplication.helpers;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.models.Answer;
import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.QuestionRepository;
import com.example.triviaApplication.repositories.AnswerRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class QuestionService {
    @PersistenceContext
    private EntityManager entityManager;

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository, AnswerRepository answerRepository, UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Question createOrUpdateQuestion(Question question) {
        if (question.getId() != null) {
            return updateQuestion(question);
        } else {
            return createQuestion(question);
        }
    }

    private Question createQuestion(Question question) {
        setUserForQuestion(question);
        validateCorrectAnswerCount(question);
        return questionRepository.save(question);
    }

    private Question updateQuestion(Question updatedQuestion) {
        Question existingQuestion = questionRepository.findById(updatedQuestion.getId())
                .orElseThrow(() -> new NoSuchElementException("Question not found with id: " + updatedQuestion.getId()));

        existingQuestion.setText(updatedQuestion.getText());
        handleAnswers(existingQuestion, updatedQuestion.getAnswers());
        return questionRepository.save(existingQuestion);
    }

    private void handleAnswers(Question question, List<Answer> updatedAnswers) {
        Map<Long, Answer> existingAnswersMap = question.getAnswers().stream()
                .collect(Collectors.toMap(Answer::getId, answer -> answer));
        List<Answer> mergedAnswers = new ArrayList<>();

        for (Answer updatedAnswer : updatedAnswers) {
            if (updatedAnswer.getId() != null && existingAnswersMap.containsKey(updatedAnswer.getId())) {
                Answer existingAnswer = existingAnswersMap.get(updatedAnswer.getId());
                existingAnswer.setText(updatedAnswer.getText());
                existingAnswer.setIsCorrect(updatedAnswer.getIsCorrect());
                mergedAnswers.add(existingAnswer);
            } else {
                updatedAnswer.setQuestion(question);
                mergedAnswers.add(updatedAnswer);
            }
        }
        question.setAnswers(mergedAnswers);
    }

    private void setUserForQuestion(Question question) {
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
    }

    private void validateCorrectAnswerCount(Question question) {
        long correctAnswerCount = question.getAnswers().stream()
                .filter(Answer::getIsCorrect)
                .count();
        if (correctAnswerCount != 1) {
            throw new IllegalArgumentException("There must be exactly one correct answer for the question");
        }
    }

    public List<Question> findAllQuestions() {
        return questionRepository.findAll();
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
}
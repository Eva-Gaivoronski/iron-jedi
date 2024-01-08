package com.example.triviaApplication.helpers;

import com.example.triviaApplication.models.*;
import com.example.triviaApplication.repositories.QuizRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class QuizService {

    private static final Logger log = LoggerFactory.getLogger(QuizService.class);

    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private UserRepository userRepository;

    public Quiz createQuiz(Quiz quiz, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + userId));
        quiz.setUser(user);
        return quizRepository.save(quiz);
    }

    public Quiz updateQuiz(Long quizId, Quiz updatedQuiz) {
        Quiz existingQuiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));
        existingQuiz.setTitle(updatedQuiz.getTitle());
        existingQuiz.setCategory(updatedQuiz.getCategory());
        return quizRepository.save(existingQuiz);
    }

    public Quiz getQuizForTaking(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));

        for (Question question : quiz.getQuestions()) {
            Collections.shuffle(question.getAnswers());
        }

        return quiz;
    }

    public QuizResult submitQuiz(Long quizId, List<UserAnswer> userAnswers) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));

        if (quiz.isSubmitted()) {
            throw new IllegalStateException("Quiz has already been submitted.");
        }

        int correctAnswers = calculateScore(quiz.getQuestions(), userAnswers);
        double percentage = (double) correctAnswers / quiz.getQuestions().size() * 100;
        quiz.setSubmitted(true);
        quiz.setScore(correctAnswers);
        quizRepository.save(quiz);

        return new QuizResult(correctAnswers, percentage);
    }

    private int calculateScore(List<Question> questions, List<UserAnswer> userAnswers) {
        int correctAnswers = 0;

        for (UserAnswer userAnswer : userAnswers) {
            for (Question question : questions) {
                if (question.getId().equals(userAnswer.getQuestionId())) {
                    Answer correctAnswer = question.getAnswers().stream()
                            .filter(Answer::getIsCorrect)
                            .findFirst()
                            .orElse(null);

                    if (correctAnswer != null && correctAnswer.getId().equals(userAnswer.getSelectedAnswer())) {
                        correctAnswers++;
                    }
                }
            }
        }
        return correctAnswers;
    }
}
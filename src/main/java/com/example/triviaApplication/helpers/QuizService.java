package com.example.triviaApplication.helpers;

import com.example.triviaApplication.models.*;
import com.example.triviaApplication.repositories.QuestionRepository;
import com.example.triviaApplication.repositories.QuizRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class QuizService {

    private static final Logger log = LoggerFactory.getLogger(QuizService.class);

    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuestionRepository questionRepository;

    @Transactional
    public Quiz createQuiz(Quiz quiz, Long userId) {
        // Validation logic
        if (quiz.getTitle() == null || quiz.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Quiz title cannot be null or empty.");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new Error("User not found with ID: " + userId));
        quiz.setUser(user);
        quiz.setQuestions(Collections.emptyList());

        return quizRepository.save(quiz);
    }

    public Quiz getQuizById(Long id, Long userId) {
        return quizRepository.findByIdAndUserId(id, userId);
    }

    public Quiz updateQuiz(Long quizId, Quiz updatedQuiz) {
        Quiz existingQuiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));

        existingQuiz.setTitle(updatedQuiz.getTitle());
        existingQuiz.setCategory(updatedQuiz.getCategory());

        return quizRepository.save(existingQuiz);
    }

    public List<Question> getQuestionsForQuiz(Long quizId) {
        return quizRepository.findById(quizId).map(Quiz::getQuestions).orElse(Collections.emptyList());
    }

    @Transactional
    public Quiz removeQuestionFromQuiz(Long quizId, Long questionId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));

        quiz.getQuestions().removeIf(question -> question.getId().equals(questionId));
        return quizRepository.save(quiz);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public List<Quiz> getUserQuiz(Long userId) {
        return quizRepository.findByUserId(userId);
    }

    public Quiz getQuizForTaking(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));

        quiz.getQuestions().forEach(question -> Collections.shuffle(question.getAnswers()));
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

                    Long selectedAnswerId = Long.valueOf(userAnswer.getSelectedAnswer());
                    if (correctAnswer != null && correctAnswer.getId().equals(selectedAnswerId)) {
                        correctAnswers++;
                    }
                }
            }
        }
        return correctAnswers;
    }

    // New method to add a question to a quiz
    @Transactional
    public Quiz addQuestionToQuiz(Long quizId, Long questionId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new NoSuchElementException("Question not found with id: " + questionId));

        if (!quiz.getQuestions().contains(question)) {
            quiz.getQuestions().add(question);
            return quizRepository.save(quiz);
        } else {
            throw new IllegalStateException("Question already exists in the quiz");
        }
    }
}
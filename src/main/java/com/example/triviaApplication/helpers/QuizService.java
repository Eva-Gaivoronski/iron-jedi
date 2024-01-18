package com.example.triviaApplication.helpers;

import com.example.triviaApplication.Validator.QuizValidator;
import com.example.triviaApplication.models.*;
import com.example.triviaApplication.repositories.QuestionRepository;
import com.example.triviaApplication.repositories.QuizAttemptRepository;
import com.example.triviaApplication.repositories.QuizRepository;
import com.example.triviaApplication.repositories.UserRepository;
import io.netty.handler.codec.http.HttpContentEncoder;
import jakarta.persistence.EntityGraph;
import jakarta.persistence.EntityManager;
//import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.BeanPropertyBindingResult;

import java.security.Principal;
import java.util.Collections;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class QuizService {

    private static final Logger log = LoggerFactory.getLogger(QuizService.class); //Kevin

    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    EntityManager em;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private QuizValidator quizValidator;
    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Transactional
    public Quiz createQuiz(Quiz quiz, Long userId) {
        // validation
        quizValidator.validateQuiz(quiz, new BeanPropertyBindingResult(quiz, "quiz"));

        if (quiz.getTitle() == null || quiz.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Quiz title cannot be null or empty.");
        }
        //User
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {throw new Error("User not found with ID: " + userId);}
        quiz.setUser(user);
        quiz.setQuestions(new ArrayList<Question>());

        return quizRepository.save(quiz);}


    public Quiz getQuizById(Long id, Long userId) {
        return quizRepository.findByIdAndUserId(id, userId);}

//update quiz
    public Quiz updateQuiz(Long quizId, Quiz updatedQuiz) {
        Quiz existingQuiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));

        existingQuiz.setTitle(updatedQuiz.getTitle());
        existingQuiz.setCategory(updatedQuiz.getCategory());
        existingQuiz.setDescription(updatedQuiz.getDescription());
        existingQuiz.setRequiredQuestionCount(updatedQuiz.getRequiredQuestionCount());

        return quizRepository.save(existingQuiz);
    }
    public List<Question> getQuestionsForQuiz(Long quizId) {
        return quizRepository.findById(quizId)
                .map(Quiz::getQuestions)
                .orElse(Collections.emptyList());
    }

    @Transactional
    public Quiz removeQuestionFromQuiz(Long quizId, Long questionId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));

        List<Question> updatedQuestions = quiz.getQuestions()
                .stream()
                .filter(question -> !question.getId().equals(questionId))
                .collect(Collectors.toList());

        quiz.setQuestions(updatedQuestions);
        return quizRepository.save(quiz);
    }

        public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public List<Quiz> getUserQuiz(Long userId) {
        return quizRepository.findByUserId(userId);
    }

//     taking quizzes
     public List<QuizAttempt> getUserAttemptForQuiz(Long quizId, Long userId) {
    return quizAttemptRepository.findByQuizIdAndUserId(quizId, userId);
}

    public Quiz getQuizForTaking(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
        //return quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));
        for (Question question : quiz.getQuestions()) {
            Collections.shuffle(question.getAnswers());
        }
        return quiz;
    }

    public QuizResult submitQuiz(Long quizId, List<UserAnswer> userAnswers) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));

//        if (quiz.isSubmitted()) {
//            throw new IllegalStateException("Quiz has already been submitted.");
//        }

        if (quiz.getQuestions() == null || quiz.getQuestions().isEmpty()) {
            throw new IllegalStateException("Cannot submit a quiz with no questions.");
        }

        int correctAnswers = calculateScore(quiz.getQuestions(), userAnswers);
        double percentage = (double) correctAnswers / quiz.getQuestions().size() * 100;
        quiz.setSubmitted(true);
        quiz.setScore(correctAnswers);
        quizRepository.save(quiz);

        // Save the attempt details
        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.setUser(quiz.getUser());
        quizAttempt.setQuiz(quiz);
        quizAttempt.setScore(correctAnswers);
        quizAttempt.setPercentage(percentage);

        quizAttemptRepository.save(quizAttempt);

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
}
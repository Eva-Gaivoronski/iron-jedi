package com.example.triviaApplication.helpers;

import com.example.triviaApplication.models.*;
import com.example.triviaApplication.repositories.QuizRepository;
import com.example.triviaApplication.repositories.UserRepository;
import io.netty.handler.codec.http.HttpContentEncoder;
import jakarta.persistence.EntityGraph;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;


@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    EntityManager em;

    public Quiz createQuiz(Quiz quiz, Long userId) {
        // Input validation
        if (quiz.getTitle() == null || quiz.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Quiz title cannot be null or empty.");
        }
        //User
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {throw new Error("User not found with ID: " + userId);}
        quiz.setUser(user);
        // TODO validation logic for the quiz
        //quiz.setQuestions(new ArrayList<Question>());
        // Set questions to an empty list
        quiz.setQuestions(new ArrayList<>());

        return quizRepository.save(quiz);}
    public Quiz getQuizById(Long id, Long userId) {return quizRepository.findByIdAndUserId(id, userId);}

    public Quiz updateQuiz(Long quizId, Quiz updatedQuiz) {
//         TODO quiz update
        Quiz existingQuiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));
        existingQuiz.setTitle(updatedQuiz.getTitle());
        existingQuiz.setCategory(updatedQuiz.getCategory());
        return quizRepository.save(existingQuiz);}

        public List<Quiz> getAllQuizzes() {
        // TODO logic for retrieving all quizzes
        return quizRepository.findAll();
    }
    public Quiz getQuizById(Long quizId) {
        // TODO logic for retrieving a quiz by ID

        return quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));
    }
//    public Quiz getQuizById(Long quizId) {
//        EntityGraph graph = em.getEntityGraph("quiz-with-questions");
//
//        Quiz quiz = em.find(Quiz.class, quizId);
//
//        return quiz;
//    }
    public List<Quiz> getUserQuiz(Long userId) {
        return quizRepository.findByUserId(userId);
    }
    // taking quizzes
    public Quiz getQuizForTaking(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));
    }
@Transactional
public QuizResult submitQuiz(Long quizId, List<UserAnswer> userAnswers) {
    try {
        System.out.println("Received quiz submission for quizId: " + quizId);
        System.out.println("User answers: " + userAnswers);
        // Retrieve the quiz from the database
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with id: " + quizId));
        // Check if the quiz is in a state that allows submission
        if (quiz.isSubmitted()) {
            throw new IllegalStateException("Quiz has already been submitted.");
        }
        // Validate if the quiz has all the necessary details for scoring (e.g., questions, correct answers)
        if (quiz.getQuestions() == null || quiz.getQuestions().isEmpty()) {
            throw new IllegalStateException("Quiz does not have valid questions for scoring.");
        }
        // Calculate the score and percentage based on user answers
        int correctAnswers = calculateScore(quiz.getQuestions(), userAnswers);
        int totalQuestions = quiz.getQuestions().size();
        double percentage = calculatePercentage(correctAnswers, totalQuestions);
        // Update the quiz entity with submission details
        quiz.setSubmitted(true);
        quiz.setScore(correctAnswers);
        // Save the updated quiz entity
        quizRepository.save(quiz);
        // Return the result (score and percentage)
        return new QuizResult(correctAnswers, percentage);
    } catch (Exception e) {
        // Log the exception for further investigation
        e.printStackTrace();
        throw e;
    }
    }

    // Implement the logic to calculate the score based on user answers and correct answers
    private int calculateScore(List<Question> questions, List<UserAnswer> userAnswers) {
        int correctAnswers = 0;

        // Assuming that UserAnswer contains questionId and selectedAnswer
        for (UserAnswer userAnswer : userAnswers) {
            Optional<Question> question = questions.stream()
                    .filter(q -> q.getId().equals(userAnswer.getQuestionId()))
                    .findFirst();

            if (question.isPresent() && question.get().getCorrectAnswer().equals(userAnswer.getSelectedAnswer())) {
                correctAnswers++;
            }
        }

        return correctAnswers;
    }

    // Implement the logic to calculate the percentage of correct responses
    private double calculatePercentage(int correctAnswers, int totalQuestions) {
        if (totalQuestions == 0) {
            return 0.0;
        }
        return ((double) correctAnswers / totalQuestions) * 100.0;
    }




}
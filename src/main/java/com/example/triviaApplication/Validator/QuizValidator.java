package com.example.triviaApplication.Validator;
import com.example.triviaApplication.models.Answer;
import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.models.Quiz;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;

import java.util.List;

@Component
public class QuizValidator {

    private static final int MAX_QUESTIONS = 100;

    //Quiz
    public static void validateQuiz(Quiz quiz, Errors errors) {
        validateQuizTitle(quiz, errors);
        validateQuizCategory(quiz, errors);
        validateQuizQuestions(quiz, errors);
        validateQuizAnswers(quiz, errors);
    }

    //Title
    private static void validateQuizTitle(Quiz quiz, Errors errors) {
        if (quiz.getTitle() == null || quiz.getTitle().isBlank()) {
            errors.rejectValue("title", "NotBlank", "Title cannot be blank");
        } else if (quiz.getTitle().length() < 3) {
            errors.rejectValue("title", "Size", "Title must be at least 3 characters");
        } else if (quiz.getTitle().length() > 255) {
            errors.rejectValue("title", "Size", "Title must not exceed 255 characters");
        } else if (!quiz.getTitle().matches("^[a-zA-Z0-9\\s]+$")) {
            errors.rejectValue("title", "Pattern", "Title can only contain letters, numbers, and spaces");
        }
    }

    //Category
    private static void validateQuizCategory(Quiz quiz, Errors errors) {
        if (quiz.getCategory() == null || quiz.getCategory().isBlank()) {
            errors.rejectValue("category", "NotBlank", "Category cannot be blank");
        } else {
            String trimmedCategory = quiz.getCategory().trim();

            if (trimmedCategory.length() < 3) {
                errors.rejectValue("category", "Size", "Category must be at least 3 characters");
            } else if (trimmedCategory.length() > 50) {
                errors.rejectValue("category", "Size", "Category must not exceed 50 characters");
            } else if (!trimmedCategory.matches("^[a-zA-Z\\s]+$")) {
                errors.rejectValue("category", "Pattern", "Category can only contain letters and spaces");
            }
        }
    }

    private static void validateQuizQuestions(Quiz quiz, Errors errors) {
        if (quiz.getQuestions() != null) {
            for (Question question : quiz.getQuestions()) {
                if (question.getText() == null || question.getText().isBlank()) {
                    errors.rejectValue("questions", "NotBlank", "Question text cannot be blank");
                }

                if (question.getAnswers() == null || question.getAnswers().isEmpty()) {
                    errors.rejectValue("questions", "MinSize", "Each question must have at least one answer");
                }
                validateQuestionAnswers(question, errors);
            }
        }

        if (quiz.getQuestions() != null && quiz.getQuestions().size() > MAX_QUESTIONS) {
            errors.rejectValue("questions", "MaxSize", "Exceeded the maximum number of questions in a quiz");
        }
    }


    private static void validateQuizAnswers(Quiz quiz, Errors errors) {
        List<Question> questions = quiz.getQuestions();

        if (questions != null) {
            for (Question question : questions) {
                validateQuestionAnswers(question, errors);
            }
        }
    }


    private static void validateQuestionAnswers(Question question, Errors errors) {
        boolean hasCorrectAnswer = false;

        for (Answer answer : question.getAnswers()) {
            if (answer.getText() == null || answer.getText().isBlank()) {
                errors.rejectValue("answers", "NotBlank", "Answer text cannot be blank");
            }

            if (answer.getIsCorrect() != null && answer.getIsCorrect()) {
                hasCorrectAnswer = true;
            }
        }

        if (!hasCorrectAnswer) {
            errors.rejectValue("answers", "MinSize", "Each question must have at least one correct answer");
        }
    }
}
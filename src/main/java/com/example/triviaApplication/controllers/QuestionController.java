package com.example.triviaApplication.controllers;

import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.QuestionRepository;
import com.example.triviaApplication.repositories.UserRepository;
import com.example.triviaApplication.helpers.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/question")
public class QuestionController {

    private final QuizService quizService;
    private static final Logger log = LoggerFactory.getLogger(QuestionController.class);

    @Autowired
    public QuestionController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateQuestion(@RequestBody Question question) {
        try {
            // Log the question and its answers
            log.info("Received question: {}", question.getText());
            question.getAnswers().forEach(answer ->
                    log.info("Answer: {}, isCorrect: {}", answer.getText(), answer.getCorrect())
            );

            // Save the question using the quiz service
            Question savedQuestion = quizService.saveQuestion(question);
            return ResponseEntity.ok(savedQuestion);
        } catch (Exception e) {
            // Log the exception details for debugging
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error saving question: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestion(@PathVariable Long id) {
        return quizService.findQuestionById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            quizService.deleteQuestion(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // Log the exception details for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting question: " + e.getMessage());
        }
    }

}
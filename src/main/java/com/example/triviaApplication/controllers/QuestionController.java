package com.example.triviaApplication.controllers;

import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.helpers.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.NoSuchElementException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/question")
public class QuestionController {

    private final QuestionService questionService;
    private static final Logger log = LoggerFactory.getLogger(QuestionController.class);

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateQuestion(@RequestBody Question question) {
        try {
            log.info("Received question: {}", question.getText());
            question.getAnswers().forEach(answer ->
                    log.info("Answer: {}, isCorrect: {}", answer.getText(), answer.getIsCorrect())
            );
            Question savedQuestion = questionService.createOrUpdateQuestion(question);
            return ResponseEntity.ok(savedQuestion);
        } catch (Exception e) {
            log.error("Error saving question: ", e);
            return ResponseEntity.badRequest().body("Error saving question: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        try {
            question.setId(id);
            Question updatedQuestion = questionService.createOrUpdateQuestion(question);
            return ResponseEntity.ok(updatedQuestion);
        } catch (NoSuchElementException e) {
            log.error("Question not found with id: " + id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error updating question: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating question: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestion(@PathVariable Long id) {
        try {
            Question question = questionService.findQuestionById(id);
            return ResponseEntity.ok(question);
        } catch (NoSuchElementException e) {
            log.error("Question not found with id: " + id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error retrieving question: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving question: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting question: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting question: " + e.getMessage());
        }
    }

    @GetMapping("/users/{userId}/created-questions")
    public ResponseEntity<List<Question>> getQuestionsByUserId(@PathVariable Long userId) {
        try {
            List<Question> questions = questionService.findQuestionsByUserId(userId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            log.error("Error retrieving questions for user id " + userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Question>> searchQuestions(@RequestParam String keyword, @RequestParam Long userId) {
        try {
            List<Question> questions = questionService.searchQuestions(keyword, userId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            log.error("Error searching questions: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
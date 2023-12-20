package com.example.triviaApplication.controllers;

import com.example.triviaApplication.helpers.QuizService;
import com.example.triviaApplication.models.Quiz;
import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.QuizRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/quiz")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuizService quizService;

    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }
    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable Long id) {

        return quizRepository.findById(id).orElse(null);
    }
    @PostMapping
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz newQuiz, @RequestParam Long userId) {
        try {
            Quiz createdQuiz = quizService.createQuiz(newQuiz, userId);
            return new ResponseEntity<>(createdQuiz, HttpStatus.CREATED);
        } catch (Error e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping("/{id}")
    public Quiz updateQuiz(@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
        // Delegate quiz updating to the QuizService
        return quizService.updateQuiz(id, updatedQuiz);}

    @DeleteMapping("/user/{userId}/{quizId}")
    public void deleteUserQuiz(@PathVariable Long userId, @PathVariable Long quizId) {
        // Delete a specific quiz associated with a user
        quizRepository.deleteByIdAndUserId(quizId, userId);
    }
}

package com.example.triviaApplication.controllers;

import com.example.triviaApplication.helpers.QuizService;
import com.example.triviaApplication.helpers.UserService;
import com.example.triviaApplication.models.BaseEntity;
import com.example.triviaApplication.models.Quiz;
import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.QuizRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("http://localhost:8080")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuizService quizService;
    @Autowired
    private UserService userService;

    @GetMapping
    public List<Quiz> getUserQuizzes(Principal principal) {
        Optional<User> user = userService.getUserByUsername(principal.getName());
        return quizService.getUserQuiz(user.get().getId());}
    @GetMapping("/{quizId}")
    public Quiz getQuizById(@PathVariable Long quizId) {return quizRepository.findById(quizId).orElse(null);}
    @PostMapping("/addQuiz/{quizId}")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz newQuiz, @RequestParam Long userId) {
        try { Quiz createdQuiz = quizService.createQuiz(newQuiz, userId);
            return new ResponseEntity<>(createdQuiz, HttpStatus.CREATED);
        } catch (Error e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);}
    }
//    @PutMapping("/{id}")
//    public ResponseEntity<Quiz> updateQuiz(@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
//        // Delegate quiz updating to the QuizService
//        Quiz result = quizService.updateQuiz(id, updatedQuiz);
//        return result != null ?
//                new ResponseEntity<>(result, HttpStatus.OK) :
//                new ResponseEntity<>(HttpStatus.NOT_FOUND);
    @PutMapping("/{quizId}")
    public Quiz updateQuiz(@PathVariable Long quizId, @RequestBody Quiz updatedQuiz) {
        // Delegate quiz updating to the QuizService
        return quizService.updateQuiz(quizId, updatedQuiz);}

    @DeleteMapping("/user/{userId}/{quizId}")
    public void deleteUserQuiz(@PathVariable Long userId, @PathVariable Long quizId) {
        // Delete a specific quiz associated with a user
        quizRepository.deleteByIdAndUserId(quizId, userId);
    }
}


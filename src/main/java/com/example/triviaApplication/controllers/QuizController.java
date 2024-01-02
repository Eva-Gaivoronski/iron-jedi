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
import java.util.NoSuchElementException;
import java.util.Optional;


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
    @Autowired
    private UserService userService;

    @GetMapping("/getQuizzes")
    public ResponseEntity<List<Quiz>> getUserQuizzes() {
        //Optional<User> user = userService.getUserByUsername(principal.getName());
        //return quizService.getUserQuiz(user.get().getId());

        // Get userID from Cookie
        //P changes
//        long userId = 1;
//        return new ResponseEntity<List<Quiz>>(quizService.getUserQuiz(userId), HttpStatus.ACCEPTED);
        return new ResponseEntity<>(quizRepository.findAll(), HttpStatus.ACCEPTED);
    }

    @GetMapping("/{quizId}")
    public Quiz getQuizById(@PathVariable Long quizId) {return quizRepository.findById(quizId).orElse(null);}

    @PostMapping("/quizzes")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz newQuiz) {
        // TODO Get UserId from cookie
        long userId = 1;

        try { Quiz createdQuiz = quizService.createQuiz(newQuiz, userId);
            return new ResponseEntity<>(createdQuiz, HttpStatus.CREATED);
        } catch (Error e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);}
    }

//    @PutMapping("/{quizId}")
//    public Quiz updateQuiz(@PathVariable Long quizId, @RequestBody Quiz updatedQuiz) {
//        // Delegate quiz updating to the QuizService
//        return quizService.updateQuiz(quizId, updatedQuiz);
//    }
@PutMapping("/{quizId}")
public ResponseEntity<Quiz> updateQuiz(@PathVariable Long quizId, @RequestBody Quiz updatedQuiz) {
    try {
        Quiz result = quizService.updateQuiz(quizId, updatedQuiz);
        return new ResponseEntity<>(result, HttpStatus.OK);
    } catch (NoSuchElementException e) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}


    @DeleteMapping("/{quizId}")
    public void deleteUserQuiz(@PathVariable Long quizId) {
        // Delete a specific quiz associated with a user
        quizRepository.deleteById(quizId);
    }
}


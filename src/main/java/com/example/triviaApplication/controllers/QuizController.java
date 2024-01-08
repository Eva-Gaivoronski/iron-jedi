package com.example.triviaApplication.controllers;

import com.example.triviaApplication.helpers.QuizService;
import com.example.triviaApplication.helpers.UserService;
import com.example.triviaApplication.models.*;
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
        // Get userID from Cookie
        //P changes
        return new ResponseEntity<>(quizRepository.findAll(), HttpStatus.ACCEPTED);
    }

    @GetMapping("/{quizId}")
    public Quiz getQuizById(@PathVariable Long quizId) {
        return quizRepository.findById(quizId).orElse(null);}

    //takeQuiz page
    @GetMapping("/takeQuiz/{quizId}")
    public ResponseEntity<Quiz> getQuizForTaking(@PathVariable Long quizId) {
        try {
            // Use quizService or quizRepository to retrieve the quiz by ID
            Quiz quiz = quizService.getQuizForTaking(quizId);
            return new ResponseEntity<>(quiz, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    //Take quiz Submission
    @PostMapping("/submitQuiz/{quizId}")
    @ResponseBody
    public ResponseEntity<Object> submitQuiz(@PathVariable Long quizId, @RequestBody List<UserAnswer> userAnswers) {
        try {
            // Call a service method to handle quiz submission and retrieve the result
            QuizResult quizResult = quizService.submitQuiz(quizId, userAnswers);
            // Return the result in the response
            return new ResponseEntity<>(quizResult, HttpStatus.OK);
        } catch (IllegalStateException e) {
            // Handle IllegalStateException (e.g., quiz already submitted)
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (NoSuchElementException e) {
            // Handle NoSuchElementException (e.g., quiz not found)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // Handle other exceptions
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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


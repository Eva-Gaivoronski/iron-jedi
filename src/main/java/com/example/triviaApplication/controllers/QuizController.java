package com.example.triviaApplication.controllers;

import com.example.triviaApplication.Validator.QuizValidator;
import com.example.triviaApplication.helpers.QuizService;
import com.example.triviaApplication.helpers.UserService;
import com.example.triviaApplication.models.*;
import com.example.triviaApplication.repositories.QuestionRepository;
import com.example.triviaApplication.repositories.QuizRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.web.bind.annotation.*;
import com.example.triviaApplication.models.QuestionAssignmentDTO;

import java.security.Principal;
import java.util.List;
import java.util.NoSuchElementException;


@RestController
@RequestMapping("/quiz")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {
    private static final Logger log = LoggerFactory.getLogger(QuizController.class);

    @Autowired
    private QuizRepository quizRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuizService quizService;
    @Autowired
    private UserService userService;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private QuizValidator quizValidator;


    @GetMapping("/getQuizzes")
    public ResponseEntity<List<Quiz>> getUserQuizzes() {

        return new ResponseEntity<>(quizRepository.findAll(), HttpStatus.ACCEPTED);
    }

    @GetMapping("/{quizId}")
    public Quiz getQuizById(@PathVariable Long quizId) {
        return quizRepository.findById(quizId).orElse(null);}

    //Update quiz with list of questions
    @GetMapping("/questions/{quizId}")
    public ResponseEntity<List<Question>> getQuestionsForQuiz(@PathVariable Long quizId) {
        try {
            List<Question> questions = quizService.getQuestionsForQuiz(quizId);
            return new ResponseEntity<>(questions, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    //takeQuiz page
    @GetMapping("/takeQuiz/{quizId}")
    public ResponseEntity<Quiz> getQuizForTaking(@PathVariable Long quizId) {
        try {
            // Use quizService or quizRepository to retrieve the quiz by ID
            Quiz quiz = quizService.getQuizForTaking(quizId);
            System.out.println("Fetched Quiz for Taking: " + quiz);
            return new ResponseEntity<>(quiz, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //Take quiz Submission
    @PostMapping("/addQuestion/{quizId}")
    public ResponseEntity<Boolean> assignQuestionToQuiz(@PathVariable Long quizId, @RequestBody QuestionAssignmentDTO request){
        try {
            questionRepository.addQuestionToQuiz(quizId, request.getQuestionId());
            // TODO: Do a look-up to ensure it actually updated
            return new ResponseEntity<>(true, HttpStatus.ACCEPTED);
        } catch (Exception e) {
            log.error("Error adding question to quiz: " + e.getMessage());
            return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


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
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz newQuiz, Principal principal) {
        long userId = 1;

        try {
            // Validator
            quizValidator.validateQuiz(newQuiz, new BeanPropertyBindingResult(newQuiz, "newQuiz"));

            Quiz createdQuiz = quizService.createQuiz(newQuiz, userId);
            return new ResponseEntity<>(createdQuiz, HttpStatus.CREATED);
        } catch (Error e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);}
    }

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

    @DeleteMapping("/removeQuestion/{quizId}/{questionId}")
    public ResponseEntity<Quiz> removeQuestionFromQuiz(@PathVariable Long quizId, @PathVariable Long questionId) {
        try {
            Quiz updatedQuiz = quizService.removeQuestionFromQuiz(quizId, questionId);
            return new ResponseEntity<>(updatedQuiz, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
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

import java.security.Principal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;


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

    @GetMapping("/takeQuiz/{quizId}")
    public ResponseEntity<Quiz> getQuizForTaking(@PathVariable Long quizId, Principal principal) {
        try {
            Quiz quiz = quizService.getQuizForTaking(quizId);
            Long userId = getUserIdFromPrincipal(principal);
            List<QuizAttempt> quizAttempt = quizService.getUserAttemptForQuiz(quizId, userId);

            if (!quizAttempt.isEmpty()) {
                QuizAttempt previousAttempt = quizAttempt.get(quizAttempt.size() - 1);
            }
            System.out.println("Fetched Quiz for Taking: " + quiz);
            return new ResponseEntity<>(quiz, HttpStatus.OK);
        } catch (NoSuchElementException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    private Long getUserIdFromPrincipal(Principal principal) {
        String username = principal.getName();
        // Use the UserService to find the user by username
        Optional<User> userOptional = userService.getUserByUsername(username);
        // If the user is present, return the user ID, otherwise return null or handle as needed
        return userOptional.map(User::getId).orElse(null);
    }

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

    //Take quiz Submission
    @PostMapping("/submitQuiz/{quizId}")
    @ResponseBody
    public ResponseEntity<Object> submitQuiz(@PathVariable Long quizId, @RequestBody List<UserAnswer> userAnswers) {
        try {

            QuizResult quizResult = quizService.submitQuiz(quizId, userAnswers);
            return new ResponseEntity<>(quizResult, HttpStatus.OK);
        } catch (IllegalStateException e) {
            System.out.println("quiz already submitted");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (NoSuchElementException e) {
            System.out.println("quiz not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
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


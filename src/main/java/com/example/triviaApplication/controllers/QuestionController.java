package com.example.triviaApplication.controllers;

import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.QuestionRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/question")
public class QuestionController {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    @Autowired
    public QuestionController(QuestionRepository questionRepository, UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createQuestion(@RequestBody Question question) {
        if (question.getUser() != null && question.getUser().getUsername() != null) {

            User user = userRepository.findByUsername(question.getUser().getUsername())
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setUsername(question.getUser().getUsername());
                        return userRepository.save(newUser);
                    });
            question.setUser(user);
        } else {
            return ResponseEntity.badRequest().body("User information is missing");
        }

        Question savedQuestion = questionRepository.save(question);
        return ResponseEntity.ok(savedQuestion);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestion(@PathVariable Long id) {
        Question question = questionRepository.findById(id)
                .orElse(null);
        return question != null ? ResponseEntity.ok(question) : ResponseEntity.notFound().build();
    }


}
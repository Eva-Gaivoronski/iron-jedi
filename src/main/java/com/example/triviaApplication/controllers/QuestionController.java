package com.example.triviaApplication.controllers;

import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.QuestionRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/questions")
public class QuestionController {

    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    @Autowired
    public QuestionController(QuestionRepository questionRepository, UserRepository userRepository) {
        this.questionRepository = questionRepository;
        this.userRepository =userRepository;
    }
    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        if (question.getUser() != null && question.getUser().getUsername() != null) {
        User user = userRepository.findByUsername(question.getUser().getUsername())
        .orElseThrow(() -> new RuntimeException("User not found"));
        question.setUser(user);
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
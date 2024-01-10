package com.example.triviaApplication.controllers;
import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.QuestionRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public UserController(UserRepository userRepository, QuestionRepository questionRepository) {
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{username}/questions")
    public ResponseEntity<List<Question>> getQuestionsByUsername(@PathVariable String username) {
        List<Question> questions = questionRepository.findQuestionsByUserUsername(username);
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/{username}/search")
    public ResponseEntity<List<Question>> searchUserQuestionsByKeyword(@PathVariable String username, @RequestParam String keyword) {
        List<Question> questions = questionRepository.searchByUserAndKeyword(username, keyword);
        return ResponseEntity.ok(questions);
    }
}
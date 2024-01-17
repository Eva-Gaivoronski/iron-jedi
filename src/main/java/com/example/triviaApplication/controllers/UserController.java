package com.example.triviaApplication.controllers;

import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.models.User;
import com.example.triviaApplication.repositories.QuestionRepository;
import com.example.triviaApplication.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/leaderboard")
    public ResponseEntity<List<User>> getUserLeaderboard() {
        List<User> users = userRepository.findAll();

        // Sort users based on the count of questions created by each user
        List<User> sortedUsers = users.stream()
                .sorted(Comparator.comparingInt(user -> ((User) user).getQuestions().size()).reversed())
                .collect(Collectors.toList());


        return ResponseEntity.ok(sortedUsers);
    }
}

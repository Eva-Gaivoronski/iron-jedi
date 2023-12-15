package com.example.triviaApplication.controllers;

import com.example.triviaApplication.models.Question;
import com.example.triviaApplication.repositories.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/questions")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @PostMapping
    public Question createQuestion(@RequestBody Question question) {

        return questionRepository.save(question);
    }

    @GetMapping("/{id}")
    public Question getQuestion(@PathVariable Long id) {

        return questionRepository.findById(id).orElse(null);
    }
}

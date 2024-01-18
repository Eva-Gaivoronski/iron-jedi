package com.example.triviaApplication.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

/**
 * Represents a question entity in the trivia application.
 */
@Entity
@Table(name = "question") // Define the table name for this entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for the question

    private String text; // Text content of the question

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The user who created the question

    // Relationship with the Answer entity. One question can have multiple answers.
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Answer> answers; // List of answers associated with this question

    // Default constructor required by JPA
    public Question() {
    }

    // Additional constructors, getters, and setters below

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    // Other methods and commented-out code (like for Quiz entity) could go here
}
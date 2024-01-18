package com.example.triviaApplication.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    @JsonBackReference
    private Quiz quiz;

    //    @Column(name = "previous_attempt_id")
//    private Long previousAttemptId;
    @Column(name = "attempt_date")
    private LocalDateTime attemptDate;

    public LocalDateTime getAttemptDate() {
        return attemptDate;
    }

    public void setAttemptDate(LocalDateTime attemptDate) {
        this.attemptDate = attemptDate;
    }

    private int score;

    private double percentage;

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

//    public Long getPreviousAttemptId() {
//        return previousAttemptId;
//    }
//
//    public void setPreviousAttemptId(Long previousAttemptId) {
//        this.previousAttemptId = previousAttemptId;
//    }
}
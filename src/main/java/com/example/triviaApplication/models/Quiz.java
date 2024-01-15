package com.example.triviaApplication.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.Length;

import java.util.List;

@Entity
@Table(name="quiz")
public class Quiz extends BaseEntity {

    private String title;
    private String category;
    private boolean submitted;
    private int score;

    private int requiredQuestionCount;

    @Column(length = 4000)
    private String description;

    @NotNull
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "quiz_id")
    private List<Question> questions;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizAttempt> quizAttempts;

    public Quiz() {
        this.title = "";
        this.category = "";
        this.submitted = false;
        this.score = 0;
        this.requiredQuestionCount = 0;
        this.description = "";
    }

    public Quiz(String title, String category) {
        this.submitted = false;
        this.score = 0;
        this.requiredQuestionCount = 0;
        this.description = "";
        this.title = title;
        this.category = category;}

    public String getCategory() {return category;}
    public void setCategory(String category) {this.category = category;}

    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}

    public List<Question> getQuestions() {return questions;}
    public void setQuestions(List<Question> questions) {this.questions = questions;}

    public User getUser() {return this.user;}
    public void setUser(User user) {this.user = user;}

    public boolean isSubmitted() {
        return submitted;
    }
    public void setSubmitted(boolean submitted) {
        this.submitted = submitted;
    }

    public int getScore() {
        return score;
    }
    public void setScore(int score) {
        this.score = score;
    }

    public int getRequiredQuestionCount() {return this.requiredQuestionCount;}
    public void setRequiredQuestionCount(int requiredQuestionCount) {this.requiredQuestionCount = requiredQuestionCount;}

    public String getDescription() {return this.description;}
    public void setDescription(String description) {this.description = description;}
}
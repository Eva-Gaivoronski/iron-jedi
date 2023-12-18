package com.example.triviaApplication.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Entity
public class Quiz extends BaseEntity {

    private String title;
    private String category;
    @NotNull
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<Question> questions;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    public Quiz() {}
    public Quiz(String title, String category) {
        this.title = title;
        this.category = category;}
    public String getCategory() {return category;}
    public void setCategory(String category) {this.category = category;}
    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}
    public List<Question> getQuestions() {return questions;}
    public void setQuestions(List<Question> questions) {this.questions = questions;}
    public void setUser(User user) {this.user = user;}
}

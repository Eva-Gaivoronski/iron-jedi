package com.example.triviaApplication.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Quiz extends BaseEntity {

    private String title;
    private String category;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "quiz")
    private List <Question> questions;

    public Quiz() {}

    public Quiz(String title) {
        this.title = title;
    }

    public Long getId() {
        return super.getId();
    }

    public void setId(Long id) {
        super.setId(id);
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

}
package com.example.triviaApplication.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Entity
@Table(name="quiz")
public class Quiz extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String category;

    @NotNull
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "quiz_id")
    private List<Question> questions;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    public Quiz() {}
    public Quiz(String title, String category) {
        this.title = title;
        this.category = category;}

    private boolean submitted;
    private int score;

    public Long getid() {return this.id;}
    public String getCategory() {return category;}
    public void setCategory(String category) {this.category = category;}
    public String getTitle() {return title;}
    public void setTitle(String title) {this.title = title;}
    public List<Question> getQuestions() {return questions;}
    public void setQuestions(List<Question> questions) {this.questions = questions;}
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

}

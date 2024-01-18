package com.example.triviaApplication.models;

public class QuizResult {
    private int score;
    private double percentage;

    public QuizResult(int score, double percentage) {
        this.score = score;
        this.percentage = percentage;
    }

    public int getScore() {
        return score;
    }

    public double getPercentage() {
        return percentage;
    }
}
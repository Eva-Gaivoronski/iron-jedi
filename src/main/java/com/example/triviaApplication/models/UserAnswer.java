package com.example.triviaApplication.models;

public class UserAnswer {
    private Long questionId;
    private Long selectedAnswer;//Iryna changed - had to change it to Long in order to submit Quiz.

    public UserAnswer() {
    }

    public UserAnswer(Long questionId, Long selectedAnswer) {
        this.questionId = questionId;
        this.selectedAnswer = selectedAnswer;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(Long selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }
}
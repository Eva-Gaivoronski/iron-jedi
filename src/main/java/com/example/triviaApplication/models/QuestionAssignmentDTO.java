package com.example.triviaApplication.models;

/**
 * A Data Transfer Object (DTO) for assigning questions.
 * Mainly used to transfer question IDs between different layers of the application.
 */
public class QuestionAssignmentDTO {
    // Field to store the ID of a question
    private Long questionId;

    /**
     * Retrieves the ID of the question.
     *
     * @return questionId, the ID of the question
     */
    public Long getQuestionId() {
        return questionId;
    }

    /**
     * Sets the ID of the question.
     *
     * @param questionId the ID of the question to set
     */
    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }
}
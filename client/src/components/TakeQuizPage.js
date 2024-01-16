import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import {Alert, Button} from "react-bootstrap";
import { useHistory } from 'react-router-dom';
const TakeQuizPage = () => {
    const [quiz, setQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submissionResult, setSubmissionResult] = useState(null);
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
    const { quizId } = useParams();
    const { userId } = useParams();
    const [showNoQuestionsAlert, setShowNoQuestionsAlert] = useState(false);
    const [showUnansweredQuestionsAlert, setShowUnansweredQuestionsAlert] = useState(false);
    const [previousAttemptScore, setPreviousAttemptScore] = useState(null);
    const [previousAttemptPercentage, setPreviousAttemptPercentage] = useState(null);



    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/quiz/takeQuiz/${quizId}`);
                console.log('Quiz ID:', quizId);
                console.log('Fetched Quiz Data:', response.data);
                setQuiz(response.data);

                // Fetch  previous attempt
                const attemptResponse = await axios.get(`http://localhost:8080/quiz/takeQuiz/${quizId}`);
                console.log('Previous Attempt Data:', attemptResponse.data);
                if (attemptResponse.data) {
                    // Display score
                    const previousAttemptScore = attemptResponse.data.score;
                    const previousAttemptPercentage = attemptResponse.data.percentage;

                    setPreviousAttemptScore(previousAttemptScore);
                    setPreviousAttemptPercentage(previousAttemptPercentage);
                }
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        };

        fetchQuizzes();
    }, [quizId]);

    const handleAnswerSelect = (questionId, selectedOption) => {
        setSelectedAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedOption,
        }));

        console.log('Selected Answers:', selectedAnswers);
    };

    const handleSubmitQuiz = async () => {
        try {
            console.log('Quiz ID:', quizId);
            if (isQuizSubmitted) {
                // TODO Display an alert to inform the user - need to think about better option than alert
                alert('Quiz has already been submitted!');
                return;
            }
            // Check if there are questions in the quiz
            if (!quiz.questions || quiz.questions.length === 0) {
                setShowNoQuestionsAlert(true);
                return;
            }
            // Check if all questions have been answered
            if (
                quiz.questions.some((question) => !selectedAnswers[question.id] && question.answers.length > 0)
            ) {
                setShowUnansweredQuestionsAlert(true);
                return;
            }

            const answersArray = Object.keys(selectedAnswers).map(questionId => ({
                questionId: parseInt(questionId),
                selectedAnswer: selectedAnswers[questionId],
            }));

            console.log('Formatted Answers Array:', answersArray);

            const response = await axios.post(`http://localhost:8080/quiz/submitQuiz/${quizId}`, answersArray);
            setSubmissionResult(response.data);
            setIsQuizSubmitted(true);
        } catch (error) {
            console.error('Failed to submit quiz', error);
        }
    };

    if (!quiz) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4 border border-grey shadow p-3 mb-5 bg-white rounded">
            <h2 className="mb-4 shadow p-2 mb-0 bg-primary-white rounded">Quiz: {quiz.title}</h2>
            <p className=" mb-4 shadow p-2">Category: {quiz.category}</p>

            {previousAttemptScore !== null && (
                <div className="mb-4">
                    <div className="card w-75">
                        <div className="card-body">
                            <h5 className="card-title">Previous Attempt</h5>
                            <p className="card-text">Score: {previousAttemptScore}</p>
                            {previousAttemptPercentage !== undefined && (
                                <p className="card-text">Percentage: {previousAttemptPercentage}%</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <p>You will get 1 point for each correct answer</p>

            {quiz.questions.map(question => (
                <div key={question.id} className="container mt-4 border border-grey shadow p-3 mb-4 bg-white rounded">
                    <h4>{question.text}</h4>
                    {question.answers.length > 0 ? (
                        <ul className="list-unstyled mb-3">
                            {question.answers.map(answer => (
                                <li key={answer.id}>
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name={`question_${question.id}`}
                                            value={answer.id}
                                            checked={selectedAnswers[question.id] === answer.id}
                                            onChange={() => handleAnswerSelect(question.id, answer.id)}
                                        />
                                        {answer.text}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No answers available for this question.</p>
                    )}
                </div>
            ))}


            {!isQuizSubmitted && (
                <Button className="btn btn-primary mb-4 shadow" onClick={handleSubmitQuiz}>
                    Submit Quiz
                </Button>
            )}
            {/* Display feedback */}
            {submissionResult && (
                <div className="mb-4">
                    <div className="alert alert-success" role="alert">
                        <h4 className="alert-heading">Quiz submitted successfully!</h4>
                        <p className="mb-0">Score: {submissionResult.score}</p>
                        <p className="mb-0">Percentage: {submissionResult.percentage}%</p>
                    </div>
                </div>
            )}


            {/* No Questions Alert */}
            <Alert variant="danger" show={showNoQuestionsAlert} onClose={() => setShowNoQuestionsAlert(false)}
                   dismissible>
                No questions available in the quiz. Quiz cannot be submitted.
            </Alert>

            {/* Unanswered Questions Alert */}
            <Alert variant="danger" show={showUnansweredQuestionsAlert}
                   onClose={() => setShowUnansweredQuestionsAlert(false)} dismissible
            >
                Please answer all questions before submitting the quiz.
            </Alert>
        </div>

    );
};


export default TakeQuizPage;

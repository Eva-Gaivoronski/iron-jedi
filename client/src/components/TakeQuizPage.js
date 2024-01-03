import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';

const TakeQuizPage = ({ match }) => {
    const [quiz, setQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submissionResult, setSubmissionResult] = useState(null);
    const { quizId } = useParams();

    useEffect(() => {
        // Fetch quiz data based on quiz ID from the URL parameter
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/quiz/takeQuiz/${quizId}`);
                setQuiz(response.data);
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        };

        fetchQuizzes();
    }, [quizId]);
    console.log('Quiz State:', quiz);

    const handleAnswerSelect = (questionId, selectedOption) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: selectedOption,
        }));
    };

    const handleSubmitQuiz = async () => {
        try {
            console.log('Selected Answers:', selectedAnswers);
            const response = await axios.post(`http://localhost:8080/quiz/submitQuiz/${quizId}`, selectedAnswers);
            // Update state with submission result
            setSubmissionResult(response.data);
        } catch (error) {
            console.error('Failed to submit quiz', error);
        }
    };

    if (!quiz) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2>{quiz.title}</h2>
            <p className="lead">Category: {quiz.category}</p>

            {quiz.questions.map((question) => (
                <div key={question.id} className="mb-4">
                    <h4>{question.text}</h4>
                    <ul className="list-unstyled">
                        <li>
                            <label className="form-check-label">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    value={question.option1}
                                    checked={selectedAnswers[question.id] === question.option1}
                                    onChange={() => handleAnswerSelect(question.id, question.option1)}
                                />
                                {question.option1}
                            </label>
                        </li>
                        <li>
                            <label className="form-check-label">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    value={question.option2}
                                    checked={selectedAnswers[question.id] === question.option2}
                                    onChange={() => handleAnswerSelect(question.id, question.option2)}
                                />
                                {question.option2}
                            </label>
                        </li>
                        <li>
                            <label className="form-check-label">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    value={question.option3}
                                    checked={selectedAnswers[question.id] === question.option3}
                                    onChange={() => handleAnswerSelect(question.id, question.option3)}
                                />
                                {question.option3}
                            </label>
                        </li>
                    </ul>
                </div>
            ))}

            <button className="btn btn-primary" onClick={handleSubmitQuiz}>
                Submit Quiz
            </button>
            {/* Display feedback */}
            {submissionResult && (
                <div>
                    <p>Quiz submitted successfully!</p>
                    <p>Score: {submissionResult.score}</p>
                    <p>Percentage: {submissionResult.percentage}%</p>
                </div>
            )}
        </div>
    );
};

export default TakeQuizPage;

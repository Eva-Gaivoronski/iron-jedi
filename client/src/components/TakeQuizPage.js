import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import {Button, Modal, Table} from "react-bootstrap";

const TakeQuizPage = ({ match }) => {
    const [quiz, setQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submissionResult, setSubmissionResult] = useState(null);
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
    const { quizId } = useParams();

    useEffect(() => {
        // Fetch quiz data based on quiz ID from the URL parameter
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/quiz/takeQuiz/${quizId}`);
                setQuiz(response.data);
                setIsQuizSubmitted(response.data.submitted);
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
                console.log('Quiz ID:', quizId);
                if (isQuizSubmitted) {
                    // TODO Display an alert to inform the user - need to think about better option than alert
                    alert('Quiz has already been submitted!');
                    return;
                }
                const formattedAnswers = Object.keys(selectedAnswers).map((questionId) => ({
                    questionId,
                    selectedAnswer: selectedAnswers[questionId],
                }));
                console.log('Selected Answers:', selectedAnswers);

                const response = await axios.post(`http://localhost:8080/quiz/submitQuiz/${quizId}`, formattedAnswers);
                // Update state with submission result
                setSubmissionResult(response.data);
                setIsQuizSubmitted(true);
            } catch (error) {
                console.error('Failed to submit quiz', error.response.data);
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

            {!isQuizSubmitted && (
            <Button className="btn btn-primary" onClick={handleSubmitQuiz}>
                Submit Quiz
            </Button>
            )}

            {isQuizSubmitted && (
                <div className="mb-4">
                    <div className="alert alert-info" role="alert">
                        <h4 className="alert-heading">Quiz already submitted!</h4>
                    </div>
                </div>
            )}

            {/* Display feedback */}
            {submissionResult && (
                <Modal show={true} onHide={() => setSubmissionResult(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Quiz Submitted Successfully!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Score: {submissionResult.score}</p>
                        <p>Percentage: {submissionResult.percentage}%</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => setSubmissionResult(null)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/*{submissionResult && (*/}
            {/*    <div className="mb-4">*/}
            {/*        <div className="alert alert-success" role="alert">*/}
            {/*        <h4 className="alert-heading">Quiz submitted successfully!</h4>*/}
            {/*        <p className="mb-0">Score: {submissionResult.score}</p>*/}
            {/*        <p className="mb-0">Percentage: {submissionResult.percentage}%</p>*/}
            {/*    </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};



export default TakeQuizPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import {Alert, Button, Card, Carousel, Col, Container, Form, FormGroup, Row} from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import apiClient from '../components/ApiClient';

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

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    useEffect(() => {
        fetchQuizzes()
            .then(() =>{
                return apiClient.get(`http://localhost:8080/quiz/takeQuiz/${quizId}`);
            })
            .then(attemptResponse => {
                if (attemptResponse.data != null) {
                    console.log(attemptResponse.data);


                }
            })
            .catch(error => {
                console.error('Error fetching quiz data:', error);
            })
    }, [quizId]);

    const fetchQuizzes = async () => {
        return await apiClient.get(`http://localhost:8080/quiz/takeQuiz/${quizId}`)
            .then(resp => {
                const quizData = resp.data;
                setQuiz(quizData);

                if (quizData.questions != null){
                    setCurrentQuestion(quizData.questions[currentQuestionIndex])
                }

                if (quizData.quizAttempts != null){
                    // Display score
                    let pScore = quizData.quizAttempts[quizData.quizAttempts.length - 1].score;
                    let pPerc = quizData.quizAttempts[quizData.quizAttempts.length - 1].percentage.toFixed(2);

                    setPreviousAttemptScore(pScore);
                    setPreviousAttemptPercentage(pPerc);
                }
            })
            .catch(error => {
                console.error('Error fetching quiz data:', error);
            })
    }

    const handleAnswerSelect = (questionId, selectedOption) => {
        setSelectedAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedOption,
        }));

        console.log('Selected Answers:', selectedAnswers);
    };

    const handleNextButton = () => {
        let newIndex = currentQuestionIndex + 1;

        if (newIndex <= 0){
            newIndex = 0;
        }

        handleSetQuestion(newIndex);
    }

    const handlePreviousButton = () => {
        let newIndex = currentQuestionIndex - 1;

        if (newIndex <= 0){
            newIndex = 0;
        }

        handleSetQuestion(newIndex);
    }

    const handleSetQuestion = (newIndex) => {
        if (quiz.questions != null){
            if (newIndex > quiz.questions.length){
                setCurrentQuestionIndex(quiz.questions.length - 1);
                setCurrentQuestion(quiz.questions[quiz.questions.length - 1])
            }else{
                setCurrentQuestionIndex(newIndex);
                setCurrentQuestion(quiz.questions[newIndex])
            }
        }
    }

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

    function QuizHeaderDisplay({ quizData, previousScore, previousPercentage }){
        if (previousScore !== undefined && previousPercentage !== undefined){
            return(
                <Row className="p-2 text-center">
                    <Col lg={2}></Col>
                    <Col lg={8}>
                        <Alert variant="light">
                            <h1 style={{color: "blue"}}><strong>{quiz.title}</strong></h1>
                            <p><em>{quiz.category}</em></p>
                            <h4>Previous Score: {previousScore}</h4>
                            <h4>Previous Percentage: {previousPercentage}%</h4>
                        </Alert>
                    </Col>
                    <Col lg={2}></Col>
                </Row>
            )
        }
        else{
            return(
                <Row className="p-2 text-center">
                    <Col lg={2}></Col>
                    <Col lg={8}>
                        <Alert variant="light">
                            <h1 style={{color: "blue"}}><strong>{quiz.title}</strong></h1>
                            <p><em>{quiz.category}</em></p>
                            <h4>Previous Score: N/A</h4>
                        </Alert>
                    </Col>
                    <Col lg={2}></Col>
                </Row>
            )
        }
    }

    function QuestionsCardOutput({ }){
        if (quiz.questions !== null && currentQuestion != null && !submissionResult){
            let showNextButton = currentQuestionIndex < quiz.questions.length - 1;
            let showPrevButton = currentQuestionIndex > 0;
            let showSubmitButton = currentQuestionIndex === quiz.questions.length - 1;
            let questionCountVisual = (currentQuestionIndex + 1);

            return (
                <div className="container-fluid">
                    <Card>
                        <Card.Header>
                            Question {questionCountVisual} / {quiz.questions.length}
                        </Card.Header>
                        <Card.Body>
                            <strong><h3>{currentQuestion.text}</h3></strong>
                            <FormGroup>
                                {currentQuestion.answers.map(answer => (
                                    <Form.Check key={answer.id}
                                                type="switch"
                                                label={answer.text}
                                                name={`question_${currentQuestion.id}`}
                                                value={answer.id}
                                                checked={selectedAnswers[currentQuestion.id] === answer.id}
                                                onChange={() => handleAnswerSelect(currentQuestion.id, answer.id)}/>
                                ))}
                            </FormGroup>
                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                <Col lg={2}>

                                </Col>
                                <Col lg={4}>
                                    {showPrevButton ? (
                                        <div className="pull-left">
                                            <Button name="previous" size="lg" variant="outline-secondary" onClick={handlePreviousButton}>
                                                Previous
                                            </Button>
                                        </div>
                                    ) : (<div></div>)}
                                </Col>
                                <Col lg={3}>

                                </Col>
                                <Col lg={3}>
                                    {showNextButton ? (
                                        <div>
                                            <Button name="next" size="lg" variant="outline-primary" onClick={handleNextButton}>
                                                Next
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Button name="submit" size="lg" variant="success" onClick={handleSubmitQuiz}>
                                                Submit Quiz
                                            </Button>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </div>
            )
        }
    }

    if (!quiz) {
        return <div>Loading...</div>;
    }
    else{
        return (
            <div className="container" style={{minHeight: 600}}>
                {QuizHeaderDisplay({ quizData: quiz, previousScore: previousAttemptScore, previousPercentage: previousAttemptPercentage})}

                <Row>
                    {QuestionsCardOutput({})}
                </Row>

                {/* Display feedback */}
                {submissionResult && (
                    <div className="mb-4">
                        <div className="alert alert-success" role="alert">
                            <h4 className="alert-heading">Quiz submitted successfully!</h4>
                            <p className="mb-0">Score: {submissionResult.score}</p>
                            <p className="mb-0">Percentage: {submissionResult.percentage.toFixed(2)}%</p>
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
    }
};


export default TakeQuizPage;
import React, {Fragment, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import {Button, Card, Container, FormGroup, Navbar, Form, Row, Col} from 'react-bootstrap';

function HomePage() {
    const [quiz, setQuiz] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [result, setResult] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [incorrectResponses, setIncorrectResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getQuiz(false);
    }, []);

    const getQuiz = async (newResult) => {
        setLoading(true);

        const response = await fetch('https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple')
            .then(response => {
                return response.json();
            })
            .then(data => {
                let questionData = data.results[0];
                setQuiz(questionData.question);
                setCorrectAnswer(questionData.correct_answer);

                const allOptions = shuffleArray(questionData.incorrect_answers.concat(questionData.correct_answer));
                setOptions(allOptions);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
                setResult(newResult);
            })
    };

    const handleAnswerChange = (event) => {
        setSelectedAnswer(event.target.value);

        if (selectedAnswer === '') {
            setResult(false);
            return;
        }

        const isCorrect = selectedAnswer === correctAnswer;
        if (isCorrect) {
            getQuiz(true);
        } else {
            const currentIndex = options.indexOf(selectedAnswer);
            const currentResponse = incorrectResponses[currentIndex];
            setResult(false);
        }
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    return (
        <Container className="pt-4">
            <Row className="text-center offset-2 col-8">
                <Card>
                    <Card.Header>
                        <h1>Welcome to Trivia Explosion!</h1>
                        <h4>Unleash the thrill of trivia with a variety of quizzes.</h4>
                    </Card.Header>

                    <Card.Body>
                        <div>
                            Whether you're an unregistered user looking for a random quiz or a quiz creator, we've
                            got something for you. Want to create your own quizzes?
                            <h5>REGISTER or LOGIN and become a QUIZ CREATOR!</h5>
                        </div>
                    </Card.Body>
                </Card>
            </Row>
            <br />
            <Row className="offset-1 col-10">
                <Card>
                    <Card.Header>
                        <h4 className="text-center ">Test your intelligence with random questions!</h4>
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <Row className="align-content-center">
                                {quiz && (
                                    <h5 className="p-3" dangerouslySetInnerHTML={{__html: quiz}}></h5>
                                )}
                                {options.map((option, index) => (
                                    <div key={index} className="form-check">
                                        <input type="checkbox"
                                               className="form-check-input"
                                               id={`option${index}`}
                                               name="quizOptions"
                                               value={option}
                                               checked={selectedAnswer === option}
                                               onChange={handleAnswerChange}/>
                                        <label className="form-check-label"
                                               dangerouslySetInnerHTML={{__html: option}}
                                               htmlFor={`option${index}`}>
                                        </label>
                                    </div>
                                ))}
                            </Row>
                        )}
                    </Card.Body>
                    {result ? (
                        <Card.Footer>
                            <div style={{marginTop: '20px'}} className="alert alert-success" role="alert">
                                Correct
                            </div>
                        </Card.Footer>
                    ) : (
                        <Card.Footer>
                            <div style={{marginTop: '20px'}} className="alert alert-primary" role="alert">
                                -- Choose Wisely --
                            </div>
                        </Card.Footer>
                    )}
                </Card>
            </Row>
        </Container>
    );
}

export default HomePage;
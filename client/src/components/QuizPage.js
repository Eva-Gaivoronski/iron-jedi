import React, {useState, useEffect, useContext} from 'react';
import {Table, Button, Modal, FormControl, InputGroup, Card, Row, Col, Container} from 'react-bootstrap';
import axios from 'axios';
import { Link, useParams, useNavigate} from 'react-router-dom';
import CreateQuizForm from './CreateQuizForm';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AuthContext} from "../context/AuthContext";
import apiClient from "./ApiClient";


const QuizPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [newQuiz, setNewQuiz] = useState({title: ''});
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false); // Corrected true?
    const [editedQuiz, setEditedQuiz] = useState({});
    const {quizId} = useParams();
    const [quiz, setQuiz] = useState({});
    const navigate = useNavigate();
    const [quizToDelete, setQuizToDelete] = useState(null);
    const [questions, setQuestions] = useState([]);
    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const username = localStorage.getItem('triviaappusername');
    const user_id = localStorage.getItem('triviaappid');

    const handleCreateQuizButtonClick = () => {
        setShowCreateForm(true);
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false);
        fetchQuizzes();
    };

    const handleEditQuiz = async (selectedQuiz) => {
        setQuiz(selectedQuiz);
        setShowEditForm(true);

        // Fetch questions for the current quiz
        try {
            const response = await apiClient.get(`http://localhost:8080/quiz/questions/${selectedQuiz.id}`);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleRemoveQuestion = async (questionId) => {
        try {
            await axios.delete(`http://localhost:8080/quiz/removeQuestion/${quiz.id}/${questionId}`);
            // Fetch updated questions after removal
            const response = await apiClient.get(`http://localhost:8080/quiz/questions/${quiz.id}`);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error removing question:', error);
        }
    };

    const handleCloseEditForm = () => {
        setShowEditForm(false);
        setEditedQuiz({});
        fetchQuizzes();
    };

    const fetchQuizzes = async () => {
        const response = await apiClient.get(`http://localhost:8080/quiz/getQuizzes/${user_id}`, {
            method: "GET",
            mode: "no-cors",
            credentials: "omit",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(responseData => {
                console.log('Fetched Quiz Data:', responseData.data);
                if (responseData !=null && responseData.data !=null ){
                    setQuizzes(responseData.data);
                }
            })
            .catch(error => {
                console.error('New Error fetching quizzes:', error);
                console.log('Request config:', error.config);
                console.log('Server response:', error.response)
            })
    };

    useEffect(() => {

        fetchQuizzes();
    }, []);

    const handleAddQuestions = (quizId) => {
        navigate(`/question-form/${quizId}`);
        // TODO: Need logic for editing questions from Kevin
        console.log(`Add questions for quiz with ID ${quizId}`);
    };

    const handleDeleteQuiz = (quizId) => {
        setQuizToDelete(quizId);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/quiz/${quizToDelete}`);
            fetchQuizzes();
            setQuizToDelete(null); // Clear the state after successful deletion
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const handleCancelDelete = () => {
        setQuizToDelete(null);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setQuiz({
            ...quiz,
            [name]: value,
        });
    };

    const handleUpdateQuiz = async (updatedQuiz) => {
        try {
            await apiClient.put(`http://localhost:8080/quiz/${updatedQuiz.id}`, updatedQuiz);
            setShowEditForm(false);
            setQuiz(updatedQuiz);
            fetchQuizzes();
        } catch (error) {
            console.error('Error updating quiz:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateQuiz(quiz);
    };

    function QuizCard({ quizData }){
        return (
            <Card className="h-100">
                <Card.Header className="container-fluid">
                    <Row>
                        <Col xs={10} lg={11}>
                            <h4><strong>{quizData.title}</strong></h4>
                            <em><h6>{quizData.category}</h6></em>
                        </Col>
                        <Col xs={2} lg={1}>
                            <a style={{cursor: "pointer", padding: "1px"}} title="Delete Quiz" onClick={() => handleDeleteQuiz(quizData.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 448 512">
                                    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                                </svg>
                            </a>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <strong>Description</strong>
                        <br />
                        <p>
                            {quizData.description}
                        </p>
                    </Row>
                    <Row>
                        <Col>
                            {QuizStatusDisplay({quizData: quizData})}
                        </Col>
                        <Col>

                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer>
                    <Row>
                        <Col className="mb-sm-2" xs={12} md={4}>
                            {QuizButtonDisplay({quizData: quizData})}
                        </Col>
                        <Col className="mb-sm-2" xs={6} md={4}>
                            <Link to={`/question-form/${quizData.id}`}>
                                <Button variant="outline-primary">
                                    Questions
                                </Button>
                            </Link>
                        </Col>
                        <Col className="mb-sm-2" xs={6} md={4}>
                            <Button variant="outline-dark" onClick={() => handleEditQuiz(quizData)}>
                                Update
                            </Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        )
    }

    function QuizStatusDisplay({ quizData }){
        let currCount = quizData.questions.length;
        let requiredAmount = quizData.requiredQuestionCount;

        if (quizData.submitted && quizData.quizAttempts != null && quizData.quizAttempts.length > 0){
            return (
                <div>
                    <span style={{color: "green", fontSize: "1.1em"}}>Quiz already taken.</span>
                    <br />
                    {QuizScoreDisplay({score: quizData.quizAttempts[0].percentage})}
                </div>
            )
        }
        else if (requiredAmount > 0 && currCount >= requiredAmount){
            return(
                <div>
                    <span style={{color: "green", fontSize: "1.1em"}}>You are ready to take the quiz.</span>
                    {QuizCountDisplay({currentCount: currCount, requiredCount: requiredAmount})}
                </div>
            )
        }
        else{
            return(
                <div>
                    <span style={{color: "red", fontSize: "1.1em"}}>Quiz is not ready to be taken.</span>
                    {QuizCountDisplay({currentCount: currCount, requiredCount: requiredAmount})}
                </div>
            )
        }
    }

    function QuizScoreDisplay({ score }){
        return(
            <div>
                <span style={{fontStyle: "italic"}}>
                    Score:&nbsp;
                </span>
                <span style={score > 70 ? {color: "green"} : {color: "red"}}>
                        {score} %
                </span>
            </div>
        )
    }

    function QuizCountDisplay({ currentCount, requiredCount }){
        if (requiredCount > 0 && currentCount >= requiredCount){
            return(
                <div>
                    <span style={{fontStyle: "italic"}}>
                        Current Count:&nbsp;
                    </span>
                    <span style={{color: "green"}}>
                        {currentCount}
                    </span>
                    <br />
                    <span style={{fontStyle: "italic"}}>
                        Required Count:&nbsp;
                    </span>
                    <span style={{fontWeight: "bold"}}>
                        {requiredCount}
                    </span>
                </div>
            )
        }
        else {
            return(
                <div>
                    <span style={{fontStyle: "italic"}}>
                        Current Count:&nbsp;
                    </span>
                    <span style={{color: "red"}}>
                        {currentCount}
                    </span>
                    <br />
                    <span style={{fontStyle: "italic"}}>
                        Required Count:&nbsp;
                    </span>
                    <span style={{fontWeight: "bold"}}>
                        {requiredCount}
                    </span>
                </div>
            )
        }
    }

    function QuizButtonDisplay({quizData}){
        if (quizData.submitted){
            return(
                <div>
                    <Link to={`/takeQuiz/${quizData.id}`}>
                    {/* Iryna update to handle event, where Score/Submitted are reset */}
                    <Button variant="danger">
                        Retake Quiz
                    </Button>
                </Link>
                </div>
            )
        }
        else if (quizData.questions.length >= quizData.requiredQuestionCount){
            return (
                <div>
                    <Link to={`/takeQuiz/${quizData.id}`}>
                        <Button variant="success">
                            Take Quiz
                        </Button>
                    </Link>
                </div>
            )
        }
        else{
            return (
                <div>
                    <Button disabled="disabled" variant="outline-success">
                        Take Quiz
                    </Button>
                </div>
            )
        }
    }

    return (
        <section>
            <Row className="sticky-top">
                {/*<Col xs={4} className="offset-4">*/}
                <Card className="text-center">
                    {/*<Card.Header>Explore Trivia Explosion!</Card.Header>*/}
                    <Card.Body>
                        <Card.Title>Create Your Own Quiz</Card.Title>
                        <Card.Text>
                            Dive into the world of knowledge and fun! Craft your personalized quiz and challenge others.
                            With supporting questions, create a compelling quiz that others would love to take.
                        </Card.Text>

                        <Button size="lg" variant="success shadow" onClick={handleCreateQuizButtonClick}>
                            CREATE QUIZ
                        </Button>
                    </Card.Body>
                </Card>
                {/*</Col>*/}
            </Row>

            <Container>
                <Row xs={1} md={2} className="g-4">
                    {/* For each quiz, create our QuizCard object */}
                    {quizzes.map((quiz) => (
                        <Col key={quiz.id}>
                            {QuizCard({quizData: quiz})}
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Create Quiz Form Modal */}
            <Modal show={showCreateForm} onHide={handleCloseCreateForm} >
                <Modal.Header closeButton>
                    <Modal.Title>Create a New Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Render CreateQuizForm component and pass form-related props */}
                    <CreateQuizForm
                        onCancel={handleCloseCreateForm}
                        newQuiz={newQuiz}
                        setNewQuiz={setNewQuiz}
                        fetchQuizzes={fetchQuizzes} // Pass the fetchQuizzes function to update quiz list after creation
                        onClose={handleCloseCreateForm}
                    />
                </Modal.Body>
            </Modal>

            {/* Edit Quiz Form Modal */}
            <Modal.Dialog>
                <Modal show={showEditForm} onHide={handleCloseEditForm}>
                    <form onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Quiz</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <InputGroup className="mb-3 shadow">
                                <InputGroup.Text>Title</InputGroup.Text>
                                <FormControl
                                    type="text"
                                    name="title"
                                    value={quiz.title || ''}
                                    onChange={handleInputChange}
                                    aria-label="Title"
                                />
                            </InputGroup>

                            <InputGroup className="mb-3 shadow">
                                <InputGroup.Text>Category</InputGroup.Text>
                                <FormControl
                                    type="text"
                                    name="category"
                                    value={quiz.category || ''}
                                    onChange={handleInputChange}
                                    aria-label="Category"
                                />
                            </InputGroup>

                            <InputGroup className="mb-3 shadow">
                                <InputGroup.Text>Description</InputGroup.Text>
                                <FormControl
                                    as="textarea"
                                    name="description"
                                    value={quiz.description}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>

                            <InputGroup className="mb-3 shadow">
                                <InputGroup.Text>Required # of Questions</InputGroup.Text>
                                <FormControl
                                    type="number"
                                    name="requiredQuestionCount"
                                    value={quiz.requiredQuestionCount}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>

                            {/* Display list of questions */}
                            <div className="mb-3 shadow">
                                <h3>Quiz questions:</h3>
                                <ul className="list-group">
                                    {questions.map((question) => (
                                        <li className="list-group-item"
                                            key={question.id}>
                                            <div className="row">
                                                <div className="flex-wrap justify-content-between
                                            align-items-center col-lg-9">
                                                    {question.text}
                                                </div>
                                                <div className="col-lg-3">
                                                    <Button
                                                        variant="outline-danger" className="btn btn-text-center mb-2"
                                                        onClick={() => handleRemoveQuestion(question.id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Add other form fields */}
                            <br />
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="success" type="submit">
                                Update Quiz
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </Modal.Dialog>

            {/* Delete Modal */}
            <Modal show={quizToDelete !== null} onHide={handleCancelDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this quiz?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Confirm
                    </Button>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
};

export default QuizPage;


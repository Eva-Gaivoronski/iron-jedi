import React, { useState, useEffect } from 'react';
import {Table, Button, Modal, FormControl, InputGroup, Card} from 'react-bootstrap';
import axios from 'axios';
import { Link, useParams, useNavigate} from 'react-router-dom';
import CreateQuizForm from './CreateQuizForm';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
const QuizPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [newQuiz, setNewQuiz] = useState({title: ''});
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editedQuiz, setEditedQuiz] = useState({});
    const {quizId} = useParams();
    const [quiz, setQuiz] = useState({});
    const navigate = useNavigate();
    const [quizToDelete, setQuizToDelete] = useState(null);
    const [questions, setQuestions] = useState([]);

    const handleCreateQuizButtonClick = () => {
        setShowCreateForm(true);
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false);
        fetchQuizzes(); // Fetch quizzes again
    };

    const handleEditQuiz = async (selectedQuiz) => {
        setQuiz(selectedQuiz);
        setShowEditForm(true);

        // Fetch questions for the current quiz
        try {
            const response = await axios.get(`http://localhost:8080/quiz/questions/${selectedQuiz.id}`);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleRemoveQuestion = async (questionId) => {
        const userConfirmed = window.confirm('Are you sure you want to remove this question from the quiz?')
        if (!userConfirmed) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8080/quiz/removeQuestion/${quiz.id}/${questionId}`);
            const response = await axios.get(`http://localhost:8080/quiz/questions/${quiz.id}`);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error removing question:', error);
        }
    };

    const handleCloseEditForm = () => {
        setShowEditForm(false);
        setEditedQuiz({});
        fetchQuizzes(); // Fetch quizzes again
    };

    async function fetchQuizzes() {
        try {
            const response = await axios.get("/quiz/getQuizzes", {
                withCredentials: true,
            });
            setQuizzes(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Redirect to login or handle unauthorized access
                console.error("Unauthorized access. Redirecting to login...");
                // You can use a library like React Router to handle navigation
            } else {
                console.error("Error fetching quizzes:", error.message);
            }
        }
    }


    // const fetchQuizzes = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8080/quiz/getQuizzes', {timeout: 5000});
    //         console.log('Quiz ID:', quizId);
    //         console.log('Fetched Quiz Data:', response.data);
    //         setQuizzes(response.data);
    //     } catch (error) {
    //         console.error('Error fetching quizzes:', error);
    //     }
    // };

    useEffect(() => {
        fetchQuizzes();
    }, []); // Fetch quizzes on component mount

    const handleAddQuestions = (quizId) => {
        navigate(`/question-form/${quizId}`);
        console.log(`Add questions for quiz with ID ${quizId}`);
    };

    const handleDeleteQuiz = (quizId) => {
        setQuizToDelete(quizId);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/quiz/${quizToDelete}`);
            fetchQuizzes();
            setQuizToDelete(null);
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
            await axios.put(`http://localhost:8080/quiz/${quizId}`, updatedQuiz);
            setShowEditForm(false);
            setQuiz(updatedQuiz);
            fetchQuizzes(); // Fetch quizzes again after updating
        } catch (error) {
            console.error('Error updating quiz:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateQuiz(quiz);
    };


    return (
        <div className="container">


            <Table className="mt-3">
            <thead className="table-header">
            <tr>
                <th className="row-cols-md-auto">Title</th>
                <th className="row-cols-md-auto">Category</th>
                <th className="row-cols-md-auto">Questions</th>
                <th></th>
                <th></th>
                <th></th>

            </tr>
            </thead>
                <tbody>
                {quizzes.map((quiz) => (
                    <tr key={quiz.id}>
                        <td width="28%">{quiz.title}</td>
                        <td width="28%">{quiz.category}</td>
                        <td> <span> {quiz.questions.length} </span>

                            <Link to={`/question-form/${quiz.id}`}>
                                <Button  onClick={() => handleAddQuestions(quiz)}>
                                    <FontAwesomeIcon icon={faFileCirclePlus} />
                                </Button>
                            </Link>
                        </td>
                        <td>
                            <Link to={`/quizzes/${quiz.id}`}>
                                <Button variant="warning" onClick={() => handleEditQuiz(quiz)}>
                                    Update
                                </Button>
                            </Link>
                        </td>

                        <td>
                            <Link to={`/takeQuiz/${quiz.id}`}>
                                <Button variant="success" >
                                    Take Quiz
                                </Button>
                            </Link>
                        </td>
                        <td>
                            <Button variant="danger" onClick={() => handleDeleteQuiz(quiz.id)}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Create Quiz Form Modal */}
            <Modal show={showCreateForm} onHide={handleCloseCreateForm} >
                <Modal.Header bg="light" closeButton>
                    <Modal.Title>CREATE NEW QUIZ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateQuizForm
                        onCancel={handleCloseCreateForm}
                        newQuiz={newQuiz}
                        setNewQuiz={setNewQuiz}
                        fetchQuizzes={fetchQuizzes}
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

            <Card className="text-center">
                <Card.Header>Explore Trivia Explosion!</Card.Header>
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

        </div>
    );
};

export default QuizPage;



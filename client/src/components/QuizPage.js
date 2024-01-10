import React, { useState, useEffect } from 'react';
import {Table, Button, Modal} from 'react-bootstrap';
import axios from 'axios';
import { Link, useParams, useNavigate} from 'react-router-dom';
import CreateQuizForm from './CreateQuizForm';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';

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

    const handleCreateQuizButtonClick = () => {
        setShowCreateForm(true);
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false);
        fetchQuizzes(); // Fetch quizzes again after closing the form
    };

    const handleEditQuiz = async (selectedQuiz) => {
        setQuiz(selectedQuiz);
        setShowEditForm(true);

        // Fetch questions for the current quiz
        try {
            const response = await axios.get(`http://localhost:8080/question/quiz/${selectedQuiz.id}`);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    // Function to handle deletion of a question
    const handleDeleteQuestion = async (questionId) => {
        try {
            // Make a DELETE request to your backend API to delete the question
            await axios.delete(`http://localhost:8080/question/${questionId}`);

            // Update the questions state after successful deletion
            setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== questionId));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const handleCloseEditForm = () => {
        setShowEditForm(false);
        setEditedQuiz({});
        fetchQuizzes(); // Fetch quizzes again after closing the form
    };

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/quiz/getQuizzes', {timeout: 5000});
            console.log('Quiz ID:', quizId);
            console.log('Fetched Quiz Data:', response.data);
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []); // Fetch quizzes on component mount

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
        <div>
            <Button variant="success" onClick={handleCreateQuizButtonClick}>
                CREATE QUIZ
            </Button>

            <Table>
                <thead className="table-header">
                <tr>
                    <th>Title</th>
                    <th>Category</th>
                </tr>
                </thead>
                <tbody>
                {quizzes.map((quiz) => (
                    <tr key={quiz.id}>
                        <td>{quiz.title}</td>
                        <td>{quiz.category}</td>
                        <td>
                            <Link to={`/quizzes/${quiz.id}`}>
                                <Button variant="success" onClick={() => handleEditQuiz(quiz)}>
                                    Update
                                </Button>
                            </Link>
                        </td>
                        {/*need to finish the logic*/}
                        <td>
                            <Link to={`/question-form/${quiz.id}`}>
                                <Button variant="success" onClick={() => handleAddQuestions(quiz)}>
                                    Add questions
                                </Button>
                            </Link>
                        </td>
                        <td>
                            <Link to={`/takeQuiz/${quiz.id}`}>
                                <Button variant="success" >
                                    {/*//onClick={() => (quiz)}*/}
                                    Take Quiz
                                </Button>
                            </Link>
                        </td>
                        <td>
                            <Button onClick={() => handleDeleteQuiz(quiz.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Create Quiz Form Modal */}
            <Modal show={showCreateForm} onHide={handleCloseCreateForm}>
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
                    />
                </Modal.Body>
            </Modal>

            {/* Edit Quiz Form Modal */}
            {/* Edit Quiz Form Modal */}
            <Modal show={showEditForm} onHide={handleCloseEditForm}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Quiz</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>
                            Title:
                            <input
                                type="text"
                                name="title"
                                value={quiz.title || ''}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <label>
                            Category:
                            <input
                                type="text"
                                name="category"
                                value={quiz.category || ''}
                                onChange={handleInputChange}
                            />
                        </label>
                        {/* Display list of questions */}
                        <div>
                            <h3>Questions:</h3>
                            <ul>
                                {questions.map((question) => (
                                    <li key={question.id}>
                                        {question.text}
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteQuestion(question.id)}
                                        >
                                            Delete
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Add other form fields */}
                        <br />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit">Update Quiz</Button>
                    </Modal.Footer>
                </form>
            </Modal>




            {/*<Modal show={showEditForm} onHide={handleCloseEditForm}>*/}
            {/*    <form onSubmit={handleSubmit}>*/}
            {/*        <Modal.Header closeButton>*/}
            {/*            <Modal.Title>Edit Quiz</Modal.Title>*/}
            {/*        </Modal.Header>*/}
            {/*        <Modal.Body>*/}
            {/*            <label>*/}
            {/*                Title:*/}
            {/*                <input*/}
            {/*                    type="text"*/}
            {/*                    name="title"*/}
            {/*                    value={quiz.title || ''}*/}
            {/*                    onChange={handleInputChange}*/}
            {/*                />*/}
            {/*            </label>*/}
            {/*            <br />*/}
            {/*            <label>*/}
            {/*                Category:*/}
            {/*                <input*/}
            {/*                    type="text"*/}
            {/*                    name="category"*/}
            {/*                    value={quiz.category || ''}*/}
            {/*                    onChange={handleInputChange}*/}
            {/*                />*/}
            {/*            </label>*/}
            {/*            /!* Add other form fields *!/*/}
            {/*            <br />*/}
            {/*        </Modal.Body>*/}
            {/*        <Modal.Footer>*/}
            {/*            <Button type="submit">Update Quiz</Button>*/}
            {/*        </Modal.Footer>*/}
            {/*    </form>*/}
            {/*</Modal>*/}

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

        </div>
    );
};

export default QuizPage;
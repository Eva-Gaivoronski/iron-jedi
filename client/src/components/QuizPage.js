import React, { useState, useEffect } from 'react';
import {Table, Button, Modal, FormControl, InputGroup} from 'react-bootstrap';
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
            const response = await axios.get(`http://localhost:8080/quiz/questions/${selectedQuiz.id}`);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleRemoveQuestion = async (questionId) => {
        try {
            await axios.delete(`http://localhost:8080/quiz/removeQuestion/${quiz.id}/${questionId}`);
            // Fetch updated questions after removal
            const response = await axios.get(`http://localhost:8080/quiz/questions/${quiz.id}`);
            setQuestions(response.data);
        } catch (error) {
            console.error('Error removing question:', error);
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
        <div className="container">
            <Button variant="success shadow" onClick={handleCreateQuizButtonClick}>
                CREATE QUIZ
            </Button>

            <Table className="mt-3">

            <thead className="table-header">
            <tr>
                <th className="row-cols-md-auto">Title</th>
                <th className="row-cols-md-auto">Category</th>
                <th className="row-cols-md-auto"># Questions</th>
            </tr>
            </thead>
                <tbody>
                {quizzes.map((quiz) => (
                    <tr key={quiz.id}>
                        <td>{quiz.title}</td>
                        <td>{quiz.category}</td>
                        <td> {quiz.questions.length}</td>
                        <td>
                            <Link to={`/quizzes/${quiz.id}`}>
                                <Button variant="warning" onClick={() => handleEditQuiz(quiz)}>
                                    Update
                                </Button>
                            </Link>
                        </td>
                        {/*need to finish the logic*/}
                        <td>
                            <Link to={`/question-form/${quiz.id}`}>
                                <Button variant="secondary" onClick={() => handleAddQuestions(quiz)}>
                                    Add Questions
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

        </div>
    );
};

export default QuizPage;



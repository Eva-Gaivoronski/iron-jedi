import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import CreateQuizForm from './CreateQuizForm';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';

const QuizPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [newQuiz, setNewQuiz] = useState({ title: '' });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false); // Corrected to false
    const [editedQuiz, setEditedQuiz] = useState({});
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState({});

    const handleCreateQuizButtonClick = () => {
        setShowCreateForm(true);
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false);
        fetchQuizzes(); // Fetch quizzes again after closing the form
    };

    const handleEditQuiz = (selectedQuiz) => {
        setEditedQuiz(selectedQuiz);
        setShowEditForm(true);
    };

    const handleCloseEditForm = () => {
        setShowEditForm(false);
        setEditedQuiz({});
        fetchQuizzes(); // Fetch quizzes again after closing the form
    };

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/quiz/getQuizzes');
            setQuizzes(response.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []); // Fetch quizzes on component mount

    const handleAddQuestions = (quizId) => {
        console.log(`Add questions for quiz with ID ${quizId}`);
    };

    const handleDeleteQuiz = async (quizId) => {
        try {
            await axios.delete(`http://localhost:8080/quiz/${quizId}`);
            fetchQuizzes();
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
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

    // const handleAddQuestions = (quizId) => {
//         // TODO: Need logic for editing questions from Kevin
//         console.log(`Add questions for quiz with ID ${quizId}`);
//     };

    return (
        <div>
            <Button variant="success" onClick={handleCreateQuizButtonClick}>
                Create Quiz
            </Button>

            <Table>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Actions</th>
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
                                    Edit
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
            <Modal show={showEditForm} onHide={handleCloseEditForm}>
                <form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Quiz</Modal.Title>
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
                        {/* Add other form fields */}
                        <br />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit">Update Quiz</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
};

export default QuizPage;



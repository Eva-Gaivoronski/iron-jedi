import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import CreateQuizForm from './CreateQuizForm';
import QuizTable from './QuizTable';
import fetchQuizzes from './QuizTable';

const QuizPage = () => {
    const [userQuizzes, setUserQuizzes] = useState([]);
    const [newQuiz, setNewQuiz] = useState({ title: '' });
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleCreateQuizButtonClick = () => {
        setShowCreateForm(true);
    };

    const handleCloseCreateForm = () => {
        setShowCreateForm(false);
    }

    // useEffect(() => {
    //
    // }, []);
    // fetchQuizzes();

    const handleAddQuestions = (quizId) => {
        // TODO: Need logic for editing questions from Kevin
        console.log(`Add questions for quiz with ID ${quizId}`);
    };
    return (
        <div>
            <Button variant="success" onClick={handleCreateQuizButtonClick}>
                Create Quiz
            </Button>
            {/* Display quizzes using QuizTable component */}
            <QuizTable quizzes={userQuizzes} />
            <Modal show={showCreateForm} onHide={handleCloseCreateForm}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a New Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Render CreateQuizForm component and pass form-related props */}
                    <CreateQuizForm
                       // onSubmit={handleCreateQuizButtonClick}
                        onCancel={handleCloseCreateForm}
                        newQuiz={newQuiz}
                        setNewQuiz={setNewQuiz}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default QuizPage;

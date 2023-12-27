import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import {Link} from "react-router-dom";

const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                const response = await axios.get('http://localhost:8080/quiz')
                setQuizzes(response.data);
            } catch (error) {
                // Handle error
            }
        }
        fetchQuizzes();
    }, []);

    const handleDeleteQuiz = async (quizId) => {
        try {
            await axios.delete(`http://localhost:8080/quiz/${quizId}`);
            // Remove the deleted quiz from the state or perform other actions as needed
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    return (
        <Table>
            <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
            </thead>

            <tbody>
            {quizzes.map(quiz => (
                <tr key={quiz.id}>
                    <td>{quiz.title}</td>
                    <td>{quiz.description}</td>
                    <td>
                        <Link to={`/edit-quiz/${quiz.id}`}>
                            <Button>
                                Edit
                            </Button>
                        </Link>
                        <Button onClick={() => handleDeleteQuiz(quiz.id)}>
                            Delete
                        </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default QuizList;


import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import {Link} from "react-router-dom";
import editQuizPage from "./EditQuizPage";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
const QuizList = () => {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    async function fetchQuizzes() {
        try {
            const response = await axios.get('http://localhost:8080/quiz/getQuizzes')
            setQuizzes(response.data);
        } catch (error) {
            // Handle error
        }
    }

    const handleDeleteQuiz = async (quizId) => {
        try {
            console.log(quizId);
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
                        <Link to={`/edit-quiz/${quiz.id}`}>
                            <Button>Edit</Button>
                        </Link>
                    </td>
                    <td>
                        <Button onClick={() => handleDeleteQuiz(quiz.id).then(resp=>{fetchQuizzes()})}>
                            Delete </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default QuizList;

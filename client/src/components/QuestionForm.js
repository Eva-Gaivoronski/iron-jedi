import React, { useEffect, useState } from 'react';
import './QuestionForm.css';
import apiClient from '../components/ApiClient';
import { useParams } from "react-router-dom";

function QuestionForm() {
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState(new Array(4).fill({ text: '', isCorrect: false }));
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);
    const [userQuestions, setUserQuestions] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const { quizId } = useParams();
    const username = localStorage.getItem('triviaappusername');
    const user_id = localStorage.getItem('triviaappid');

    useEffect(() => {
        fetchUserQuestions();
    }, []);

    const fetchUserQuestions = async () => {
        try {
            const response = await apiClient.get(`http://localhost:8080/question/users/${user_id}/created-questions`);
            setUserQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleAnswerChange = (index, event) => {
        const newAnswers = answers.map((answer, i) => {
            if (i === index) {
                return { ...answer, text: event.target.value };
            }
            return answer;
        });
        setAnswers(newAnswers);
    };

    const handleCorrectAnswerChange = (index) => {
        const updatedAnswers = answers.map((answer, i) => ({
            ...answer,
            isCorrect: i === index
        }));
        setAnswers(updatedAnswers);
        setCorrectAnswerIndex(index);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!questionText || answers.some(answer => !answer.text)) {
            alert('Please fill out all fields.');
            return;
        }

        if (correctAnswerIndex === -1) {
            alert('Please select at least one correct answer.');
            return;
        }

        let qId = null;
        if (quizId != null && quizId.length > 0) {
            qId = quizId;
        }

        const user = {
            id: user_id,
            username: username
        }

        const questionData = {
            text: questionText,
            quiz_id: qId,
            user: user,
            answers
        };

        try {
            const response = await apiClient.post('http://localhost:8080/question', questionData);
            if (response.data && response.data.id) {
                if (quizId) {
                    await apiClient.post(`/quiz/${quizId}/addQuestion/${response.data.id}`);
                }
            }

            alert('Question saved successfully!');
            setQuestionText('');
            setAnswers(new Array(4).fill({ text: '', isCorrect: false }));
            setCorrectAnswerIndex(-1);
            fetchUserQuestions();
        } catch (error) {
            console.error('There was an error saving the question:', error);
            alert('Error saving question.');
        }
    };

    const handleDelete = async (questionId) => {
        const userConfirmed = window.confirm('Are you sure you want to delete this question?');
        if (!userConfirmed) {
            return;
        }

        try {
            await apiClient.delete(`http://localhost:8080/question/${questionId}`);
            setUserQuestions(prevQuestions => prevQuestions.filter(question => question.id !== questionId));
            alert('Question deleted successfully!');
        } catch (error) {
            console.error('Error deleting question:', error);
            alert('Error deleting question.');
        }
    };

    const handleEdit = (question) => {
        setQuestionText(question.text);
        setAnswers(question.answers.map(a => ({ text: a.text, isCorrect: a.isCorrect })));
        const correctIndex = question.answers.findIndex(answer => answer.isCorrect);
        setCorrectAnswerIndex(correctIndex);
    };

    const handleAddToQuiz = async (questionId) => {
        try {
            await apiClient.post(`/quiz/${quizId}/addQuestion/${questionId}`);
            alert('Question added to quiz successfully!');
        } catch (error) {
            console.error('Error adding question to quiz:', error);
            alert('Error adding question to quiz.');
        }
    };

    // Function to search for questions based on keyword
    const searchQuestions = async () => {
        try {
            const response = await apiClient.get(`http://localhost:8080/question/search?keyword=${searchKeyword}&userId=${user_id}`);
            setUserQuestions(response.data);
        } catch (error) {
            console.error('Error searching questions:', error);
        }
    };

    return (
        <div className="form-container">
            <h2>Create a New Question</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Question:</label>
                    <input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
                </div>
                {answers.map((answer, index) => (
                    <div key={index}>
                        <label>
                            Answer {index + 1}:
                            <input type="text" value={answer.text} onChange={(e) => handleAnswerChange(index, e)} />
                        </label>
                        <label>
                            Correct
                            <input
                                type="checkbox"
                                checked={index === correctAnswerIndex}
                                onChange={() => handleCorrectAnswerChange(index)}
                            />
                        </label>
                    </div>
                ))}
                <button type="submit">Save Question</button>
            </form>

            {/* Search bar for filtering questions */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search questions"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <button onClick={searchQuestions}>Search</button>
            </div>

            <div>
                <h2>My Questions</h2>
                {userQuestions.map((question, index) => (
                    <div key={index} className="question-item">
                        <div className="question-content">
                            <h3>Question {index + 1}</h3>
                            <p>Question Text: {question.text}</p>
                            <h4>Answers:</h4>
                            <ul>
                                {question.answers.map((answer, ansIndex) => (
                                    <li key={ansIndex}>
                                        Answer {ansIndex + 1}: {answer.text}
                                        {answer.isCorrect ? ' (Correct)' : ''}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="question-actions">
                            <button onClick={() => handleEdit(question)} className="question-button edit-button">Edit</button>
                            <button onClick={() => handleDelete(question.id)} className="question-button delete-button">Delete</button>
                            {quizId && (
                                <button onClick={() => handleAddToQuiz(question.id)} className="question-button add-to-quiz-button">Add to Quiz</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default QuestionForm;
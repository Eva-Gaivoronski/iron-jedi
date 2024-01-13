import React, {useEffect, useState} from 'react';
import './QuestionForm.css';
import axios from "axios";
import { useParams} from "react-router-dom";

function QuestionForm() {
    const [username, setUsername] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState(new Array(4).fill({ text: '', isCorrect: false }));
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);
    const [userQuestions, setUserQuestions] = useState([]);
    const [searchUsername, setSearchUsername] = useState('');
    const {quizId} = useParams();

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

        if (!username || !questionText || answers.some(answer => !answer.text)) {
            alert('Please fill out all fields.');
            return;
        }

        //Iryna added validation for correct answer checked
        if (correctAnswerIndex === -1) {
            alert('Please select at least one correct answer.');
            return;
        }

        const questionData = {
            user: { username },
            text: questionText,
            answers
        };

        try {
            //Iryna changed
            const response =  axios.post('http://localhost:8080/question', questionData)
                // Iryna added
            .then(responseData => {
                if (responseData.data != null && responseData.data.id !=null){
                    if (quizId !=null) {
                        axios.post(`/quiz/addQuestion/${quizId}`, responseData.data.id.toString());
                    }
                }
            });
            //Iryna end

            alert('Question saved successfully!');
            setUsername('');
            setQuestionText('');
            setAnswers(new Array(4).fill({ text: '', isCorrect: false }));
            setCorrectAnswerIndex(-1);
        } catch (error) {
            console.error('There was an error saving the question:', error);
            alert('Error saving question.');
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8080/users/${searchUsername}/questions`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setUserQuestions(data);
        } catch (error) {
            console.error('Error fetching questions:', error);
            alert('Error fetching questions.');
        }
    };

    const handleDelete = async (questionId) => {
        //Iryna added confirmation
        const userConfirmed = window.confirm('Are you sure you want to delete this question from the quiz?')
        if (!userConfirmed) {
            return;
        }
        //Iryna end change
        try {
            const response = await fetch(`http://localhost:8080/question/${questionId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setUserQuestions(prevQuestions => prevQuestions.filter(question => question.id !== questionId));
            alert('Question deleted successfully!');
        } catch (error) {
            console.error('Error deleting question:', error);
            alert('Error deleting question.');
        }
    };

    const handleEdit = (question) => {
        setUsername(question.user.username);
        setQuestionText(question.text);
        setAnswers(question.answers);
        const correctIndex = question.answers.findIndex(answer => answer.isCorrect);
        setCorrectAnswerIndex(correctIndex);
    };

    return (
        <div>
            <h2>Create a New Question</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
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

            <div>
                <h2>Search Questions by Username</h2>
                <input
                    type="text"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    placeholder="Username"
                />
                <button type="button" onClick={handleSearch}>Search</button>

                <div>
                    <h3>Search Results</h3>
                    {userQuestions.map((question, index) => (
                        <div key={index} className="question-item">
                            <span className="question-text">{question.text}</span>
                            <div className="question-actions">
                                <button onClick={() => handleEdit(question)} className="question-button edit-button">Edit</button>
                                <button onClick={() => handleDelete(question.id)} className="question-button delete-button">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuestionForm;
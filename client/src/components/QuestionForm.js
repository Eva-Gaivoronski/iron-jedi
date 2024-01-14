import React, { useState } from 'react';
import './QuestionForm.css';

function QuestionForm() {
    const [username, setUsername] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState(new Array(4).fill({ text: '', isCorrect: false }));
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);
    const [userQuestions, setUserQuestions] = useState([]);
    const [searchUsername, setSearchUsername] = useState('');

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

        const questionData = {
            user: { username },
            text: questionText,
            answers
        };

        try {
            const response = await fetch('http://localhost:8080/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(questionData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

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
    <div className="custom-button-container">
            <form onSubmit={handleSubmit} className="custom-form">
        <div className="custom-input">
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="custom-input">
          <label>Question:</label>
          <input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
        </div>
        {answers.map((answer, index) => (
          <div key={index} className="custom-input">
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
        <button type="submit" className="custom-button">
          Save Question
        </button>
      </form>

      <div className="custom-input">
        <h2>Search Questions by Username</h2>
        <input
          type="text"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          placeholder="Username"
        />
        <button type="button" onClick={handleSearch} className="custom-button">
          Search
        </button>

        <div style={{ marginTop: '20px' }}>
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
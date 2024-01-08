import React, { useState } from 'react';
import './QuestionForm.css';

function QuestionForm() {
    const [username, setUsername] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [editingQuestionId, setEditingQuestionId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const questionData = {
            user: { username },
            text: questionText,
            answers: [
                { text: correctAnswer, isCorrect: true },
                { text: option1, isCorrect: false },
                { text: option2, isCorrect: false },
                { text: option3, isCorrect: false }
            ]
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(responseData);
            alert('Question saved successfully!');
            setUsername('');
            setQuestionText('');
            setCorrectAnswer('');
            setOption1('');
            setOption2('');
            setOption3('');
            setEditingQuestionId(null);
        } catch (error) {
            console.error('There was an error saving the question:', error);
            alert('Error saving question.');
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8080/users/${searchTerm}/questions`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching questions:', error);
            alert('Error fetching questions.');
        }
    };

    const handleEdit = (question) => {
        setEditingQuestionId(question.id);
        setUsername(question.user.username);
        setQuestionText(question.text);
        setCorrectAnswer(question.correctAnswer);
        setOption1(question.option1);
        setOption2(question.option2);
        setOption3(question.option3);
    };

    const handleDelete = async (questionId) => {
        try {
            const response = await fetch(`http://localhost:8080/question/${questionId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setSearchResults(prevResults => prevResults.filter(q => q.id !== questionId));
            alert('Question deleted successfully!');
        } catch (error) {
            console.error('Error deleting question:', error);
            alert('Error deleting question.');
        }
    };

    return (
        <div>
            <h2>{editingQuestionId ? 'Edit' : 'Create a New'} Question</h2>
            <form onSubmit={handleSubmit}>
                {/* Form Fields */}
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Question:</label>
                    <input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
                </div>
                <div>
                    <label>Correct Answer:</label>
                    <input type="text" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} />
                </div>
                <div>
                    <label>Option 1:</label>
                    <input type="text" value={option1} onChange={(e) => setOption1(e.target.value)} />
                </div>
                <div>
                    <label>Option 2:</label>
                    <input type="text" value={option2} onChange={(e) => setOption2(e.target.value)} />
                </div>
                <div>
                    <label>Option 3:</label>
                    <input type="text" value={option3} onChange={(e) => setOption3(e.target.value)} />
                </div>
                <button type="submit">{editingQuestionId ? 'Update' : 'Save'} Question</button>
            </form>

            <div>
                <h2>Search Questions by Username</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Username"
                />
                <button type="button" onClick={handleSearch}>Search</button>

                <div>
                    <h3>Search Results</h3>
                    {searchResults.map((question, index) => (
                        <div key={index} className="question-item">
                            <span className="question-text">{question.text}</span>
                            <div className="question-actions">
                                <button onClick={() => handleEdit(question)} className="question-button">Edit</button>
                                <button onClick={() => handleDelete(question.id)} className="question-button">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuestionForm;
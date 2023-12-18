import React, { useState } from 'react';
import axios from 'axios';

function QuestionForm() {
    const [username, setUsername] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const questionData = {
            user: { username },
            text: questionText,
            correctAnswer,
            option1,
            option2,
            option3
        };

        try {
            const response = await axios.post('http://localhost:8080/question', questionData);
            console.log(response.data);
            alert('Question saved successfully!');
        } catch (error) {
            console.error('There was an error saving the question', error);
            alert('Error saving question.');
        }
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
                <button type="submit">Save Question</button>
            </form>
        </div>
    );
}

export default QuestionForm;
import React, { useState } from 'react';
import './QuestionForm.css';

function QuestionForm() {
    const [username, setUsername] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState(new Array(4).fill({ text: '', isCorrect: false }));
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);

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
       console.log('Sending question data:', questionData);
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
            setAnswers(new Array(4).fill(''));
            setCorrectAnswerIndex(-1);
        } catch (error) {
            console.error('There was an error saving the question:', error);
            alert('Error saving question.');
        }
    };

     return (
            <div>
                <h2>Create a New Question</h2>
                <form onSubmit={handleSubmit}>
                    {/* User Input */}
                    <div>
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    {/* Question Input */}
                    <div>
                        <label>Question:</label>
                        <input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
                    </div>

                    {/* Answers Input */}
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
            </div>
        );
    }

    export default QuestionForm;
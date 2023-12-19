import React, { useState } from 'react';

function QuestionForm() {
    const [username, setUsername] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

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
                                <div key={index}>
                                    <p>{question.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        export default QuestionForm;
import React, { useEffect, useState } from 'react';
import './QuestionForm.css';
import apiClient from '../components/ApiClient';
import { useParams } from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import './Form.css';

function QuestionForm() {
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState(new Array(4).fill({ text: '', isCorrect: false }));
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);
    const [userQuestions, setUserQuestions] = useState([]);
    const { quizId } = useParams();
    const [keyword, setKeyword] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editQuestionId, setEditQuestionId] = useState(null);
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
            //alert('Error fetching questions.');
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
        if (quizId != null && quizId.length > 0){
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

    const handleKeywordSearch = async () => {
        if (!keyword) {
            alert('Please enter a keyword.');
            return;
        }
        try {
            const response = await apiClient.get(`http://localhost:8080/question/search?keyword=${keyword}`);
            setUserQuestions(response.data);
        } catch (error) {
            alert('Error fetching questions by keyword.');
            console.error('Error fetching questions:', error);
        }
    };

    const handleDelete = async (questionId) => {
        const userConfirmed = window.confirm('Are you sure you want to delete this question?')
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
        setAnswers(question.answers);
        const correctIndex = question.answers.findIndex(answer => answer.isCorrect);
        setCorrectAnswerIndex(correctIndex);
        setEditMode(true);
        setEditQuestionId(question.id);
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
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <h2>Search by Keyword</h2>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Keyword"
                />
                <button type="button" onClick={handleKeywordSearch}>Search Keyword</button>
            </div>
        </div>
    );
}

export default QuestionForm;

// import React, {useEffect, useState} from 'react';
// // import './QuestionForm.css';
// import axios from "axios";
// import {useNavigate, useParams} from "react-router-dom";
// import apiClient from "./ApiClient";
// import './Form.css';
//
// function QuestionForm() {
//     const [username, setUsername] = useState('');
//     const [questionText, setQuestionText] = useState('');
//     const [answers, setAnswers] = useState(new Array(4).fill({ text: '', isCorrect: false }));
//     const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);
//     const [userQuestions, setUserQuestions] = useState([]);
//     const [searchUsername, setSearchUsername] = useState('');
//     const {quizId} = useParams();
//     const [keyword, setKeyword] = useState('');
//     const [editMode, setEditMode] = useState(false);
//     const [editQuestionId, setEditQuestionId] = useState(null);
//     const [keywordSearchUsername, setKeywordSearchUsername] = useState('');
//
//     const handleAnswerChange = (index, event) => {
//         const newAnswers = answers.map((answer, i) => {
//             if (i === index) {
//                 return { ...answer, text: event.target.value };
//             }
//             return answer;
//         });
//         setAnswers(newAnswers);
//     };
//
//     const handleCorrectAnswerChange = (index) => {
//         const updatedAnswers = answers.map((answer, i) => ({
//             ...answer,
//             isCorrect: i === index
//         }));
//         setAnswers(updatedAnswers);
//         setCorrectAnswerIndex(index);
//     };
//
//     const handleSubmit = async (event) => {
//         event.preventDefault();
//
//         if ( !questionText || answers.some(answer => !answer.text)) {
//             alert('Please fill out all fields.');
//             return;
//         }
//
//         //Iryna added validation for correct answer checked
//         if (correctAnswerIndex === -1) {
//             alert('Please select at least one correct answer.');
//             return;
//         }
//
//         const questionData = {
//             user: { username },
//             text: questionText,
//             answers
//         };
//
//         try {
//             //Iryna changed
//             const response =  await apiClient.post('http://localhost:8080/question', questionData)
//                 // Iryna added
//                 .then(responseData => {
//                     if (responseData.data != null && responseData.data.id !=null){
//                         if (quizId !=null) {
//                             apiClient.post(`/quiz/addQuestion/${quizId}`, responseData.data.id.toString());
//                         }
//                     }
//                 });
//             //Iryna end
//
//             alert('Question saved successfully!');
//             setQuestionText('');
//             setAnswers(new Array(4).fill({ text: '', isCorrect: false }));
//             setCorrectAnswerIndex(-1);
//         } catch (error) {
//             console.error('There was an error saving the question:', error);
//             alert('Error saving question.');
//         }
//     };
//     const handleSearch = async () => {
//         try {
//             const response = await apiClient.get(`http://localhost:8080/users/${searchUsername}/questions`);
//             if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
//             const data = await response.json();
//             setUserQuestions(data);
//         } catch (error) {
//             console.error('Error fetching questions:', error);
//             alert('Error fetching questions.');
//         }
//     };
//
//     const handleKeywordSearch = async () => {
//         console.log(`Searching for keyword '${keyword}' in user '${keywordSearchUsername}' questions.`);
//         if (!keywordSearchUsername || !keyword) {
//             alert('Please enter both a username and a keyword.');
//             return;
//         }
//         try {
//             const response = await apiClient.get(`http://localhost:8080/users/${keywordSearchUsername}/search?keyword=${keyword}`);
//             if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//             const questions = await response.json();
//             setUserQuestions(questions);
//         } catch (error) {
//             alert('Error fetching questions by keyword.');
//             console.error('Error fetching questions:', error);
//         }
//     };
//
//     const handleDelete = async (questionId) => {
//         //Iryna added confirmation
//         const userConfirmed = window.confirm('Are you sure you want to delete this question from the quiz?')
//         if (!userConfirmed) {
//             return;
//         }
//         //Iryna end change
//         try {
//             const response = await apiClient.get(`http://localhost:8080/question/${questionId}`, {
//                 method: 'DELETE',
//             });
//
//             if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
//
//             setUserQuestions(prevQuestions => prevQuestions.filter(question => question.id !== questionId));
//             alert('Question deleted successfully!');
//         } catch (error) {
//             console.error('Error deleting question:', error);
//             alert('Error deleting question.');
//         }
//     };
//
//     const handleEdit = (question) => {
//         setUsername(question.user.username);
//         setQuestionText(question.text);
//         setAnswers(question.answers);
//         const correctIndex = question.answers.findIndex(answer => answer.isCorrect);
//         setCorrectAnswerIndex(correctIndex);
//         setEditMode(true);
//         setEditQuestionId(question.id);
//     };
//
//     return (
//         <div className="form-container">
//             <h2>Create a New Question</h2>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Question:</label>
//                     <input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)}/>
//                 </div>
//                 {answers.map((answer, index) => (
//                     <div key={index}>
//                         <label>
//                             Answer {index + 1}:
//                             <input type="text" value={answer.text} onChange={(e) => handleAnswerChange(index, e)} />
//                         </label>
//                         <label>
//                             Correct
//                             <input
//                                 type="checkbox"
//                                 checked={index === correctAnswerIndex}
//                                 onChange={() => handleCorrectAnswerChange(index)}
//                             />
//                         </label>
//                     </div>
//                 ))}
//                 <button type="submit">Save Question</button>
//             </form>
//
//             <div>
//                 <h2>Search Questions by Username</h2>
//                 <input
//                     type="text"
//                     value={searchUsername}
//                     onChange={(e) => setSearchUsername(e.target.value)}
//                     placeholder="Username"
//                 />
//                 <button type="button" onClick={handleSearch}>Search</button>
//
//                 <div>
//                     <h2>Search by Keyword</h2>
//                     <input
//                         type="text"
//                         value={keywordSearchUsername}
//                         onChange={(e) => setKeywordSearchUsername(e.target.value)}
//                         placeholder="Username for Keyword Search"
//                     />
//                     <input
//                         type="text"
//                         value={keyword}
//                         onChange={(e) => setKeyword(e.target.value)}
//                         placeholder="Keyword"
//                     />
//                     <button type="button" onClick={handleKeywordSearch}>Search Keyword</button>
//                 </div>
//
//                 <div>
//                     <h3>Search Results</h3>
//                     {userQuestions.map((question, index) => (
//                         <div key={index} className="question-item">
//                             <div className="question-content">
//                                 <h3>Question {index + 1}</h3>
//                                 <p>Question Text: {question.text}</p>
//                                 <p>Question User: {question.user.username}</p>
//                                 <h4>Answers:</h4>
//                                 <ul>
//                                     {question.answers.map((answer, ansIndex) => (
//                                         <li key={ansIndex}>
//                                             Answer {ansIndex + 1}: {answer.text}
//                                             {answer.isCorrect ? ' (Correct)' : ''}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <div className="question-actions">
//
//                                 <button onClick={() => handleEdit(question)} className="question-button edit-button">Edit</button>
//                                 <button onClick={() => handleDelete(question.id)} className="question-button delete-button">Delete</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default QuestionForm;
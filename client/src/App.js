import React from 'react';
import {BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import QuestionForm from './components/QuestionForm';
import QuizPage from './components/QuizPage';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import TakeQuizPage from "./components/TakeQuizPage";
import {Button, Container, Nav, Navbar} from "react-bootstrap";
function App() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate();
    };

    // const handleNavigateBack = () => {
    //     navigate(`/quizzes/${quizId}`);
    // };

    return (
        <div className="App">
            <div className="fixed-bottom">

                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Back
                </button>
            </div>

            <div>
                <Navbar bg="success" data-bs-theme="dark">
                    <Navbar.Brand className="p-2">Trivia Explosion!</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Nav className="me-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/quizzes" className="nav-link">
                                My Quizzes
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/question-form" className="nav-link">
                                Add Question
                            </Link>
                        </li>

                    </Nav>
                </Navbar>
            </div>

            <Routes>
                <Route path="/quizzes" element={<QuizPage/>}/>
                <Route path="/question-form" element={<QuestionForm/>}/>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/quizzes/:quizId" element={<QuizPage/>}/>
                <Route path="/takeQuiz/:quizId" element={<TakeQuizPage/>}/>
                <Route path="/submitQuiz/:quizId" element={<TakeQuizPage/>}/>
                <Route path="/question-form/:quizId" element={<QuestionForm/>}/>
            </Routes>
        </div>

    );
}

export default App;

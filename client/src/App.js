import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import QuestionForm from './components/QuestionForm';
import QuizPage from './components/QuizPage';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import TakeQuizPage from "./components/TakeQuizPage";
import {Container, Nav, Navbar} from "react-bootstrap";
function App() {
    return (
        <div className="App">
            <header>
                <Navbar expand="sm" className="bg-success bg-gradient">
                    <Container>
                        <Navbar.Brand href="#home">Trivia Explosion!</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
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
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>

            <Routes>
                <Route path="/quizzes" element={<QuizPage/>}/>
                <Route path="/question-form" element={<QuestionForm/>}/>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/quizzes/:quizId" element={<QuizPage/>}/>
                <Route path="/takeQuiz/:quizId" element={<TakeQuizPage/>}/>
                <Route path="/submitQuiz/:quizId" element={<TakeQuizPage/>}/>
                <Route path="/question-form/:quizId" element={<QuestionForm/>} />
            </Routes>
        </div>

    );
}

export default App;

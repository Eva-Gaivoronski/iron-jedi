import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import QuestionForm from './components/QuestionForm';
import QuizPage from './components/QuizPage';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import TakeQuizPage from "./components/TakeQuizPage";
import LeaderBoardPage from './components/LeaderBoardPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
    return (
        <div className="App">
            <header className="Header">
                <nav>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className="nav-link">
                                Register
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/quizzes" className="nav-link">
                                Quiz Page
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/question-form" className="nav-link">
                                Question Form
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/leaderboard" className="nav-link">
                                Leaderboard
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <Routes>
                <Route path="/quizzes" element={<QuizPage />} />
                <Route path="/question-form" element={<QuestionForm />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/leaderboard" element={<LeaderBoardPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/quizzes/:quizId" element={<QuizPage />} />
                <Route path="/takeQuiz/:quizId" element={<TakeQuizPage />} />
                <Route path="/submitQuiz/:quizId" element={<TakeQuizPage />} />
            </Routes>
        </div>
    );
}

export default App;

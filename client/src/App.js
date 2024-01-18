import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import QuestionForm from './components/QuestionForm';
import QuizPage from './components/QuizPage';
import Register from './components/Register';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import TakeQuizPage from "./components/TakeQuizPage";
import Navbar from './components/Navbar';
import EmailVerificationPage from './components/VerifyEmail';

import { AuthContext, AuthProvider } from "./context/AuthContext";
import ProfilePicture from "./components/ProfilePicture";
import QuizChallengeForm from "./components/QuizChallengeForm";
import LeaderBoardPage from "./components/LeaderBoardPage";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
    };

    // Provide the context value
    const authContextValue = {
        isLoggedIn,
        login,
        logout,
    };
    return (
        <AuthProvider>
            <div className="App">
                <Navbar />

                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/quizzes" element={<QuizPage/>}/>
                    <Route path="/question-form" element={<QuestionForm/>}/>
                    <Route path="/question-form/:quizId" element={<QuestionForm/>}/>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/quizzes/:quizId" element={<QuizPage/>}/>
                    <Route path="/takeQuiz/:quizId" element={<TakeQuizPage/>}/>
                    <Route path="/submitQuiz/:quizId" element={<TakeQuizPage/>}/>
                    <Route path="/verify-email/:id" element={<EmailVerificationPage />} />
                    <Route path="/profile" element={<ProfilePicture />} />
                    <Route path="/quiz-challenge" element={<QuizChallengeForm/>} />
                    <Route path="/leader-board" element={<LeaderBoardPage/>} />
                </Routes>
            </div>
        </AuthProvider>

    );
}

export default App;
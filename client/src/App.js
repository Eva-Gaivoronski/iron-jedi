import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import QuestionForm from './components/QuestionForm';
import QuizPage from './components/QuizPage';
import EditQuizPage from "./components/EditQuizPage";

function App() {
    return (

            <div className="App">
                <header className="App-header">
                    <nav>
                        <ul>
                            <li className="nav-item">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/addQuiz">Quiz Page</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/question-form">Question Form</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/edit-quiz">EditQuizPage</Link>
                            </li>
                        </ul>
                    </nav>
                </header>

                <Routes>
                    <Route path="/addQuiz" element={<QuizPage/>} />
                    <Route path="/question-form" element={<QuestionForm/>} />
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/edit-quiz" element={<EditQuizPage/>} />
                </Routes>
            </div>

    );
}

export default App;

// import React from 'react';
// import './App.css';
// import HomePage from './components/HomePage';
// import QuestionForm from './components/QuestionForm';
// import QuizPage from "./components/QuizPage";
//
// function App() {
//    return (
//        <div className="App">
//            <header className="App-header">
//                <li className="nav-item">
//                    <h1>Trivia Question Creation Page</h1>
//                    <QuizPage/>
//                </li>
//            </header>
//        </div>
//    );
// }
//
// export default App;
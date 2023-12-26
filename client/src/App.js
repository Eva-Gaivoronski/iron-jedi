import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import QuestionForm from './components/QuestionForm';
import QuizPage from './components/QuizPage';

function App() {
    return (

            <div className="App">
                {/*<header className="App-header">*/}
                {/*    <nav>*/}
                {/*        <ul>*/}
                {/*            <li className="nav-item">*/}
                {/*                <Link to="/">Home</Link>*/}
                {/*            </li>*/}
                {/*            <li className="nav-item">*/}
                {/*                <Link to="/quiz">Quiz Page</Link>*/}
                {/*            </li>*/}
                {/*            <li className="nav-item">*/}
                {/*                <Link to="/question-form">Question Form</Link>*/}
                {/*            </li>*/}
                {/*        </ul>*/}
                {/*    </nav>*/}
                {/*</header>*/}

                <Routes>
                    <Route path="/quiz" element={<QuizPage />} />
                    <Route path="/question-form" element={<QuestionForm />} />
                    <Route path="/" element={<HomePage />} />
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
//                    <QuestionForm/>
//                </li>
//            </header>
//        </div>
//    );
// }
//
// export default App;
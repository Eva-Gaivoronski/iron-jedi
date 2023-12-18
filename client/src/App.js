import React from 'react';
import CreateQuizForm from "./components/CreateQuizForm";
import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import QuizPage from "./components/QuizPage";

function App() {
       return (
       <div className="App">
        <h1>My Trivia Explosion Quizzes</h1>
          <QuizPage />
      </div>)
}

export default App;

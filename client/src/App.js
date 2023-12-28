import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [quiz, setQuiz] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        getQuiz();
      }, 5000);
    }
  }, []);

  const getQuiz = async () => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
      const data = await response.json();
      setQuiz(data.results[0].question);
      setOptions(data.results[0].incorrect_answers.concat(data.results[0].correct_answer));
      console.log(data);
    } catch (error) {
      console.log('Error fetching quiz:', error);
    }
  };

  const handleGenerateQuiz = (event) => {
    event.preventDefault();
    getQuiz();
  };

  const createMarkup = (text) => ({ __html: text });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p dangerouslySetInnerHTML={createMarkup(quiz)}></p>
        </a>
        <form>
          {options.map((option, index) => (
            <div key={index}>
              <input type="radio" id={`option${index}`} name="quizOptions" value={option} />
              <label htmlFor={`option${index}`} dangerouslySetInnerHTML={createMarkup(option)}></label>
            </div>
          ))}
        </form>
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleGenerateQuiz}>Generate Quiz</button>
        </div>
      </header>
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [quiz, setQuiz] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [result, setResult] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  const incorrectResponses = [
    'Not quite right. Try again!',
    'Incorrect. Keep going!',
    'Nice try, but that\'s not the correct answer.',
    // Add more custom incorrect responses as needed
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        getQuiz();
      }, 5000);
    }
  }, []);

  useEffect(() => {
    // Check and submit the answer whenever selectedAnswer changes
    handleQuizSubmit();
  }, [selectedAnswer, correctAnswer]);

  const getQuiz = async () => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
      const data = await response.json();
      setQuiz(data.results[0].question);
      setCorrectAnswer(data.results[0].correct_answer);
      const allOptions = data.results[0].incorrect_answers.concat(data.results[0].correct_answer);
      setOptions(shuffleArray(allOptions));
      console.log(data);
    } catch (error) {
      console.log('Error fetching quiz:', error);
    }
  };

  const handleGenerateQuiz = (event) => {
    event.preventDefault();
    getQuiz();
    setSelectedAnswer('');
    setResult('');
  };

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === '') {
      // Check if an answer is selected before displaying the message
      setResult('~ Choose Wisely ~');
      return;
    }

    const isCorrect = selectedAnswer === correctAnswer;
    if (isCorrect) {
      setResult('Correct!');
    } else {
      // Randomly select an incorrect response
      const randomIncorrectResponse =
        incorrectResponses[Math.floor(Math.random() * incorrectResponses.length)];
      setResult(randomIncorrectResponse);
    }
  };

  const shuffleArray = (array) => {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p></p>
        <div>
          <p dangerouslySetInnerHTML={{ __html: quiz }}></p>
          <form>
            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`option${index}`}
                  name="quizOptions"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={handleAnswerChange}
                />
                <label
                  htmlFor={`option${index}`}
                  dangerouslySetInnerHTML={{ __html: option }}
                ></label>
              </div>
            ))}
          </form>
          {result && (
            <div style={{ marginTop: '20px' }}>
              <p>{result}</p>
            </div>
          )}
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleGenerateQuiz}>Generate Quiz</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;

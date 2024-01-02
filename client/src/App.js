import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [quiz, setQuiz] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [result, setResult] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [incorrectResponses, setIncorrectResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      getQuiz();
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    handleQuizSubmit();
  }, [selectedAnswer, correctAnswer, options, incorrectResponses]);

  const getQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple');
      const data = await response.json();
      const questionData = data.results[0];
      setQuiz(questionData.question);
      setCorrectAnswer(questionData.correct_answer);
      const allOptions = shuffleArray(questionData.incorrect_answers.concat(questionData.correct_answer));
      setOptions(allOptions);

      const questionResponses = allOptions.map((option, index) => {
        if (option === questionData.correct_answer) {
          return 'Correct!';
        } else {
          return `${option} is incorrect.`;
        }
      });
      setIncorrectResponses(questionResponses);

      setLoading(false);
      console.log(data);
    } catch (error) {
      console.log('Error fetching quiz:', error);
      setLoading(false);
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
      setResult('~ Choose Wisely ~');
      return;
    }

    const isCorrect = selectedAnswer === correctAnswer;
    if (isCorrect) {
      setResult('Correct!');
      setTimeout(() => {
        getQuiz();
        setResult('');
      }, 5000);
    } else {
      const currentIndex = options.indexOf(selectedAnswer);
      const currentResponse = incorrectResponses[currentIndex];
      setResult(currentResponse);
    }
  };

  const shuffleArray = (array) => {
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
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
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;

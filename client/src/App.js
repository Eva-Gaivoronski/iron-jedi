import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';


function App() {

const[quiz, setQuiz] = useState([]);

useEffect(() => {
//if (typeof window !== 'undefined') {
   //getQuiz();
//}
//async function getQuiz() {
//const api = await fetch('https://opentdb.com/api.php?amount=1');
//const apijson =await api.json();
//setQuiz(apijson);
//}
// }, []);
const fetchQuiz = async () => {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=1');
        const data = await response.json();
        console.log(data); // Assuming the API response has a 'results' property
      } catch (error) {
        console.log('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, []);

return(
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
          Learn React
          <p> </p>
        </a>
      </header>
    </div>
  );
}

export default App;

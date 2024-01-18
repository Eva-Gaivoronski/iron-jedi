import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import apiClient from '../components/ApiClient';


const LoginPage = () => {
<<<<<<< HEAD
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({ ...prevCredentials, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use apiClient for the login request
      const response = await apiClient.post('http://localhost:8080/users/login', credentials);

      if (response.status === 200) {
        localStorage.setItem('triviaapptoken', response.data);
        // Use apiClient for getting user information
        const user = await apiClient.get(`http://localhost:8080/users/getUser/${credentials.username}`);
        console.log(user.data.id)
        localStorage.setItem('triviaappusername', credentials.username);
        localStorage.setItem('triviaappid', user.data.id);
        console.log('Login successful!');
        login();
        navigate("/");
      } else {
        console.error('Login failed');
        handleErrorResponse(response);
      }
    } catch (error) {
      console.error('Error during login:', error);
      handleErrorResponse(error);
    }
  };

  const handleErrorResponse = (error) => {
    let errorMessage = 'An unexpected error occurred.';

    if (error.response && error.response.data) {
      try {
        const parsedError = JSON.parse(error.response.data);
        if (parsedError.message) {
          console.log(parsedError);
          errorMessage = parsedError.message;
        }
      } catch (parseError) {
        console.error('Error parsing response data:', parseError);
      }
    }

    setErrorMessage(errorMessage);
  };

  return (
    <div className="container mt-5">
      <h1>Login</h1>
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input type="text" className="form-control" id="username" name="username" value={credentials.username} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input type="password" className="form-control" id="password" name="password" value={credentials.password} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
=======
    const { login } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({ ...prevCredentials, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/users/login', credentials);

            if (response.status === 200) {
                localStorage.setItem('triviaapptoken', response.data);
               // Use apiClient for getting user information
                const user = await apiClient.get(`http://localhost:8080/users/getUser/${credentials.username}`);
                // const user = await axios.get(`http://localhost:8080/users/getUser/${credentials.username}`);
                console.log(user.data.id)
                localStorage.setItem('triviaappusername', credentials.username);
                localStorage.setItem('triviaappid', user.data.id);
                console.log('Login successful!');
                login();
                navigate("/");
            } else {
                console.error('Login failed');
                handleErrorResponse(response);
            }
        } catch (error) {
            console.error('Error during login:', error);
            handleErrorResponse(error);
        }
    };

    const handleErrorResponse = (error) => {
        let errorMessage = 'An unexpected error occurred.';

        if (error.response && error.response.data) {
            try {
                const parsedError = JSON.parse(error.response.data);
                if (parsedError.message) {
                    console.log(parsedError)
                    errorMessage = parsedError.message;
                }
            } catch (parseError) {
                console.error('Error parsing response data:', parseError);
            }
        }

        setErrorMessage(errorMessage);
    };

    return (
        <div className="container mt-5">
            <h1>Login</h1>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password:
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    );
>>>>>>> Iryna's_branch
};

export default LoginPage;
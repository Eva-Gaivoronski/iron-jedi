import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';
const RegistrationPage = () => {
    const [user, setUser] = useState({
        username: '',
        password: '',
        email: '',
        is_email_verified: 0,
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true); // Set loading to true while waiting for the response
            const response = await axios.post('http://localhost:8080/users/register', user);

            if (response.status === 200) {
                console.log('User registered successfully!');
                setSuccessMessage('User registered successfully!');
                setErrorMessage('');
                // Optionally, redirect to another page or handle success in UI
            } else {
                console.error('Registration failed');
                setSuccessMessage('');
                setErrorMessage('Registration failed');
                // Handle error, e.g., display an error message
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setSuccessMessage('');
            setErrorMessage('Error during registration');
        } finally {
            setLoading(false); // Set loading back to false regardless of success or failure
        }
    };

    return (
        <div className="container mt-5 form-container">
            <h1 className="mb-4">User Registration</h1>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {loading && <div className="alert alert-info">Loading...</div>}
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
                        value={user.username}
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
                        value={user.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email:
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegistrationPage;
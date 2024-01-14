import React, { useState, useEffect } from 'react';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleAcceptTermsChange = () => {
        setAcceptTerms(!acceptTerms);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validation logic
        let isValid = true;

        if (!username) {
            setUsernameError('Username is required');
            isValid = false;
        } else {
            setUsernameError('');
        }

        if (!password || !/(?=.*[A-Z])(?=.*[0-9!@#$%^&*])/.test(password)) {
            setPasswordError('Password must have at least one capital letter and one number or symbol');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else {
            setEmailError('');
        }

        // If all fields are valid, proceed with registration logic
        if (isValid) {
            // Simulate registration success
            setSuccessMessage('You have successfully been registered!');
            // Clear form fields
            setUsername('');
            setPassword('');
            setEmail('');
            setAcceptTerms(false);
            // Add further registration process or API call as needed
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccessMessage('');
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMessage]);

    return (
        <div className="custom-button-container">
          <form onSubmit={handleSubmit}>
            <label>
              Username:
              <input type="text" value={username} onChange={handleUsernameChange} />
              <span style={{ color: 'red' }}>{usernameError}</span>
            </label>
            <br />
            <label>
              Password:
              <input type="password" value={password} onChange={handlePasswordChange} />
              <span style={{ color: 'red' }}>{passwordError}</span>
            </label>
            <br />
            <label>
              Email:
              <input type="email" value={email} onChange={handleEmailChange} />
              <span style={{ color: 'red' }}>{emailError}</span>
            </label>
            <br />
            <button type="submit" className="custom-button">
              Register
            </button>
          </form>
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
}

export default RegisterPage;

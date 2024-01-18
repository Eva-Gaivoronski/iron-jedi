import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
<<<<<<< HEAD

const EmailVerificationPage = () => {
  const { id } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('Not Verified');

  const handleVerifyEmail = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/users/${id}/verify-email`, {
        is_email_verify: true
      });

      if (response.status === 200) {
        setVerificationStatus('Email Verified Successfully!');
      } else {
        setVerificationStatus('Email Verification Failed');
      }
    } catch (error) {
      setVerificationStatus('Error during Email Verification');
    }
  };

  useEffect(() => {
    // You can add additional logic when the component mounts
    // For example, automatically trigger the verification
    handleVerifyEmail();
  }, [id]); // Add id as a dependency to re-trigger when id changes

  return (
    <div>
      <h1>Email Verification</h1>
      <p>Status: {verificationStatus}</p>
      <button onClick={handleVerifyEmail}>Verify Email</button>
    </div>
  );
=======
import './Form.css';
const EmailVerificationPage = () => {
    const { id } = useParams();
    const [verificationStatus, setVerificationStatus] = useState('Not Verified');

    const handleVerifyEmail = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/users/${id}/verify-email`, {
                is_email_verify: true
            });

            if (response.status === 200) {
                setVerificationStatus('Email Verified Successfully!');
            } else {
                setVerificationStatus('Email Verification Failed');
            }
        } catch (error) {
            setVerificationStatus('Error during Email Verification');
        }
    };

    useEffect(() => {
        // You can add additional logic when the component mounts
        // For example, automatically trigger the verification
        handleVerifyEmail();
    }, [id]); // Add id as a dependency to re-trigger when id changes

    return (
        <div className="form-container">
            <h1>Email Verification</h1>
            <p>Status: {verificationStatus}</p>
            <button onClick={handleVerifyEmail}>Verify Email</button>
        </div>
    );
>>>>>>> Iryna's_branch
};

export default EmailVerificationPage;
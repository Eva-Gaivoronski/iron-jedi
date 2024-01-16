import React, { useState } from 'react';
import axios from 'axios';

const ProfilePicture = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const user_id = localStorage.getItem('triviaappid');
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      setError('');
      setUploading(true);
      setSuccess('');

      const formData = new FormData();
      formData.append('image', file);

      await axios.put(`http://localhost:8080/users/upload/image/${user_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Profile picture uploaded successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError('Error uploading profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Upload Profile Picture</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {uploading && <div className="alert alert-info">Uploading...</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <input type="file" onChange={handleFileChange} />
      <button type="button" onClick={handleUpload} className="btn btn-primary mt-3">
        Upload
      </button>
    </div>
  );
};

export default ProfilePicture;
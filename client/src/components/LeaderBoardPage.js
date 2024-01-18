// LeaderboardPage.js
import React, { useState, useEffect } from 'react';

function LeaderboardPage() {
  const [userData, setUserData] = useState([]);
useEffect(() => {
  fetchDataFromUserRepo();
}, []);

const fetchDataFromUserRepo = async () => {
  try {
    const response = await fetch('http://localhost:8080/users/leaderboard');
    const data = await response.json();
    console.log('User Data:', data); // Add this line
    setUserData(data);
  } catch (error) {
    console.error('Error fetching data from User Repository:', error);

    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">User Leaderboard</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">User ID</th>
            <th scope="col">Questions Created</th>
            {/* Add other user-related fields */}
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (
            <tr key={user.id}>
              <th scope="row">{index + 1}</th>
              <td>{user.id}</td>
              <td>{user.questions ? user.questions.length : 0}</td>
              {/* Render other user-related fields */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderboardPage;

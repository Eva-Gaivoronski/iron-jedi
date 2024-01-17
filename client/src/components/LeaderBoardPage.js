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
            <th scope="col">Username</th>
            <th scope="col">Questions Created</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (
            <tr key={user.id}>
              <th scope="row">{index + 1}</th>
              <td>{user.username}</td>
              <td>{user.questions.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderboardPage;

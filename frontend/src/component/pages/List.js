import React, { useEffect, useState } from "react";
import "../style/UserList.css"; // Import your CSS file for styling

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the user list from your backend when the component mounts
    fetch("http://localhost:8080/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching user list:", error);
      });
  }, []);

  return (
    <div className="user-list-container">
      <h2>User List</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;

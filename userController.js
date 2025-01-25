import React, { useState, useEffect } from "react";
import axios from "axios";

const UserPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    userId: "",
    password: "",
  });

  // Fetch current user info on load
  useEffect(() => {
    axios
      .get("/user-info", { withCredentials: true })
      .then((response) => {
        setUserInfo(response.data);
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        setIsLoggedIn(false);
      });
  }, []);

  // Handle logout
  const handleLogout = () => {
    axios
      .post("/logout", {}, { withCredentials: true })
      .then(() => {
        alert("Logout successful!");
        setIsLoggedIn(false);
        setUserInfo(null);
      })
      .catch((error) => console.error("Error during logout:", error));
  };

  // Handle registration
  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("/register", newUser)
      .then((response) => {
        alert("Registration successful!");
        setNewUser({ username: "", userId: "", password: "" });
      })
      .catch((error) => console.error("Error during registration:", error));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Page</h1>

      {/* Show user info if logged in */}
      {isLoggedIn ? (
        <div>
          <h2 className="text-xl font-semibold">User Info</h2>
          <p>Username: {userInfo.username}</p>
          <p>Email: {userInfo.userId}</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded mt-4"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}

      {/* Registration Form */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Register New User</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.userId}
            onChange={(e) => setNewUser({ ...newUser, userId: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />
          <button className="px-4 py-2 bg-green-500 text-white rounded" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserPage;

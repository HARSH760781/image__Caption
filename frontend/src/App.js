import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./component/Header/Header.js";
import Main from "./component/Main/main";
import About from "./component/pages/About";
import Service from "./component/pages/Service";
import Contact from "./component/pages/Contact.js";
import Signup from "./component/pages/Signup.js";
import Login from "./component/pages/Login";
import List from "./component/pages/List";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Check if a token exists in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Set the user as logged in in your Redux store or component state
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <Router>
      <>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/service" element={<Service />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/users" element={<List />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route
            exact
            path="/login"
            element={
              <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            }
          />
          <Route exact path="/logout" element={<Main />} />
        </Routes>
        <ToastContainer />
      </>
    </Router>
  );
}

export default App;

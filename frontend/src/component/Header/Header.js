import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FaBeer, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import HeartIcon from "../../assets/like.jpg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken } from "../Authentication/auth";
import jwt_decode from "jwt-decode";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [likeCount, setLikeCount] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    // Fetch the like count from the backend API
    fetch(`${process.env.REACT_APP_BACKEND_PORT}/like/count`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.likeCount !== undefined) {
          setLikeCount(data.likeCount);
        } else {
          throw new Error("Invalid response from server");
        }
      })
      .catch((error) => {
        console.error("Error fetching like count:", error);
      });
  }, []);

  const navigate = useNavigate();

  const handleLikeClick = () => {
    if (isLoggedIn) {
      // Example: Storing the token in localStorage
      const authToken = localStorage.getItem("token");
      //console.log(authToken);

      try {
        const decodedToken = jwt_decode(authToken); // Decode the token
        const userId = decodedToken.id;
        const userEmail = decodedToken.email;

        const userDetails = {
          userId,
          email: userEmail,
        };
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(userDetails), // Include user details in the request body
        };

        fetch(`${process.env.REACT_APP_BACKEND_PORT}/like`, requestOptions)
          .then((response) => {
            if (response.ok) {
              // Increment the like count in your UI
              setLikeCount(likeCount + 1);
            } else {
              // Handle errors, e.g., user already liked
              response.json().then((data) => {
                toast.error(data.message, {
                  position: "top-center",
                  hideProgressBar: false,
                  autoClose: 500,
                  closeOnClick: true,
                  theme: "light",
                });
              });
            }
          })
          .catch((error) => {
            console.error("Error while sending like request:", error);
            // Handle other errors here
          });
      } catch (error) {
        console.error("Error decoding the token:", error);
      }
    } else {
      toast.warning("Only logged-in users are eligible to like!", {
        position: "top-center",
        hideProgressBar: false,
        autoClose: 500,
        closeOnClick: true,
        theme: "light",
      });
    }
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Set the user as logged out in your Redux store or component state
    setIsLoggedIn(false);
  };

  return (
    <>
      <div className="header">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
            <p>Caption</p>
          </Link>
        </div>
        <div className="menu">
          <div className="menu-left">
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/service">Services</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="menu-right">
            <nav>
              <ul>
                <li>
                  <div className="like">
                    <img
                      src={HeartIcon}
                      alt="Like Icon"
                      width="auto"
                      height="40"
                      style={{ fill: "red" }}
                      onClick={handleLikeClick}
                    />
                    {likeCount}
                  </div>
                </li>

                <li>
                  {isLoggedIn ? (
                    <Link to="/users">Community</Link>
                  ) : (
                    <Link to="/login">Login</Link>
                  )}
                </li>
                <li>
                  {isLoggedIn ? (
                    <Link to="/logout" onClick={handleLogout}>
                      Logout
                    </Link>
                  ) : null}
                </li>
                <li>
                  <Link to="/download">App</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="icons">
          <FaBars className="menu-icon" style={{ display: "none" }} />
        </div>
      </div>
    </>
  );
};

export default Header;

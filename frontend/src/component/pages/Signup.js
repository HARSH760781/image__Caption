import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import "../style/community.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux"; // Import connect
import { signupSuccess, addUser } from "../action"; // Import your signupSuccess action

const Signup = ({ signupSuccessful, signupSuccess }) => {
  const initialFormData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password, confirmPassword } = formData;
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_PORT}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          confirmPassword,
        }),
      });

      if (!res.ok) {
        // console.log(res);
        throw new Error(`Request failed with status: ${res.status}`);
      } else {
        const newUser = { name, email };
        signupSuccess(newUser);
        addUser(newUser);
        toast.success("Sign Up Successfully!!", {
          autoClose: 500,
        });
        setSignedUp(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (signedUp) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>
        {error && <div className="error-message">{error}</div>}
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
        <Form.Group className="link-to-signup">
          <span>Already have an account? </span>
          <Link to="/login" className="signup-btn">
            Login
          </Link>
        </Form.Group>
      </Form>
    </>
  );
};
const mapStateToProps = (state) => ({
  signupSuccessful: state.rootReducer.signupSuccessful,
});

const mapDispatchToProps = {
  signupSuccess,
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

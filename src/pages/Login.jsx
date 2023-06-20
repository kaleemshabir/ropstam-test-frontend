import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";

function Login() {
  // React States
  const [errorMessages, setErrorMessages] = useState({
    email: "",
    password: "",
  });
  const { onLogin, loading, error } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = form;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (
      !/^[a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(
        email.toLowerCase()
      )
    ) {
      errors.email = "Enter a valid email";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password should be at least 8 characters long";
    }

    setErrorMessages(errors);

    if (Object.keys(errors).length === 0) {
      try {
        await onLogin({
          email,
          password,
        });
      } catch (error) {
        console.log(error?.message);
      }
    }
  };
  const renderErrorMessage = (name) => (
    <div className="error">{errorMessages[name]}</div>
  );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Email </label>
          <input
            type="text"
            name="email"
            placeholder="enter email"
            value={email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {renderErrorMessage("email")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input
            type="password"
            name="password"
            placeholder="enter password"
            value={password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {renderErrorMessage("password")}
        </div>
        <div className="button-container">
          <input type="submit" />
          {loading && <div>submitting...</div>}
        </div>
        {error && <div className="error button-container">{error}</div>}
        <p>
          Don't have an account? Click here to{" "}
          <Link to="/register">register</Link>
        </p>
      </form>
    </div>
  );

  return (
    <div className="login-form">
      <div className="title">Sign In</div>
      {renderForm}
    </div>
  );
}

export default Login;

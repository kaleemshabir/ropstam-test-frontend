import React, { useState, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAxiosWrapper from "../helpers/axiosWrapper";
import { toast } from "react-toastify";

function Register() {
  // React States
  const [errorMessages, setErrorMessages] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    name: "",
  });
  const navigate = useNavigate();

  const { axiosWrapper } = useAxiosWrapper();

  const { email, name } = form;

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

    setErrorMessages(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setLoading(true);
        const resp = await axiosWrapper("/auth/signup", "post", {
          email,
          name,
        });
        if (resp?.status === 201) {
          toast(
            "Please check your email for password. Login using the provided password"
          );
          navigate("/");
        } else {
          toast.error(resp?.error, {
            position: "top-center",
          });
        }
      } catch (error) {
        console.log(error?.message);
      } finally {
        setLoading(false);
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
          <label>Name </label>
          <input
            type="text"
            name="name"
            placeholder="enter name"
            value={name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="button-container">
          <input type="submit" />
          {loading && <div>submitting...</div>}
        </div>
        <p>
          Have an account? Click here to <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );

  return (
    <div className="login-form">
      <div className="title">Register</div>
      {renderForm}
    </div>
  );
}

export default Register;

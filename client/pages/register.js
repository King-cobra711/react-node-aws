import React, { useState } from "react";
import Layout from "../components/layout";
import axios from "axios";

export default function Register() {
  const RegistrationForm = () => {
    //   State
    const [formInputs, setFormInputs] = useState({
      username: "",
      email: "",
      password: "",
      error: "",
      success: "",
      buttonText: "Register",
    });
    const { username, email, password, error, success, buttonText } =
      formInputs;
    //

    // Functions
    const handleChange = (props) => (e) => {
      setFormInputs({
        ...formInputs,
        [props]: e.target.value,
        success: "",
        error: "",
        buttonText: "Register",
      });
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      axios
        .post(`http://localhost:5000/api/register`, {
          username,
          email,
          password,
        })
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    };
    //
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={username}
            type="text"
            className="form-control"
            placeholder="Your name..."
            onChange={handleChange("username")}
          />
        </div>
        <div className="form-group">
          <input
            value={email}
            type="email"
            className="form-control"
            placeholder="Your email..."
            onChange={handleChange("email")}
          />
        </div>
        <div className="form-group">
          <input
            value={password}
            type="password"
            className="form-control"
            placeholder="Your password..."
            onChange={handleChange("password")}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-outline-warning">{buttonText}</button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Register</h1>
        <br />
        {RegistrationForm()}
      </div>
    </Layout>
  );
}

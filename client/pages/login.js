import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
import { API } from "../config";
import { authenticate, isAuth } from "../helpers/auth";

export default function Login() {
  //   State
  const [formInputs, setFormInputs] = useState({
    email: "matt@matthewhansen.com.au",
    password: "Password",
    error: "",
    success: "",
    buttonText: "Login",
  });

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const { email, password, error, success, buttonText } = formInputs;

  //
  // Functions
  const handleChange = (props) => (e) => {
    setFormInputs({
      ...formInputs,
      [props]: e.target.value,
      success: "",
      error: "",
      buttonText: "Login",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormInputs({
      ...formInputs,
      buttonText: "Logging in",
    });
    try {
      const response = await axios.post(`${API}/login`, {
        email,
        password,
      });
      authenticate(response, () => {
        isAuth() && isAuth().role === "admin"
          ? Router.push("/admin")
          : Router.push("/user");
      });
      console.log("User & Token", response); //user & token
      if (response.data.error) {
        setFormInputs({
          email: "",
          password: "",
          error: response.data.error,
          buttonText: "Login",
        });
      }
    } catch (err) {
      setFormInputs({
        ...formInputs,
        buttonText: "Login",
        error: err.response.data.error,
      });
    }
  };

  const LoginForm = () => {
    return (
      <form onSubmit={handleSubmit}>
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
        <h1>Login</h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        <br />
        {LoginForm()}
      </div>
    </Layout>
  );
}

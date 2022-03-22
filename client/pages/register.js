import React, { useState, useEffect } from "react";
import Router from "next/router";
import Layout from "../components/layout";
import axios from "axios";
import {
  showSuccessMessage,
  showErrorMessage,
  showErrorMessagePassword,
} from "../helpers/alerts";
import { API } from "../config";
import { isAuth } from "../helpers/auth";

export default function Register() {
  //   State
  const [formInputs, setFormInputs] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    error: "",
    success: "",
    buttonText: "Register",
  });

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const { name, email, password, passwordConfirm, error, success, buttonText } =
    formInputs;

  const [passwordMatch, setPasswordMatch] = useState("");
  const [passwordError, setPasswordError] = useState(false);

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
  const passwordCheck = () => {
    if (password === passwordConfirm) {
      setPasswordMatch("yes");
    } else {
      setPasswordMatch("no");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordMatch === "yes") {
      setFormInputs({
        ...formInputs,
        buttonText: "Registering",
      });
      setPasswordError(false);
      try {
        const response = await axios.post(`${API}/register`, {
          name,
          email,
          password,
        });
        if (response.data.error) {
          setFormInputs({
            name: "",
            email: "",
            password: "",
            passwordConfirm: "",
            success: response.data.message,
            error: response.data.error,
            buttonText: "Resubmit",
          });
        } else {
          setFormInputs({
            name: "",
            email: "",
            password: "",
            passwordConfirm: "",
            success: response.data.message,
            error: response.data.error,
            buttonText: "Submitted",
          });
        }
      } catch (err) {
        setFormInputs({
          ...formInputs,
          buttonText: "Register",
          error: err.response.data.error,
        });
      }
    } else if (passwordMatch === "no" || passwordConfirm.length < 1) {
      setPasswordError(true);
    }
  };

  const RegistrationForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={name}
            type="text"
            className="form-control"
            placeholder="Your name..."
            onChange={handleChange("name")}
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
          <input
            value={passwordConfirm}
            type="password"
            className="form-control"
            placeholder="Confirm password..."
            onChange={handleChange("passwordConfirm")}
            onKeyUp={() => passwordCheck()}
            style={{
              borderColor: passwordMatch === "no" && "red",
            }}
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
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {passwordError && showErrorMessagePassword()}
        <br />
        {RegistrationForm()}
      </div>
    </Layout>
  );
}

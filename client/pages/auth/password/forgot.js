import { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import axios from "axios";
import Router from "next/router";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";

const ForgotPassword = () => {
  // state
  const [state, setState] = useState({
    email: "",
    buttonText: "Send Link",
    success: "",
    error: "",
  });

  const { email, buttonText, success, error } = state;
  //

  const handleChange = (e) => {
    if (buttonText == "Email Sent") {
      setState({
        buttonText: "Send Link",
        email: e.target.value,
        success: "",
        error: "",
      });
    } else {
      setState({ ...state, email: e.target.value, success: "", error: "" });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API}/forgot-password`, { email });
      if (response.data.error) {
        setState({
          ...state,
          buttonText: "Resubmit",
          error: response.data.error,
          success: "",
        });
      } else {
        setState({
          email: "",
          buttonText: "Email Sent",
          success: response.data.message,
          error: "",
        });
      }
    } catch (err) {
      setState({
        ...state,
        buttonText: "Resubmit",
        success: "",
        error: err.response.data.error,
      });
    }
  };

  const passwordForgotForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            onChange={handleChange}
            value={email}
            placeholder="Type your email"
            required
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
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Forgot Password</h1>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordForgotForm()}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;

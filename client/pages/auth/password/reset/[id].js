import { useState, useEffect } from "react";
import Layout from "../../../../components/layout";
import axios from "axios";
import Router, { withRouter } from "next/router";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../helpers/alerts";
import { API } from "../../../../config";
import jwt from "jsonwebtoken";

const ResetPassword = ({ router }) => {
  // state
  const [state, setState] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Reset Password",
    success: "",
    error: "",
  });

  const { name, token, newPassword, buttonText, success, error } = state;

  useEffect(() => {
    // router.query.id where id is the name of the page, ie the :id in the url.
    // This is client side method
    const decoded = jwt.decode(router.query.id);

    if (decoded) {
      setState({
        ...state,
        name: decoded.name,
        token: router.query.id,
      });
    }
  }, [router]);

  const handleChange = (e) => {
    setState({ ...state, newPassword: e.target.value, success: "", error: "" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({
      ...state,
      buttonText: "Sending",
    });
    try {
      const response = await axios.put(`${API}/reset-password`, {
        resetPasswordLink: token,
        newPassword,
      });
      if (response.data.error) {
        setState({
          ...state,
          newPassword: "",
          buttonText: "Resubmit",
          error: response.data.error,
          success: "",
        });
      } else {
        setState({
          ...state,
          newPassword: "",
          buttonText: "Success",
          success: response.data.message,
          error: "",
        });
      }
    } catch (err) {
      setState({
        ...state,
        newPassword: "",
        buttonText: "Resubmit",
        success: "",
        error: err.response.data.error,
      });
    }
  };

  const passwordResetForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            onChange={handleChange}
            value={newPassword}
            placeholder="Type new password"
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
          <h1>Reset Password</h1>
          <h4>Hello {name}, </h4>
          <p>Please enter your new password.</p>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordResetForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);

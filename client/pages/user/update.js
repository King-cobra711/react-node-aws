import React, { useState, useEffect } from "react";
import Router from "next/router";
import Layout from "../../components/layout";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../helpers/alerts.js";
import { API } from "../../config";
import withUser from "../withUser";

const Update = ({ user, token }) => {
  //   State
  const [formInputs, setFormInputs] = useState({
    name: "",
    password: "",
    error: "",
    success: "",
    buttonText: "Update",
  });
  const [update, setUpdate] = useState("");

  const { name, password, error, success, buttonText } = formInputs;

  //
  // Functions
  const handleChange = (props) => (e) => {
    setFormInputs({
      ...formInputs,
      [props]: e.target.value,
      success: "",
      error: "",
      buttonText: "Update",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormInputs({
      ...formInputs,
      buttonText: "Updating",
    });
    try {
      const response = await axios.put(
        `${API}/user/update`,
        {
          name,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.error) {
        setFormInputs({
          name: "",
          password: "",
          success: response.data.message,
          error: response.data.error,
          buttonText: "Update",
        });
      } else {
        setFormInputs({
          name: "",
          password: "",
          success: response.data.message,
          error: response.data.error,
          buttonText: "Updated",
        });
        setUpdate(response.data.user);
      }
    } catch (err) {
      setFormInputs({
        ...formInputs,
        password: "",
        buttonText: "Update",
        error: err.response.data.error,
      });
    }
  };

  const UpdateForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <h6>New name: </h6>
          <input
            value={name}
            type="text"
            className="form-control"
            placeholder="New name"
            onChange={handleChange("name")}
          />
        </div>
        <div className="form-group mb-3">
          <h6>New password: </h6>
          <input
            value={password}
            type="password"
            className="form-control"
            placeholder="Your new password..."
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
    <Layout update={update}>
      <div className="col-md-6 offset-md-3">
        <h1>Update Profile</h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        <br />
        {UpdateForm()}
      </div>
    </Layout>
  );
};

export default withUser(Update);

import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../config";
import Layout from "../../../components/layout";
import withAdmin from "../../withAdmin";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    name: "",
    content: "",
    error: "",
    success: "",
    formData: process.browser && new FormData(),
    buttonText: "Create",
    imageUploadText: "Upload Image",
  });

  const {
    name,
    content,
    error,
    success,
    formData,
    buttonText,
    imageUploadText,
  } = state;

  const handleChange = (name) => (e) => {
    const value = name === "image" ? e.target.files[0] : e.target.value;
    const imageName =
      name === "image" ? e.target.files[0].name : "Upload Image";
    formData.set(name, value);
    setState({
      ...state,
      [name]: value,
      error: "",
      success: "",
      imageUploadText: imageName,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({
      ...state,
      buttonText: "Creating",
    });
    try {
      const response = await axios.post(`${API}/category`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Category create response: ", response);
      setState({
        ...state,
        formData: process.browser && new FormData(),
        buttonText: "Created",
        imageUploadText: "Upload Image",
        error: "",
        success: response.data.message,
      });
    } catch (error) {
      console.log("Category create error: ", error);
      setState({
        ...state,
        name: "",
        content: "",
        buttonText: "Create",
        error: error.response.data.error,
      });
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Content</label>
        <textarea
          onChange={handleChange("content")}
          value={content}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadText}
          <input
            onChange={handleChange("image")}
            type="file"
            accept="image/*"
            className="form-control"
            hidden
          />
        </label>
      </div>
      <div>
        <button className="btn btn-outline-warning">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Create Category</h1>
        </div>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {createCategoryForm()}
      </div>
    </Layout>
  );
};

export default withAdmin(Create);

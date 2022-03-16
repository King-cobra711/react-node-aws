import React, { useState, useEffect } from "react";
import Layout from "../../../components/layout";
import axios from "axios";
import { API } from "../../../config";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { getCookie, isAuth } from "../../../helpers/auth";
import withUser from "../../withUser";

const UpdateLink = ({ token, query, link }) => {
  // state
  const [state, setState] = useState({
    title: link.title,
    url: link.url,
    categories: link.categories,
    loadedCategories: [],
    buttonText: "",
    success: "",
    error: "",
    type: link.type,
    medium: link.medium,
  });
  const {
    title,
    url,
    categories,
    loadedCategories,
    buttonText,
    success,
    error,
    type,
    medium,
  } = state;

  // useEffect
  useEffect(() => {
    loadCategories();
  }, [success]);

  // functions

  const showChecked = (c) => {
    const clickedCategory = categories.indexOf(c);

    if (clickedCategory === -1) {
      return false;
    } else {
      return true;
    }
  };

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({
      ...state,
      loadedCategories: response.data,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(title, url, categories, type, medium);
    try {
      const response = await axios.put(
        `${API}/link/${link._id}`,
        { title, url, categories, type, medium },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setState({
        ...state,
        success: "Link updated!",
        error: "",
      });
    } catch (error) {
      console.log("Link submission error: ", error);
      setState({
        ...state,
        success: "",
        error: error.response.data.error,
      });
    }
  };
  const handleTitleChange = (e) => {
    setState({
      ...state,
      title: e.target.value,
      error: "",
      success: "",
    });
  };
  const handleURLChange = (e) => {
    setState({
      ...state,
      url: e.target.value,
      error: "",
      success: "",
    });
  };

  const handleToggle = (c) => () => {
    //return the first index or -1
    const clickedCategory = categories.indexOf(c);
    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log("all >> ", all);
    setState({ ...state, categories: all, success: "", error: "" });
  };

  const handleTypeClick = (e) => {
    setState({
      ...state,
      type: e.target.value,
      success: "",
      error: "",
    });
  };
  const handleMediumClick = (e) => {
    setState({
      ...state,
      medium: e.target.value,
      success: "",
      error: "",
    });
  };

  const showTypes = () => (
    <React.Fragment>
      <div className="form-check ps-5">
        <label className="form-check-label">Free</label>
        <input
          type="radio"
          onClick={handleTypeClick}
          defaultChecked={type === "free"}
          value="free"
          className="form-check-input"
          name="type"
        />
      </div>
      <div className="form-check ps-5">
        <label className="form-check-label">Paid</label>
        <input
          type="radio"
          onClick={handleTypeClick}
          defaultChecked={type === "paid"}
          value="paid"
          className="form-check-input"
          name="type"
        />
      </div>
    </React.Fragment>
  );
  const showMedium = () => (
    <React.Fragment>
      <div className="form-check ps-5">
        <label className="form-check-label">Video</label>
        <input
          type="radio"
          onClick={handleMediumClick}
          defaultChecked={medium === "video"}
          value="video"
          className="form-check-input"
          name="medium"
        />
      </div>
      <div className="form-check ps-5">
        <label className="form-check-label">Article</label>
        <input
          type="radio"
          onClick={handleMediumClick}
          defaultChecked={medium === "article"}
          value="article"
          className="form-check-input"
          name="medium"
        />
      </div>
    </React.Fragment>
  );

  //   link create form

  const submitLinkForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          type="text"
          className="form-control"
          onChange={handleTitleChange}
          value={title}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">URL</label>
        <input
          type="url"
          className="form-control"
          onChange={handleURLChange}
          value={url}
        />
      </div>
      <div>
        <button
          className="btn btn-outline-warning"
          type="submit"
          disabled={!token}
        >
          Submit
        </button>
      </div>
    </form>
  );

  //   show categories checkbox

  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c, i) => (
        <li className="list-unstyled" key={c._id}>
          <input
            type="checkbox"
            onChange={handleToggle(c._id)}
            className="me-2"
            checked={showChecked(c._id)}
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {!isAuth() && showErrorMessage("Must be logged-in to submit a link")}
      </div>
      <div className="row">
        <div className="col-md-12">
          <h1>Submit Link/URL</h1>
          <br />
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 linkSubmit">
          <div className="form-group ">
            <label className="text-muted ms-4">Category</label>
            <ul style={{ maxHeight: "120px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div className="form-group ">
            <label className="text-muted ms-4">Type</label>
            {showTypes()}
          </div>
          <div className="form-group ">
            <label className="text-muted ms-4">Medium</label>
            {showMedium()}
          </div>
        </div>
        <div className="col-md-8">{submitLinkForm()}</div>
      </div>
    </Layout>
  );
};

UpdateLink.getInitialProps = async ({ query, req }) => {
  const response = await axios.get(`${API}/link/${query.id}`);
  return { query, link: response.data };
};

export default withUser(UpdateLink);

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import { API } from "../../../config";
import Layout from "../../../components/layout";
import withAdmin from "../../withAdmin";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";

const Update = ({ token, oldCategory }) => {
  const [state, setState] = useState({
    name: oldCategory.name,
    error: "",
    success: "",
    buttonText: "Update",
    imagePreview: oldCategory.image.url,
    image: "",
  });

  const [content, setContent] = useState(oldCategory.content);

  const [imageUploadText, setImageUploadText] = useState("Upload Image");
  // const [imagePreview, setImagePreview] = useState(oldCategory.image.url);

  const { name, error, success, image, buttonText, imagePreview } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Update",
    });
  };

  const handleContent = (event) => {
    setContent(event);
    setState({ ...state, error: "", success: "" });
  };

  const handleImage = (event) => {
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            setState({
              ...state,
              image: uri,
              imagePreview: uri,
              error: "",
              success: "",
              buttonText: "Update",
            });
          },
          "base64"
        );
        setImageUploadText(event.target.files[0].name);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({
      ...state,
      buttonText: "Updating",
    });
    try {
      const response = await axios.put(
        `${API}/category/${oldCategory.slug}`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("This is the response:  ", response);

      setContent(response.data.updated.content);
      setImageUploadText("Update Image");
      setState({
        name: response.data.updated.name,
        image: "",
        imagePreview: response.data.updated.image.url,
        buttonText: "Updated",
        error: "",
        success: response.data.message,
      });
    } catch (error) {
      console.log("CATCH ERROR:   ", error);
      setState({
        ...state,
        buttonText: "Update",
        success: "",
        error: error.response.data.error,
      });
    }
  };

  const updateCategoryForm = () => (
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
        <ReactQuill
          onChange={handleContent}
          value={content}
          theme="bubble"
          className="form-control"
          placeholder="Write description here..."
          required
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadText}
          <span>
            <img src={imagePreview} alt="image" height="30" className="ms-2" />
          </span>
          <input
            onChange={handleImage}
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
          <h1>Update Category</h1>

          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {updateCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

Update.getInitialProps = async ({ req, query, token }) => {
  const response = await axios.post(`${API}/category/${query.slug}`);
  return { oldCategory: response.data.category, token };
};

export default withAdmin(Update);

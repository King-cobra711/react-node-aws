import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../config";
import Layout from "../../../components/layout";
import withAdmin from "../../withAdmin";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import Link from "next/link";

const Read = ({ user, token }) => {
  const [state, setState] = useState({
    error: "",
    success: "",
    categories: [],
  });
  const { error, success, categories } = state;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({
      ...state,
      categories: response.data,
    });
  };

  const deleteCategory = async (slug) => {
    try {
      const response = await axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("CATEGORY DELETE SUCCESS", response);
      loadCategories();
      setState({
        ...state,
        error: "",
        success: response.data.message,
      });
    } catch (err) {
      console.log("CATEGORY DELETE ERROR", err);
    }
  };
  const confirmDelete = async (e, slug) => {
    e.preventDefault();
    let answer = window.confirm(`Are you sure you want to delete ${slug}?`);

    if (answer) {
      deleteCategory(slug);
    }
  };

  const listCategories = () =>
    categories.map((c, key) => (
      <Link href={`/links/${c.slug}`} key={key}>
        <a
          className="bg-light col-md-6 p-3"
          style={{ border: "1px solid #0d6efd" }}
        >
          <div className="row align-items-center">
            <div className="col-lg-9 mb-2 mt-2">
              <img
                src={c.image.url}
                alt="/"
                style={{ width: "100px", height: "auto" }}
                className="me-3 float-start mobile-category-image"
              />
              <div className="text-center mobile-title-category">
                <h1>{c.name}</h1>
              </div>
              <div
                className="col-md-3 d-grid gap-1 up-and-del-col"
                id="up-and-del"
              >
                <Link href={`/admin/category/${c.slug}`}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                  >
                    Update
                  </button>
                </Link>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={(e) => confirmDelete(e, c.slug)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div
              className="col-md-3 d-grid gap-1 mobileCol"
              id="mobile-content"
            >
              <Link href={`/admin/category/${c.slug}`}>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                >
                  Update
                </button>
              </Link>

              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={(e) => confirmDelete(e, c.slug)}
              >
                Delete
              </button>
            </div>
          </div>
        </a>
      </Link>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col">
          <h1>List of categories</h1>
        </div>
      </div>
      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      <div className="row">{listCategories()}</div>
    </Layout>
  );
};

export default withAdmin(Read);

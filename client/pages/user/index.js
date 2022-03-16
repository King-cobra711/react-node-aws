import React, { useState, useEffect } from "react";
import Layout from "../../components/layout";
import withUser from "../withUser";
import axios from "axios";
import { API } from "../../config";
import { getCookie } from "../../helpers/auth";
import Link from "next/link";
import moment from "moment";
import { showSuccessMessage, showErrorMessage } from "../../helpers/alerts";

const User = ({ user, token, userLinks }) => {
  const [state, setState] = useState({
    success: "",
    error: "",
  });
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLinks(userLinks);
  }, []);

  const { success, error } = state;

  const loadLinks = async () => {
    const response = await axios.get(`${API}/user`, {
      headers: {
        authorization: `Bearer ${token}`,
        contentType: "application/json",
      },
    });
    console.log("LOADLINKS RESPONSE", response);
    setLinks(response.data.links);
  };

  const deleteLink = async (id) => {
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("LINK DELETE SUCCESS", response);
      setState({
        error: "",
        success: response.data.message,
      });
      loadLinks();
    } catch (err) {
      console.log("LINK DELETE ERROR", err);
    }
  };

  const confirmDelete = async (e, id, name) => {
    e.preventDefault();
    let answer = window.confirm(`Are you sure you want to delete ${name}?`);
    console.log("THIS IS ID:    ", id);

    if (answer) {
      deleteLink(id);
    }
  };

  const listLinks = () =>
    links.map((l, key) => (
      <div className="row alert alert-primary p-2" key={key}>
        <div className="col-md-8">
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-danger">{l.url}</h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right mt-2 mb-2">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>

          <a href="#" onClick={(e) => confirmDelete(e, l._id, l.slug)}>
            <span className="badge text-danger float-end mt-2 mb-2">
              delete
            </span>
          </a>
          <Link href={`/user/link/${l._id}`}>
            <a>
              <span className="badge text-primary float-end mt-2 mb-2">
                update
              </span>
            </a>
          </Link>
        </div>
        <div className="col-md-12">
          <span className="badge text-dark ps-0">
            {l.type} / {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span className="badge text-success" key={key}>
              {c.name}
            </span>
          ))}
          <span className="badge text-secondary float-end">
            {l.clicks} clicks
          </span>
        </div>
      </div>
    ));
  return (
    <Layout>
      <h1>
        {user.name}'s dashboard {"  "}
        <span className="text-danger">/{user.role}</span>
      </h1>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/user/link/create">
                <a className="nav-link">Submit a link</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/user/link/update">
                <a className="nav-link">Update profile</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8">
          <h2>Your links</h2>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <hr />
          {listLinks()}
        </div>
      </div>
    </Layout>
  );
};

export default withUser(User);

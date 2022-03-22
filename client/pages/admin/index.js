import Layout from "../../components/layout";
import withAdmin from "../withAdmin";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config";
import { getCookie } from "../../helpers/auth";
import Link from "next/link";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import { showSuccessMessage, showErrorMessage } from "../../helpers/alerts";

const Admin = ({ user, token }) => {
  const [state, setState] = useState({
    success: "",
    error: "",
  });
  const [links, setLinks] = useState([]);
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);

  useEffect(async () => {
    await loadLinks();
    setSkip(links.length);
  }, []);

  const { success, error } = state;

  const loadLinks = async () => {
    try {
      const response = await axios.post(
        `${API}/user/links`,
        { skip, limit },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("LOAD LINKS data:  ", response);
      setSkip(skip + limit);
      setLinks([...links, ...response.data]);
      setSize(response.data.length);
      console.log(" LINKS :  ", links);
    } catch (err) {
      console.log("LOAD LINKS ERROR:  ", err);
    }
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
            <h5 className="pt-3 text-truncate">{l.title}</h5>
            <h6 className="pt-2 text-danger text-truncate">{l.url}</h6>
          </a>
        </div>
        <div className="col-lg-4 pt-2">
          <div className="row">
            <div className="col-lg-12 col-7">
              <span className="submitted-float mt-2 ms-1 mb-2 ">
                Submitted {moment(l.createdAt).fromNow()}
              </span>
            </div>
            <div className="col-lg-12 col-5">
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
          </div>
        </div>
        <div className="col-md-12 order-sm-2">
          <span className="badge text-dark ps-0">
            {l.type} / {l.medium}
          </span>
          {l.categories.map((c, i) => (
            <span className="badge text-success" key={i}>
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
              <Link href="admin/category/create">
                <a className="nav-link">Create Category</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="admin/category/read">
                <a className="nav-link">All Categories</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="admin/links/read">
                <a className="nav-link">All Links</a>
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link href="admin/users/read">
                <a className="nav-link">All Users</a>
              </Link>
            </li> */}
          </ul>
        </div>
        <div className="col-md-8">
          <h2>Your links</h2>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <hr />
          <InfiniteScroll
            pageStart={0}
            loadMore={loadLinks}
            hasMore={size > 0 && size >= limit}
            loader={
              <img
                src="/static/images/React-node-aws-Curve-Loading.gif"
                alt="loading"
                style={{ width: "auto", height: "200px" }}
              />
            }
          >
            {listLinks()}
          </InfiniteScroll>
        </div>
      </div>
    </Layout>
  );
};

export default withAdmin(Admin);
// export default Admin;

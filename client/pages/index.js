import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { API } from "../config";
import Link from "next/link";
import moment from "moment";

const Home = ({ categories, links }) => {
  const [allLinks, setAllLinks] = useState(links);

  useEffect(() => {
    setAllLinks(links);
  }, []);

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, {
      linkId,
    });
    loadUpdatedLinks();
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.get(`${API}/categories`);
    setAllLinks(response.data.links);
  };

  const listTrending = () =>
    allLinks.map((l, index) => (
      <div className="row alert alert-primary p-2 text-start" key={index}>
        <div className="col-md-8" onClick={(e) => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-4 text-truncate">{l.title}</h5>
            <h6
              className="pt-2 text-danger text-truncate"
              style={{ fontSize: "12px" }}
            >
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="float-end posted-mobile-category" key={index}>
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
        </div>
        <div className="col-md-12">
          <span className="badge text-dark">
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

  const listCategories = () =>
    categories.map((c, key) => (
      <div className="col-md-4" key={key}>
        <Link href={`/links/${c.slug}`}>
          <a>
            <div className="card category-box">
              <img className="card-img-top" src={c.image.url} alt="/" />
              <div className="card-body">
                <h5 className="card-title text-center">{c.name}</h5>
              </div>
            </div>
          </a>
        </Link>
      </div>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="font-weight-bold">Browse Categories</h1>
          <br />
        </div>
      </div>
      <div className="row">{listCategories()}</div>
      <hr />
      <div className="row">
        <div className="col-md-12">
          <h1 className="font-weight-bold">Trending Links</h1>
          <br />
        </div>
      </div>
      {listTrending()}
    </Layout>
  );
};
Home.getInitialProps = async () => {
  const response = await axios.get(`${API}/categories`);
  console.log(response.data);
  return {
    categories: response.data.categories,
    links: response.data.links,
  };
};

export default Home;

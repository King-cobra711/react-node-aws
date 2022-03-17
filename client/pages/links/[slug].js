import React, { useState } from "react";
import Layout from "../../components/layout";
import axios from "axios";
import { API } from "../../config";
import Link from "next/link";
import moment from "moment";
import renderHTML from "react-render-html";
import InfiniteScroll from "react-infinite-scroller";

const Links = ({
  query,
  category,
  links,
  totalLinks,
  linksLimit,
  linksSkip,
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setlimit] = useState(linksLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, {
      linkId,
    });
    loadUpdatedLinks();
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${API}/category/${query.slug}`);

    setAllLinks(response.data.links);
  };

  const listOfLinks = () =>
    allLinks.map((l, index) => (
      <div className="row alert alert-primary p-2" key={index}>
        <div className="col-md-8" onClick={(e) => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-4">{l.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right" key={index}>
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

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(`${API}/category/${query.slug}`, {
      skip: toSkip,
      limit,
    });
    setAllLinks([...allLinks, ...response.data.links]);
    setSize(response.data.links.length);
    setSkip(toSkip);
  };

  return (
    <Layout>
      <div className="row flex-column-reverse flex-md-row">
        <div className="col-md-8">
          <div className="row">
            <h1 className="display-4 font-weigth-bold">{category.name}</h1>
            <div className="lead alert alert-secondary pt-4">
              {renderHTML(category.content)}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <img
            src={category.image.url}
            alt="/"
            style={{ width: "auto", height: "200px" }}
            className="mx-auto"
          />
        </div>
      </div>
      {/* <div className="text-center pt-4 pb-5">{loadMoreButton()}</div> */}
      <div className="row">
        <div className="col-md-12 text-center">
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={size > 0 && size >= limit}
            loader={
              <img
                key={0}
                src="/static/images/React-node-aws-Curve-Loading.gif"
                alt="loading"
                style={{ width: "auto", height: "200px" }}
              />
            }
          >
            <div className="row flex-column-reverse flex-md-row">
              <div className="col-md-8">{listOfLinks()}</div>
              <div className="col-md-4">
                <h1>Most popular in {category.name}</h1>
                <p>Show popular links</p>
              </div>
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </Layout>
  );
};
// query and req comes from context
// https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
// query = [slug]
// This is server side method

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 1;

  const response = await axios.post(`${API}/category/${query.slug}`, {
    skip,
    limit,
  });
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linksLimit: limit,
    linksSkip: skip,
  };
};

export default Links;

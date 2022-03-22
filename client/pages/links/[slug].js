import React, { useState, Fragment } from "react";
import Layout from "../../components/layout";
import axios from "axios";
import { API, APP_NAME, DOMAIN } from "../../config";
import Head from "next/head";
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
  topLinks,
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [mostPopular, setMostPopular] = useState(topLinks);
  const [limit, setlimit] = useState(linksLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);

  const head = () => (
    <Head>
      <title>
        {category.name} | {APP_NAME}
      </title>
      <meta name="description" content={category.content.substring(0, 160)} />
      <meta property="og:image:secure_url" content={category.image.url} />
      <meta property="og:title:secure_url" content={category.name} />
    </Head>
  );

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, {
      linkId,
    });
    loadUpdatedLinks();
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${API}/category/${query.slug}`);

    setAllLinks(response.data.links);
    setMostPopular(response.data.pop);
  };

  const listPopularLinks = () =>
    mostPopular.map((l, index) => (
      <div className="row alert alert-success m-2 text-start" key={index}>
        <div className="col-lg-8" onClick={(e) => handleClick(l._id)}>
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
        <div className="col-lg-4 pt-2">
          <span
            className="float-end posted-mobile-category"
            id="xl-posted-name"
            key={index}
          >
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
        </div>
        <div className="col-lg-12">
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

  const listOfLinks = () =>
    allLinks.map((l, index) => (
      <div className="row alert alert-primary m-2 text-start" key={index}>
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
    <>
      {head()}
      <Layout>
        <div className="row flex-column-reverse flex-xl-row">
          <div className="col-lg-8 mx-auto">
            <div className="row">
              <h1 className="display-4 font-weigth-bold">{category.name}</h1>
              <div className="lead alert alert-secondary">
                {renderHTML(category.content)}
              </div>
            </div>
          </div>
          <div className="col-xl-4 mx-auto text-center">
            <img
              src={category.image.url}
              alt="/"
              // style={{ width: "350px", height: "auto" }}
              className="rounded mx-auto category-image-sm"
            />
          </div>
        </div>
        <div className="row flex-column-reverse flex-xl-row">
          <InfiniteScroll
            className="col-xl-8"
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
            <h1 className="mt-2">{category.name} links</h1>
            <hr />
            <div>{listOfLinks()}</div>
          </InfiniteScroll>

          <div className="col-xl-4">
            <h1 className="mt-2">Most popular</h1>
            <hr />
            {listPopularLinks()}
            <hr className="mb-2" />
          </div>
        </div>
      </Layout>
    </>
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
    topLinks: response.data.pop,
  };
};

export default Links;

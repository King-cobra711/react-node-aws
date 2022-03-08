import React, { useState } from "react";
import Link from "next/link";
import NProgress from "nprogress";
import Router from "next/router";
import { isAuth, logout } from "../helpers/auth";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
  const nav = () => (
    <ul className="nav nav-tabs bg-primary variant-dark">
      <li className="nav-item">
        <Link href="/">
          <a className="nav-link text-light">Home</a>
        </Link>
      </li>
      <li className="nav-item submitLinkNav">
        <Link href="/user/link/create">
          <a className="nav-link text-light btn btn-success">Submit a Link</a>
        </Link>
      </li>
      {!isAuth() && (
        <React.Fragment>
          <li className="nav-item">
            <Link href="/login">
              <a className="nav-link text-light">Login</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/register">
              <a className="nav-link text-light">Register</a>
            </Link>
          </li>
        </React.Fragment>
      )}
      {isAuth() && isAuth().role === "admin" && (
        <li className="nav-item ms-auto">
          <Link href="/admin">
            <a className="nav-link text-light">{isAuth().name}</a>
          </Link>
        </li>
      )}
      {isAuth() && isAuth().role === "subscriber" && (
        <li className="nav-item ms-auto">
          <Link href="/user">
            <a className="nav-link text-light">{isAuth().name}</a>
          </Link>
        </li>
      )}
      {isAuth() && (
        <li className="nav-item">
          <a onClick={logout} className="nav-link text-light">
            Logout
          </a>
        </li>
      )}
      <li className="nav-item spinner-space"></li>
    </ul>
  );

  return (
    <React.Fragment>
      {nav()} <div className="container pt-5 pb-5">{children}</div>
    </React.Fragment>
  );
};

export default Layout;

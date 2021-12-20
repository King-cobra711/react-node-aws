import cookie from "js-cookie";
import Router from "next/router";

// set in cookie
export const setCookie = (key, value) => {
  // check if server-side or client-side
  if (process.browser) {
    return cookie.set(key, value, {
      expires: 1, // expires in 1 days
    });
  }
};

// remove from cookie
export const removeCookie = (key, value) => {
  if (process.browser) {
    return cookie.remove(key);
  }
};

// get from cookie
export const getCookie = (key) => {
  if (process.browser) {
    return cookie.get(key);
  }
};

// set in localstorage
export const setLocalStorage = (key, value) => {
  if (process.browser) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from local storage
export const removeLocalStorage = (key) => {
  if (process.browser) {
    return localStorage.removeItem(key);
  }
};

// authenticate user by passing data to cookie and localstorage during signin
export const authenticate = (response, next) => {
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

// access user info from localstorage
export const isAuth = () => {
  if (process.browser) {
    const checkCookie = getCookie("token");
    if (checkCookie) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

export const logout = () => {
  removeCookie("token");
  removeLocalStorage("user");
  Router.push("/login");
};

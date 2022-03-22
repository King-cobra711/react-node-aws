import cookie from "js-cookie";
import Router from "next/router";

// set in cookie
export const setCookie = (key, value) => {
  // check if server-side or client-side
  if (typeof window !== "undefined") {
    return cookie.set(key, value, {
      expires: 1, // expires in 1 days
    });
  }
};

// remove from cookie
export const removeCookie = (key, value) => {
  if (typeof window !== "undefined") {
    return cookie.remove(key);
  }
};

// get from cookie
// checks to see if running in browser or server
export const getCookie = (key, req) => {
  // if (typeof window !== 'undefined') {
  //   return cookie.get(key);
  // }
  return typeof window !== "undefined"
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

export const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};
export const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  let token = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!token) {
    return undefined;
  }
  let tokenValue = token.split("=")[1];
  console.log("getCookieFromServer", tokenValue);
  return tokenValue;
};

// set in localstorage
export const setLocalStorage = (key, value) => {
  if (typeof window !== "undefined") {
    return localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove from local storage
export const removeLocalStorage = (key) => {
  if (typeof window !== "undefined") {
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
  if (typeof window !== "undefined") {
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
  Router.push("/");
};

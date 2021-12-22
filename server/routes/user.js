const express = require("express");
const router = express.Router();

// import validators

// import from controllers

const { read } = require("../controllers/user");

// Router-level middleware
// https://expressjs.com/en/guide/using-middleware.html

const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/authentication");

// routes
router.get("/user", requireSignin, authMiddleware, read);
router.get("/admin", requireSignin, adminMiddleware, read);

module.exports = router;

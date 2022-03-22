const express = require("express");
const router = express.Router();

// import validators
const { userUpdateValidator } = require("../validators/authentication");
const { runValidation } = require("../validators/index");
// import from controllers

const { read, update } = require("../controllers/user");

// Router-level middleware
// https://expressjs.com/en/guide/using-middleware.html

const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/authentication");

// routes
router.get("/user", requireSignin, authMiddleware, read);
router.put(
  "/user/update",
  userUpdateValidator,
  runValidation,
  requireSignin,
  authMiddleware,
  update
);
router.get("/admin", requireSignin, adminMiddleware, read);

module.exports = router;

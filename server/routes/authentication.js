const express = require("express");
const router = express.Router();

// import validators
const {
  userRegisterValidator,
  userLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/authentication");
const { runValidation } = require("../validators/index");

// import from controllers
const {
  register,
  registerActivate,
  login,
  requireSignin,
  forgotPassword,
  resetPassword,
} = require("../controllers/authentication");

// Router-level middleware
// https://expressjs.com/en/guide/using-middleware.html

// routes
router.post("/register", userRegisterValidator, runValidation, register);
router.post("/register/activate", registerActivate);
router.post("/login", userLoginValidator, runValidation, login);
// router.get("/secret", requireSignin, (req, res) => {
//   res.json({
//     data: "This is secret page for logged in users only",
//   });
// });
router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);
router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

module.exports = router;

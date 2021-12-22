const express = require("express");
const router = express.Router();

// import validators
const {
  userRegisterValidator,
  userLoginValidator,
} = require("../validators/authentication");
const { runValidation } = require("../validators/index");

// import from controllers
const {
  register,
  registerActivate,
  login,
  requireSignin,
} = require("../controllers/authentication");

// Router-level middleware
// https://expressjs.com/en/guide/using-middleware.html

router.post("/register", userRegisterValidator, runValidation, register);
router.post("/register/activate", registerActivate);
router.post("/login", userLoginValidator, runValidation, login);
router.get("/secret", requireSignin, (req, res) => {
  res.json({
    data: "This is secret page for logged in users only",
  });
});

module.exports = router;

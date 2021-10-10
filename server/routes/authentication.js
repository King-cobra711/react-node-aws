const express = require("express");
const router = express.Router();

// import validators
const { userRegisterValidator } = require("../validators/authentication");
const { runValidation } = require("../validators/index");

// import from controllers
const { register } = require("../controllers/authentication");

router.post("/register", userRegisterValidator, runValidation, register);

module.exports = router;

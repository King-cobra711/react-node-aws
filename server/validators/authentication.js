const { check } = require("express-validator");

exports.userRegisterValidator = [
  check("username").not().isEmpty().withMessage("Username required"),
  check("email").isEmail().withMessage("Must be a valid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const { check } = require("express-validator");

exports.userRegisterValidator = [
  check("name").not().isEmpty().withMessage("Name required"),
  check("email").isEmail().withMessage("Must be a valid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
exports.userUpdateValidator = [
  check("name").not().isEmpty().withMessage("Name required"),
];
exports.userLoginValidator = [
  check("email").isEmail().withMessage("Must be a valid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

exports.forgotPasswordValidator = [
  check("email").isEmail().withMessage("Must be a valid email"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  check("resetPasswordLink").not().isEmpty().withMessage("Token is required"),
];

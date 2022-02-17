const { check } = require("express-validator");

exports.categoryCreateValidator = [
  check("name").not().isEmpty().withMessage("Name required"),
  check("image").isEmpty().withMessage("Image is required"),
  check("content")
    .isLength({ min: 20 })
    .withMessage("Please provide a description"),
];
exports.categoryUpdateValidator = [
  check("name").not().isEmpty().withMessage("Name required"),
  check("content")
    .isLength({ min: 20 })
    .withMessage("Please provide a description"),
];

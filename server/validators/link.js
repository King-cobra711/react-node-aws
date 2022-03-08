const { check } = require("express-validator");

exports.linkCreateValidator = [
  check("title").not().isEmpty().withMessage("Title required"),
  check("url").not().isEmpty().withMessage("Url required"),
  check("categories")
    .not()
    .isEmpty()
    .withMessage("At least 1 category is required"),
  check("type").not().isEmpty().withMessage("Choose a type  (free/paid)"),
  check("medium")
    .not()
    .isEmpty()
    .withMessage("Choose a medium  (video or book)"),
];
exports.linkUpdateValidator = [
  check("title").not().isEmpty().withMessage("Title required"),
  check("url").not().isEmpty().withMessage("Url required"),
  check("categories").notEmpty().withMessage("At least 1 category is required"),
  check("type").notEmpty().withMessage("Choose a type  (free/paid)"),
  check("medium").notEmpty().withMessage("Choose a medium  (video or book)"),
];

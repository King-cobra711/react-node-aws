const express = require("express");
const router = express.Router();

// import validatiors
const {
  linkCreateValidator,
  linkUpdateValidator,
} = require("../validators/link");
const { runValidation } = require("../validators/index");

//  import from controllers

const {
  requireSignin,
  authMiddleware,
} = require("../controllers/authentication");

const {
  create,
  read,
  list,
  update,
  remove,
  clickCount,
} = require("../controllers/link");

// routes

router.post(
  "/link",
  linkCreateValidator,
  runValidation,
  requireSignin,
  authMiddleware,
  create
);
router.get("/links", list);
router.put("/click-count", clickCount);
router.get("/link/:slug", read);
router.put(
  "/link/:slug",
  linkUpdateValidator,
  runValidation,
  requireSignin,
  authMiddleware,
  update
);
router.delete("/link/:slug", requireSignin, authMiddleware, remove);

module.exports = router;

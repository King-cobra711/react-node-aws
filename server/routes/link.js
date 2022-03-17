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
  adminMiddleware,
} = require("../controllers/authentication");

const {
  create,
  read,
  list,
  listUserLinks,
  listAdminLinks,
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
router.post("/user/links", requireSignin, authMiddleware, listUserLinks);
router.post("/admin/links", requireSignin, adminMiddleware, listAdminLinks);
router.put("/click-count", clickCount);
router.get("/link/:id", read);
router.put(
  "/link/:id",
  linkUpdateValidator,
  runValidation,
  requireSignin,
  authMiddleware,
  update
);
router.delete("/link/:id", requireSignin, authMiddleware, remove);

module.exports = router;

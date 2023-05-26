const express = require("express");
const {
  createProduct,
  getProduct,
  changeBreed,
} = require("../controllers/ProductController");

const router = express.Router();
router.route("/products/create").post(createProduct);
router.route("/products/changeBreed").post(changeBreed);
router.route("/products/:id").get(getProduct);

module.exports = router;

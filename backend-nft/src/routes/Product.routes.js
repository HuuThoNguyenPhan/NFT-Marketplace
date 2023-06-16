const express = require("express");
const {
  createProduct,
  getProduct,
  changeBreed,
  getTopics,
  changeOnly,
} = require("../controllers/ProductController");
const { createCart, deleteCart, deleteAllCart } = require("../controllers/CartController");

const router = express.Router();
router.route("/products/create").post(createProduct);
router.route("/products/changeBreed").post(changeBreed);
router.route("/products/:id").get(getProduct);
router.route("/topics").get(getTopics);
router.route("/changeOnly").get(changeOnly);
router.route("/addToCart").post(createCart);
router.route("/deleteCart").post(deleteCart);
router.route("/deleteALLCart").post(deleteAllCart);
module.exports = router;

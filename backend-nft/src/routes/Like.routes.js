const express = require("express");
const { like, countLike, getUserLike } = require("../controllers/ProductController");
const router = express.Router();

router.route("/like").post(like);
router.route("/like/count/:g").get(countLike);
router.route("/like/getUser/:genealogy").get(getUserLike);
module.exports = router;

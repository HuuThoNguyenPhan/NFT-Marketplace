const express = require("express");
const {
  changeReport,
  sendReport,
  getAllReports,
} = require("../controllers/ProductController");
const router = express.Router();

router.route("/reports").get(getAllReports);
router.route("/report").post(sendReport);
router.route("/report/changeReport").post(changeReport);


module.exports = router;
const express = require("express");
const {
  changeReport,
  sendReport,
  getAllReports,
  getAllContentReport,
} = require("../controllers/ProductController");
const router = express.Router();

router.route("/reports").get(getAllReports);
router.route("/getContentReports").get(getAllContentReport);
router.route("/sendReport").post(sendReport);
router.route("/report/changeReport").post(changeReport);


module.exports = router;
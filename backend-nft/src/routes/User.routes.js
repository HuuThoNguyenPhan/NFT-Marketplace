const express = require("express");
const { createUser, getAllUser, updateUser, changeVerified, addressUpdate, getAddress } = require("../controllers/UserController");

const router = express.Router();

router.route("/user/create").post(createUser);
router.route("/users").get(getAllUser);
router.route("/user/update").put(updateUser);
router.route("/user/changeVerified").put(changeVerified);
router.route("/address/update").put(addressUpdate);
router.route("/addresses").get(getAddress);


module.exports = router;
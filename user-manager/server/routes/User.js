const express = require("express");
const router = express.Router();
const getAllUser = require("../controllers/getUser");

// Controllers
router.route("/listuser").get(getAllUser.getListOfUsers);
router.route("/user/:id").get(getAllUser.getUserInfo);
router.route("/createuser").post(getAllUser.createUser);
router.route("/updateuser/:id").put(getAllUser.updateUser);
router.route("/deleteuser/:id").get(getAllUser.deleteUser);

module.exports = router;

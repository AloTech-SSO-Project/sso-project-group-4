const express = require("express");

const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const controller = require("../controller/index");

router.route("/").post(authenticate, controller.IsAuthorized);
router.route("/isAccessTokenValid").post(controller.isAccessTokenValid);

module.exports = router;

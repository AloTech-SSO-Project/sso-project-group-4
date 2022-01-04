const express = require("express");
const router = express.Router();
const controller = require("../controller/index");

// Middleware
const authenticate = require("../middlewares/authenticate");

// Controllers
router.route("/").post(authenticate, controller.IsAuthorized);
router.route("/isAccessTokenValid").post(controller.isAccessTokenValid);

module.exports = router;

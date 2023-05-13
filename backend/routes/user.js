const express = require("express");
// express router declared
const router = express.Router();

const userCtrl = require("../controllers/user");

// business logic from the user controllers imported and endpoints declared
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;

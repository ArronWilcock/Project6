// express router declared and required
const express = require("express");
const router = express.Router();

// required authentication middleware imported
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const saucesCtrl = require("../controllers/sauces");

// business logic from the controllers is imported. Then required endpoints & middleware is declared
router.get("/", auth, saucesCtrl.getAllSauces);
router.post("/", auth, multer, saucesCtrl.createSauce);
router.put("/:id", auth, multer, saucesCtrl.updateSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likeSauce);

// express router exported
module.exports = router;

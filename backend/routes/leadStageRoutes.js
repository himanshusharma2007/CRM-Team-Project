const express = require("express");
const { getStages, addStage, updateStage, deleteStage } = require("../controller/leadStageController");
const { jwtToken, checkAdmin, checkSubAdmin } = require("../middleware/auth");
const router = express.Router();

router.post("/add-stage", jwtToken, checkAdmin, addStage);
router.put("/update-stage", jwtToken, checkAdmin, updateStage);
router.delete("/delete-stage", jwtToken, checkAdmin, deleteStage);
router.get("/", jwtToken, checkSubAdmin, getStages);


module.exports = router;

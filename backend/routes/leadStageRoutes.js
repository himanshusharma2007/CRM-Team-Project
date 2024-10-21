const express = require("express");
const { getStages, addStage, updateStage, deleteStage } = require("../controller/leadStageController");
const { jwtToken } = require("../middleware/auth");
const { checkPermission } = require("../middleware/permission");
const router = express.Router();

router.post("/add-stage", jwtToken, checkPermission("leadStage create"), addStage);
router.put("/update-stage", jwtToken, checkPermission("leadStage update"), updateStage);
router.delete("/delete-stage", jwtToken, checkPermission("leadStage delete"), deleteStage);
router.get("/", jwtToken, checkPermission("leadStage read"), getStages);


module.exports = router;

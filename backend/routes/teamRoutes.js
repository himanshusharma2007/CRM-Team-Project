const express = require("express");
const router = express.Router();
const { createTeam, getAllTeam,getTeamById, updateTeam, deleteTeam, removeParticipant } = require("../controller/teamController");
const { jwtToken } = require("../middleware/auth")
const { checkPermission } = require("../middleware/permission")
const { checkAdmin } = require("../middleware/checkAdmin")

router.get("/", jwtToken,checkPermission("team read"), getAllTeam);
router.get("/:id", jwtToken, checkPermission("team read"), getTeamById);
router.post("/create", jwtToken, checkPermission("team create"), createTeam);
router.put("/update/:id", jwtToken, checkPermission("team update"), updateTeam);
router.delete("/delete/:id", jwtToken, checkAdmin, deleteTeam);
router.put("/removeParticipant/:id", jwtToken, checkPermission("team removeParticipant"), removeParticipant);

module.exports = router;

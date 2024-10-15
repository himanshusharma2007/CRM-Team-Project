const express = require("express");
const router = express.Router();
const { createTeam, getAllTeam,getTeamById, updateTeam, deleteTeam, removeParticipant } = require("../controller/teamController");
const { jwtToken, checkAdmin } = require("../middleware/auth")

router.get("/", jwtToken,checkAdmin, getAllTeam);
router.get("/:id", jwtToken, checkAdmin, getTeamById);
router.post("/create", jwtToken, checkAdmin, createTeam);
router.put("/update/:id", jwtToken, checkAdmin, updateTeam);
router.delete("/delete/:id", jwtToken, checkAdmin, deleteTeam);
router.post("/removeParticipant/:id", jwtToken, checkAdmin, removeParticipant);

module.exports = router;

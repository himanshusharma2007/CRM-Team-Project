const express = require("express");
const router = express.Router();
const { getUpcomingMeetings, createMeeting, getMeetingById, updateMeeting, getAllMeetingsByProjectId, getAllMeetingsByStatus } = require("../controller/meetingController");
const { jwtToken, checkAdmin } = require("../middleware/auth");

router.get("/:id", jwtToken,checkAdmin, getMeetingById);
router.get("/upcoming", jwtToken,checkAdmin, getUpcomingMeetings);
router.post("/create", jwtToken,checkAdmin, createMeeting);
router.put("/update/:id", jwtToken,checkAdmin, updateMeeting);
router.get("/project/:id", jwtToken,checkAdmin, getAllMeetingsByProjectId);
router.get("/status/:status", jwtToken,checkAdmin, getAllMeetingsByStatus);

module.exports = router;



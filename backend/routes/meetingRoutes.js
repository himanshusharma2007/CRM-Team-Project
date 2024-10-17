const express = require("express");
const router = express.Router();
const { getUpcomingMeetings, createMeeting, getMeetingById, updateMeeting, getAllMeetingsByProjectId, getAllMeetingsByStatus, getAllMeeting } = require("../controller/meetingController");
const { jwtToken } = require("../middleware/auth");
const { checkPermission } = require("../middleware/permission");

router.get("/upcoming", jwtToken,checkPermission("meeting read"), getUpcomingMeetings);
router.post("/create", jwtToken,checkPermission("meeting create"), createMeeting);
router.put("/update/:id", jwtToken,checkPermission("meeting update"), updateMeeting);
router.get("/project/:id", jwtToken,checkPermission("meeting read"), getAllMeetingsByProjectId);
router.get("/status/:status", jwtToken,checkPermission("meeting read"), getAllMeetingsByStatus);
router.get("/:id", jwtToken,checkPermission("meeting read"), getMeetingById);
router.get("/", jwtToken,checkPermission("meeting read"), getAllMeeting);

module.exports = router;



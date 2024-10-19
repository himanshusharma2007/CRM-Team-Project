const express = require("express");
const router = express.Router();
const { createMeeting, getMeetingById, getAllMeetingsByProjectId, getAllMeetingsByStatus, getAllMeeting, isMeetingConclusionCompleted } = require("../controller/meetingController");
const { jwtToken } = require("../middleware/auth");
const { checkPermission } = require("../middleware/permission");

router.post("/create", jwtToken,checkPermission("meeting create"), createMeeting);
router.get("/project/:id", jwtToken,checkPermission("meeting read"), getAllMeetingsByProjectId);
router.get("/status/:status", jwtToken,checkPermission("meeting read"), getAllMeetingsByStatus);
router.put("/conclusion/:id", jwtToken, checkPermission("meeting update"), isMeetingConclusionCompleted)
router.get("/:id", jwtToken,checkPermission("meeting read"), getMeetingById);
router.get("/", jwtToken,checkPermission("meeting read"), getAllMeeting);

module.exports = router;



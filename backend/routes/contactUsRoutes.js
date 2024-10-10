const express = require("express");
const router = express.Router();
const { createContactUs, getContactUs, deleteContactUs } = require("../controller/contactUsController");
const { jwtToken, checkAdmin } = require("../middleware/auth");

router.post("/", createContactUs);
router.get("/all-contactUs", jwtToken,checkAdmin, getContactUs);
router.delete("/delete-contactUs/:id", jwtToken,checkAdmin, deleteContactUs);
module.exports = router;   
const express = require("express");
const router = express.Router();
const { createContactUs, getContactUs } = require("../controller/contactUsController");
const { jwtToken, checkAdmin } = require("../middleware/auth");

router.post("/", createContactUs);
router.get("/all-contactUs", jwtToken,checkAdmin, getContactUs);
module.exports = router;   
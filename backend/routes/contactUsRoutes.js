const express = require("express");
const router = express.Router();
const { createContactUs, getContactUs, deleteContactUs, responedContactUs } = require("../controller/contactUsController");
const { jwtToken } = require("../middleware/auth");
const { checkPermission } = require("../middleware/permission");
const { checkAdmin }  = require("../middleware/checkAdmin")

router.post("/", createContactUs);
router.get("/all-contactUs", jwtToken, checkPermission("query read"), getContactUs);
router.delete("/delete-contactUs/:id", jwtToken, checkAdmin(), deleteContactUs);
router.put("/responed-contactUs/:id", jwtToken, checkPermission("query respond"), responedContactUs);

module.exports = router;
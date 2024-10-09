const express = require("express");
const router = express.Router();
const { createContact, getContacts } = require("../controller/contactController");
const { jwtToken, checkSubAdmin } = require("../middleware/auth");


router.get("/", jwtToken,checkSubAdmin, getContacts);
router.post("/create",jwtToken, checkSubAdmin, createContact);
module.exports = router;   
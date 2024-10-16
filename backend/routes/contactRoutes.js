const express = require("express");
const router = express.Router();
const { createContact, getContacts, deleteContact, updateContact } = require("../controller/contactController");
const { jwtToken, checkSubAdmin, checkAdmin } = require("../middleware/auth");


router.get("/", jwtToken,checkSubAdmin, getContacts);
router.post("/create",jwtToken, checkSubAdmin, createContact);
router.delete("/delete/:id",jwtToken, checkAdmin, deleteContact);
router.put("/update/:id",jwtToken, checkAdmin, updateContact);

module.exports = router;   
const express = require("express");
const router = express.Router();
const { createContact, getContacts, deleteContact, updateContact } = require("../controller/contactController");
const { jwtToken } = require("../middleware/auth");
const { checkPermission } = require("../middleware/permission");


router.get("/", jwtToken,checkPermission("contact read"), getContacts);
router.post("/create",jwtToken, checkPermission("contact create"), createContact);
router.delete("/delete/:id",jwtToken, checkPermission("contact delete"), deleteContact);
router.put("/update/:id",jwtToken, checkPermission("contact update"), updateContact);

module.exports = router;   
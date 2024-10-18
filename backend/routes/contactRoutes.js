const express = require("express");
const router = express.Router();
const { createContact, getContacts, deleteContact, updateContact } = require("../controller/contactController");
const { jwtToken } = require("../middleware/auth");
const { checkPermission } = require("../middleware/permission");


router.get("/", jwtToken,checkPermission("connection read"), getContacts);
router.post("/create",jwtToken, checkPermission("connection create"), createContact);
router.delete("/delete/:id",jwtToken, checkPermission("connection delete"), deleteContact);
router.put("/update/:id",jwtToken, checkPermission("connection update"), updateContact);

module.exports = router;   
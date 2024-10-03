const express = require("express")
const { createLead, getLeads,updateLead } = require("../controller/leadController")
const { jwtToken, checkSubAdmin, checkAdmin} = require("../middleware/auth")
const router = express.Router()

router.post("/create",jwtToken,checkSubAdmin, createLead)
router.get("/getLeads",jwtToken,checkSubAdmin,getLeads)
router.put("/update/:id",jwtToken,checkAdmin,updateLead)

module.exports = router
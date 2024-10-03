const express = require("express")
const { createLead, getLeads,updateLead, getLeadById, deleteLead, updateStage} = require("../controller/leadController")
const { jwtToken, checkSubAdmin, checkAdmin} = require("../middleware/auth")
const router = express.Router()

router.get("/",jwtToken,checkSubAdmin,getLeads)
router.post("/create",jwtToken,checkSubAdmin, createLead)
router.put("/update/:id",jwtToken,checkAdmin,updateLead)
router.get("/lead-details/:id", jwtToken, checkSubAdmin, getLeadById);
router.delete("/delete/:id", jwtToken,checkAdmin, deleteLead);
router.put("/update-stage/:id", jwtToken, checkSubAdmin, updateStage);


module.exports = router
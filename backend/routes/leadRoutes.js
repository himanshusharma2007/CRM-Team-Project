const express = require("express");
const {
  createLead,
  updateLead,
  deleteLead,
  getLeadById,
   updateStage,
  getLeads,
} = require("../controller/leadController");
const { jwtToken, checkSubAdmin, checkAdmin } = require("../middleware/auth");

const routers = express.Router();

routers.post("/create", jwtToken, checkAdmin, createLead);
routers.get("/lead-details/:id", jwtToken, checkSubAdmin, getLeadById);
routers.get("/", jwtToken, checkSubAdmin, getLeads);
routers.put("/update/:id", jwtToken, checkAdmin, updateLead);
routers.delete("/delete/:id", jwtToken, checkAdmin, deleteLead);
routers.put("/update-stage/:id", jwtToken, checkSubAdmin, updateStage);

module.exports = routers;

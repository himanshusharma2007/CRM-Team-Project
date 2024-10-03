const express = require("express");
const {
  createLead,
  updateLead,
  deleteLead,
  getLeadById,
  updateStage,
  getLeads,
} = require("../controller/leadController");
const { jwtToken } = require("../middleware/auth");

const routers = express.Router();

routers.post("/create", jwtToken, createLead);
routers.get("/lead-details/:id", jwtToken, getLeadById);
routers.get("/", jwtToken, getLeads);
routers.put("/update/:id", jwtToken, updateLead);
routers.delete("/delete/:id", jwtToken, deleteLead);
routers.put("/update-stage/:id", jwtToken, updateStage);

module.exports = router
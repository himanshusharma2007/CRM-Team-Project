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
const { checkPermission } = require("../middleware/permission");

const routers = express.Router();

routers.post("/create", jwtToken, checkPermission("lead create"), createLead);
routers.get("/lead-details/:id", jwtToken, checkPermission("lead read"), getLeadById);
routers.get("/", jwtToken, checkPermission("lead read"), getLeads);
routers.put("/update/:id", jwtToken, checkPermission("lead update"), updateLead);
routers.delete("/delete/:id", jwtToken, checkPermission("lead delete"), deleteLead);
routers.put("/update-stage/:id", jwtToken, checkPermission("lead updateStage"), updateStage);

module.exports = routers;

const express = require("express");
const { getAdminDashboardData } = require("../controller/dashboardController");
const { jwtToken } = require("../middleware/auth");
const { checkAdmin } = require("../middleware/checkAdmin")


const routers = express.Router();

routers.get("/admin", jwtToken, checkAdmin(), getAdminDashboardData);

module.exports = routers;

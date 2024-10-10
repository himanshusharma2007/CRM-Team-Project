const express = require("express");
const router = express.Router();
const { createClient, getAllClients, getClientById, updateClient, deleteClient } = require("../controller/clientController");
const { jwtToken, checkAdmin } = require("../middleware/auth");

router.get("/",jwtToken, checkAdmin,  getAllClients);
router.get("/:id",jwtToken, checkAdmin,  getClientById);
router.post("/create",jwtToken, checkAdmin,  createClient);
router.put("/update/:id",jwtToken, checkAdmin,  updateClient);

module.exports = router;

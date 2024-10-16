const express = require("express");
const router = express.Router();
const { createClient, getAllClients, getClientById, updateClient, deleteClient } = require("../controller/clientController");
const { jwtToken } = require("../middleware/auth");
const { checkPermission } = require("../middleware/permission");


router.get("/",jwtToken, checkPermission("client read"),  getAllClients);
router.post("/create",jwtToken, checkPermission("client create"),  createClient);
router.put("/update/:id",jwtToken, checkPermission("client update"),  updateClient);
router.get("/:id",jwtToken, checkPermission("client read"),  getClientById);
router.delete("/:id",jwtToken, checkPermission("client delete"),  deleteClient);

module.exports = router;
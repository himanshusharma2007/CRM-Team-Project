const express = require("express");
const { getUser, getAllUser } = require("../controller/userController");
const { jwtToken, checkAdmin } = require("../middleware/auth")


const routers = express.Router()

routers.get("/", jwtToken, getUser)
routers.get("/allUsers", jwtToken, checkAdmin, getAllUser)

module.exports = routers
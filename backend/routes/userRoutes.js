const express = require("express");
const { getUser, getAllUser, getUserById, getUnVerifiedUser, verifyUser } = require("../controller/userController");
const { jwtToken, checkAdmin, checkSubAdmin } = require("../middleware/auth")


const routers = express.Router()

routers.get("/", jwtToken, getUser)
routers.get("/allUsers", jwtToken, checkAdmin, getAllUser)
routers.get("/unverified", jwtToken, checkAdmin, getUnVerifiedUser)
routers.get("/:id", jwtToken, checkSubAdmin, getUserById)
routers.post("/verifyUser", jwtToken, checkAdmin, verifyUser)

module.exports = routers
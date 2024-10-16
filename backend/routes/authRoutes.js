const express = require("express");
const { login, registerUser, logout, updatePassword, sendOtp, verifyOtp, resetPassword, sendOtpForRegister } = require("../controller/authController");
const { jwtToken } = require("../middleware/auth")


const routers = express.Router()

routers.post("/signup", registerUser)
routers.post("/signup/emailVerify", sendOtpForRegister)
routers.post("/login", login)
routers.get("/logout", logout)
routers.put("/reset", jwtToken, updatePassword)
routers.post("/forgotPassword/sendOtp", sendOtp)
routers.post("/forgotPassword/verifyOtp", verifyOtp)
routers.post("/forgotPassword/resetPassword", resetPassword)

module.exports = routers
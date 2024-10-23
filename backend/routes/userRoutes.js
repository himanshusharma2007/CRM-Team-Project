const express = require("express");
const { 
  getUser, 
  getAllUser, 
  getUserById, 
  getUnVerifiedUser, 
  verifyUser, 
  uploadProfileImage, 
  updateUserPermission,
  blockUser,
  unblockUser
} = require("../controller/userController");
const { jwtToken } = require("../middleware/auth")
const { checkPermission } = require("../middleware/permission");
const { checkAdmin } = require("../middleware/checkAdmin");
const upload = require("../middleware/multer");

const routers = express.Router()

routers.get("/", jwtToken, getUser)
routers.get("/allUsers", jwtToken, checkPermission("user read"), getAllUser)
routers.get("/unverified", jwtToken, checkPermission("user read"), getUnVerifiedUser)
routers.post("/verifyUser", jwtToken, checkPermission("user verifyAndAssignRoleAndTeam"), verifyUser)
routers.get("/:id", jwtToken, checkPermission("user read"), getUserById)
routers.patch("/uploadProfileImage", jwtToken, upload.single("profileImage"), uploadProfileImage)
routers.put("/updateUserPermission/:id", jwtToken, updateUserPermission)  

// New routes for blocking and unblocking users
routers.put("/block/:userId", jwtToken,checkAdmin(), blockUser)
routers.put("/unblock/:userId", jwtToken, checkAdmin(), unblockUser)

module.exports = routers

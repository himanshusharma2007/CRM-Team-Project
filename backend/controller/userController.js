const user = require("../models/userModels");
const team = require("../models/teamModels");
const uploadOnCloudinary = require("../utils/cloudinary");

exports.getUser = async (req, res) => {
  try {
    let user = req.user;
    res.status(200).json(user);
  } catch (error) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await user.findById(id);
    if (!userData) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send(userData);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

exports.getUnVerifiedUser = async (req, res) => {
  try {
    const users = await user.find({ verify: false, role: { $ne: "admin" } });
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    console.log("Req.body in verifyUser", req.body);
    const { userId, teamId, role, permissions } = req.body;
    console.log("permissions", permissions);

    if (!userId || !teamId || !permissions) {
      return res.status(400).send({
        success: false,
        message: "Please fill all fields",
      });
    }

    const userData = await user.findById(userId);
    console.log(userData);
    if (!userData) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    const teamData = await team.findById(teamId);
    console.log(teamData);
    if (!teamData) {
      return res.status(400).send({
        success: false,
        message: "Team not found",
      });
    }

    teamData.participants.push(userData._id);
    userData.verify = true;
    userData.teamId = teamId;
    userData.role = role || "emp";
    userData.permission = permissions; // Store the permissions

    if (userData.role === "admin" || userData.role === "subAdmin") {
      teamData.leaderId = userData._id;
    }

    await teamData.save();
    await userData.save();
    console.log("verified user ", userData);
    return res.status(200).send({
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    const { path } = req.file;
    console.log(path)
    const userData = await user.findById(req.user._id);
    if (!userData) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }
    const uploadResponse = await uploadOnCloudinary(path);
    if (!uploadResponse) {
      throw new Error("Failed to upload image on cloudinary");
    }
    userData.profileImage = uploadResponse.url;
    await userData.save();
    return res.status(200).send({
      success: true,
      message: "Profile image uploaded successfully",
      imageUrl: uploadResponse.url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

exports.updateUserPermission = async (req, res) => {
  try {
    console.log("update permission called",req.body);
    const { permission } = req.body;
    console.log("Received permission update request:", permission);
    
    const userData = await user.findById(req.params.id);
    if (!userData) {
      console.log(`User with ID: ${req.params.id} not found`);
      return res.status(404).json({ error: "User not found" });
    }
    
    console.log(`Current permissions for user ID ${userData._id}:`, userData.permission);
    userData.permission = permission;
    await userData.save();

    console.log(`User permissions updated successfully for user ID: ${userData._id}`);
    return res.status(200).json({ message: "User permission updated successfully" });
  } catch (error) {
    console.error("Error in updateUserPermission:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Attempting to block user with ID: ${userId}`);
    
    const userData = await user.findById(userId);
    if (!userData) {
      console.log(`User with ID: ${userId} not found`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    userData.isBlocked = true;
    await userData.save();
    console.log(`User with ID: ${userId} has been blocked successfully`);
    
    return res.status(200).json({
      success: true,
      message: "User blocked successfully",
    });
  } catch (error) {
    console.log("Error in blockUser:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Attempting to unblock user with ID: ${userId}`);
    
    const userData = await user.findById(userId);
    if (!userData) {
      console.log(`User with ID: ${userId} not found`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    userData.isBlocked = false;
    await userData.save();
    console.log(`User with ID: ${userId} has been unblocked successfully`);
    
    return res.status(200).json({
      success: true,
      message: "User unblocked successfully",
    });
  } catch (error) {
    console.log("Error in unblockUser:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

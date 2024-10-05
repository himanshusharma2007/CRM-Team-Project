const user = require("../models/userModels");

exports.getUser = async (req, res) => {
  try {
    let user = req.user;
    res
      .status(200)
      .json(user);
  } catch (error) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await user.find()
    res.status(200).send(users);
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const {email} = req.params;
    const userData = await user.findOne({email: email})
    if(!userData){
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send(userData);
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

exports.getUnVerifiedUser = async (req, res) => {
  try {
    const users = await user.find({verify: false})
    res.status(200).send(users);
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

exports.verifyUser = async (req, res) => {
  try{
    const {userId, teamId, role} = req.body;
    if(!userId || !teamId ){
      return res.status(400).send({
        success: false,
        message: "please fill all fields",
      });
    }
    const userData = await user.findById(userId)
    if(!userData){
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }
    const teamData = await team.findById(teamId);
    if(!teamData){
      return res.status(400).send({
        success: false,
        message: "Team not found",
      });
    }
    teamData.participants.push(userData._id);
    userData.verify = true;
    userData.teamId = teamId;
    userData.role = role || "emp";
    if(userData.role === "admin" || userData.role === "subAdmin"){
      teamData.leaderId = userData._id;
    }
    await teamData.save();
    await userData.save();
    return res.status(200).send({
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  } 
}

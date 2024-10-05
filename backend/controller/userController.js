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
    
    userData.verify = true;
    userData.teamId = teamId;
    userData.role = role;
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

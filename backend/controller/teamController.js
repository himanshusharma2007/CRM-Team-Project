const Team = require("../models/teamModels");
const User = require("../models/userModels");


exports.createTeam = async (req, res) => {
  try {
    const { teamName, department } = req.body;
    if(!teamName || !department){
      return res.status(400).send({
        success: false,
        message: "please fill all fields"
      })
    }
    const team = await Team.create({
      teamName,
      department
    });
    return res.status(200).send(team);
  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

exports.getAllTeam = async (req, res) => {
  try {
    const team = await Team.find().populate("participants leaderId");
    return res.status(200).send(team);
  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error", 
    });
  }
}

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("participants leaderId");
    if(!team){
      return res.status(400).send({
        success: false,
        message: "Team not found",
      });
    }
    return res.status(200).send(team);
  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error",  
    });
  }
}

exports.updateTeam = async (req, res) => {
    try {
        const { teamName, department } = req.body;
        if(!teamName || !department){
            return res.status(400).send({
                success: false,
                message: "please fill all fields"
            })
        }
        const team = await Team.findByIdAndUpdate(req.params.id, { teamName, department }, { new: true });
        return res.status(200).send(team);
    } catch (err) {
        console.log("err", err)
        return res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
}


exports.deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const teamData = await Team.findById(teamId).populate("participants");
    if(!teamData){
      return res.status(400).send({
        success: false,
        message: "Team not found",
      });
    }
    await teamData.participants.map((item) => {
      item.teamId = null;
      item.save();
    })
    await teamData.deleteOne();
    return res.status(200).send({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}


exports.removeParticipant = async (req, res) => {
  try {
    const { participantId } = req.body;
    const teamId = req.params.id;
    const team = await Team.findById(teamId);
    if(!team){
      return res.status(400).send({
        success: false,
        message: "Team not found",
      });
    }
    const participant = await User.findById(participantId);
    if(!participant){
      return res.status(400).send({
        success: false,
        message: "Participant not found",
      });
    }
    if(!team.participants.includes(participantId)){
      return res.status(400).send({
        success: false,
        message: "Participant not in team",
      });
    }
    if(team.leaderId.equals(participantId)){
      team.leaderId = null;
      participant.role = "emp";
    }
    await team.participants.pull(participantId);
    participant.team = null;
    participant.verify = false;
    await participant.save();
    await team.save();
    return res.status(200).send({
      success: true,
      message: "Participant removed successfully",
    });
  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}



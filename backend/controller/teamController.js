const Team = require("../models/teamModel");


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
    const team = await Team.find();
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
    const team = await Team.findById(req.params.id).populate("participants", "leaderId");
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



const stages = require("../models/leadStagesModels");
const lead = require("../models/leadModels");


exports.addStage = async (req, res) => {
  try {
    if (!req.body.stageName) {
      return res.status(400).send({
        success: false,
        message: "stageName is required",
      });
    }
    if (await stages.findOne({stageName: req.body.stageName})) {
      return res.status(400).send({
        success: false,
        message: "stageName already exists",
      });
    }
    const stagesData = await stages.create(req.body);
    return res.status(200).send(stagesData);
  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getStages = async (req, res) => {
  try {
    const stagesData = await stages.find().populate("leads");
    return res.status(200).send(stagesData);
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteStage = async (req, res) => {
  try {
    const { stageName } = req.body;
    if (!stageName) {
      return res.status(400).send({
        success: false,
        message: "stageName is required",
      });
    }
    const stagesData = await stages.findOne({stageName});
    if (!stagesData) {
      return res.status(404).send({
        success: false,
        message: "stage not found",
      });
    }
    if(stagesData.leads.length > 0) {
      return res.status(400).send({
        success: false,
        message: "stage has leads, so it cannot be deleted",
      });
    }
    const stage = await stages.findOneAndDelete({stageName});
    return res.status(200).send({
        success: true,
        message: "stage deleted successfully",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

exports.updateStage = async (req, res) => {
  try {
    const { stageName, newStageName } = req.body;
    if (!stageName || !newStageName) {
      return res.status(400).send({
        success: false,
        message: "stageName and newStageName are required",
      });
    }
    console.log(stageName, newStageName);
    if(! (await stages.findOne({stageName}))){
        return res.status(400).send({
            success: false,
            message: "stageName does not exist",
          });
    }
    if (await stages.findOne({stageName: newStageName})) {
      return res.status(400).send({
        success: false,
        message: "newStageName already exists",
      });
    }
    const stage = await stages.findOneAndUpdate({stageName}, {stageName: newStageName});
    await stage.leads.map( async (leadId) => {
      console.log(leadId);
      await lead.findByIdAndUpdate(leadId, {currentStage: newStageName});
    });
    const updatedStage = await stages.findOne({stageName: newStageName}).populate("leads");
    console.log(updatedStage);
    return res.status(200).send(updatedStage);
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}


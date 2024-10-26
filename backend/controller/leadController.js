const lead = require("../models/leadModels");
const stages = require("../models/leadStagesModels");
const contact = require("../models/contactModels");

exports.createLead = async (req, res) => {
  console.log("req.body in create lead", req.body);
  const {
    title,
    companyName,
    contactName,
    phone,
    email,
    description,
    stage,
    location,
  } = req.body;

  try {
    if (
      !title ||
      !companyName ||
      !contactName ||
      !phone ||
      !email ||
      !description ||
      !location
    ) {
      console.log("please fill all fields");
      return res.status(400).send({
        success: false,
        message: "please fill all fields",
      });
    }
    const stageData = await stages.findOne({ stageName: stage });
    console.log("stageData", stageData);
    if (!stageData) {
      console.log("stageName does not exist");
      return res.status(400).send({
        success: false,
        message: "stageName does not exist",
      });
    }
    if (
      !(await contact.findOne({ email })) ||
      !(await contact.findOne({ phoneNo: phone }))
    ) {
      const contactData = await contact.create({
        contactName,
        companyName,
        email,
        phoneNo: phone,
      });
    }
    const leaddata = await lead.create({
      title,
      companyName,
      contactName,
      phone,
      email,
      description,
      location,
      currentStage: stageData.stageName,
      location,
    });
    stageData.leads.push(leaddata._id);
    await stageData.save();
    res.status(201).send(leaddata);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await lead
      .find()
      .populate("assignedTo team")
      .select("-password");
    res.status(200).send(leads);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching leads", error: error.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    console.log("update lead called");
    const { id } = req.params;

    // Find the lead by its ID
    console.log(id);
    let leaddata = await lead.findById(id);

    if (!leaddata) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Update the lead with the new values from req.body
    Object.assign(leaddata, req.body);

    // Save the updated lead
    await leaddata.save();

    console.log("Lead updated successfully");
    res.status(200).json(leaddata);
  } catch (error) {
    console.log("Error in update lead:>> ", error);
    res
      .status(400)
      .json({ message: "Error updating lead", error: error.message });
  }
};

exports.updateStage = async (req, res) => {
  try {
    console.log("req.body in update Stage", req.body);
    const { stageName } = req.body;
    const { id } = req.params;
    const leadData = await lead.findById(id);
    if (!leadData) {
      return res.status(400).send({
        success: false,
        message: "lead does not exist",
      });
    }
    if (leadData.currentStage === stageName) {
      return res.status(400).send({
        success: false,
        message: "lead already in this stage",
      });
    }
    const stageData = await stages.findOne({ stageName });
    if (!stageData) {
      return res.status(400).send({
        success: false,
        message: "stageName does not exist",
      });
    }
    stageData.leads.push(leadData._id);
    await stageData.save();

    const oldStageData = await stages.findOne({
      stageName: leadData.currentStage,
    });
    oldStageData.leads = oldStageData.leads.filter(
      (lead) => lead.toString() !== leadData._id.toString()
    );
    await oldStageData.save();

    leadData.currentStage = stageName;
    await leadData.save();
    res.status(200).send(leadData);
  } catch (error) {
    console.log("Error in updateStage:>> ", error);
    res
      .status(400)
      .json({ message: "Error updateStage lead", error: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    console.log("delete lead called");
    const { id } = req.params;
    const deletedLead = await lead.findByIdAndDelete(id);
    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const stageData = await stages.findOne({
      stageName: deletedLead.currentStage,
    });
    stageData.leads = stageData.leads.filter(
      (lead) => lead.toString() !== deletedLead._id.toString()
    );
    await stageData.save();

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting lead", error: error.message });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("get lead by id called", id);
    const leadData = await lead
      .findOne({ _id: id })
      .populate("assignedTo team")
      .select("-password");
    console.log("lead in get lead by id:>> ", leadData);
    res.status(200).json(leadData);
  } catch (error) {
    console.log("error in getLeadById", error);
    res
      .status(500)
      .json({ message: "Error fetching leads", error: error.message });
  }
};

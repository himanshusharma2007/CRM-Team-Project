const lead = require("../models/leadModels");
const user = require("../models/userModels");

exports.createLead = async (req, res) => {
  const { title, companyName, contactName, phone, description, stage } =
    req.body;

  try {
    if (!title || !companyName || !contactName || !phone || !description) {
      return res.status(400).send({
        success: false,
        message: "please fill all fields",
      });
    }
    const leaddata = await lead.create({
      title,
      companyName,
      contactName,
      phone,
      description,
      stage,
    });
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
    const leads = await lead.find().populate("assignedTo", "team");
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
    console.log("update lead called");
    const { id } = req.params;
    let lead = await lead.findOne({ _id: id });
    const { stage } = req.body;
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    lead.stage = stage;
    await lead.save();

    console.log("Lead updateStage successfully");
    res.status(200).json(lead);
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
    const lead = await lead
      .findOne({ _id: id })
      .populate("assignedTo", "-password");
    console.log("lead in get lead by id:>> ", lead);
    res.status(200).json(lead);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching leads", error: error.message });
  }
};

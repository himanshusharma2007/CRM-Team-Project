const leal = require("../models/leadModels")
const user = require("../models/userModels")


exports.createLead = async (req, res) => {
  const { lealName, companyName, contactName,phone, description, stage} = req.body;

  try {
    if(!lealName || !companyName || !contactName || !phone || !description){
      return res.status(400).send({
        success:false,
        message: "please fill all fields"
      })
    }
    const leader = await user.findById(leaderId)
    if(!leader){
    	return res.status(400).send({
    		success: false,
    		message: "leader not found"
    	})
    }
    const leaddata = await lead.create({
      leadName,
      companyName,
      contactName,
      phone,
      description,
      stage
    });
    res.status(201).send(leaddata);
  } catch (err) {
    console.log(err)
    res.status(500).send({
      success: false,
      message: "Internel server error"
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
    let lead = await lead.findOne({ _id: id });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Update the lead with the new values from req.body
    Object.assign(lead, req.body);

    // Save the updated lead
    await lead.save();

    console.log("Lead updated successfully");
    res.status(200).json(lead);
  } catch (error) {
    console.log("Error in update lead:>> ", error);
    res
      .status(400)
      .json({ message: "Error updating lead", error: error.message });
  }
};
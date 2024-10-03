const lead = require("../models/leadModels")
const user = require("../models/userModels")


exports.createLead = async (req, res) => {
  const { title, companyName, contactName,phone, description, stage} = req.body;

  try {
    if(!title || !companyName || !contactName || !phone || !description){
      return res.status(400).send({
        success:false,
        message: "please fill all fields"
      })
    }
    const leaddata = await lead.create({
      title,
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
    console.log(id)
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
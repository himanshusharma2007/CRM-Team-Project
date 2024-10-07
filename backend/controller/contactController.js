const contact = require("../models/contactModels");

exports.createContact = async (req, res) => {
  try {
    const { contactName, companyName, email, phoneNo} = req.body;
    if(!contactName || !companyName || !email || !phoneNo){
      return res.status(400).send({
        success: false,
        message: "please fill all fields"
      })
    }
    const contactData = await contact.create({
      contactName,
      companyName,
      email,
      phoneNo,
    });
    return res.status(200).send(contactData);
  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

exports.getContact = async (req, res) => {
  try {
    const contactData = await contact.find();
    return res.status(200).send(contactData);
  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}


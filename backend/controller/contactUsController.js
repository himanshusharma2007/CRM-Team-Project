const contactUs = require("../models/contactUsModels");
const sendEmail = require("../utils/mail");

exports.createContactUs = async (req, res) => {
  const { name, email, message, subject } = req.body;
  try {
    if(!name || !email || !message || !subject){
      return res.status(400).send({
        success: false,
        message: "please fill all fields"
      })
    }
    const userId = req.cookies.token || null;
    const contactUsData = await contactUs.create({
      name,
      email,
      message,
      subject,
      userId
    });
    let msg = `Thank you for contacting us, ${name} We will get back to you soon.`;
    await sendEmail(email, "Thank you for contacting us", msg);
    let msg1 = `New Contact Us from ${name}, ${email}, ${subject}, ${message}`;
    await sendEmail(process.env.TEAM_EMAIL, "New Contact Us", msg1);
    return res.status(200).send({
      success: true,
      message: "Contact Us created successfully",
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getContactUs = async (req, res) => {
  try {
    const contactUsData = await contactUs.find({});
    return res.status(200).send(contactUsData);
  } catch (err) {
    console.log("err", err);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteContactUs = async (req, res) => {
  try {
    const { id } = req.params;
    const contactUsData = await contactUs.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "Contact Us deleted successfully",
    });
  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
} 

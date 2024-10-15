const Contact = require("../models/contactModels");

exports.createContact = async (req, res) => {
  try {
    console.log(req.body);
    const {  contactName, companyName, email,  phoneNo } = req.body;
    if (!contactName || !companyName || !email || !phoneNo) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (
      (await Contact.findOne({ email })) ||
      (await Contact.findOne({ phoneNo }))
    ) {
      return res
        .status(400)
        .json({ error: "Contact email or phone number already exists" });
    }
    const contact = await Contact.create({
      contactName,
      companyName,
      email,
      phoneNo,
    });
    res.status(201).json(contact);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    console.log(req.user.role);
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    if (!(await Contact.findById(req.params.id))) {
      return res.status(400).json({ error: "Contact not found" });
    }
    const contact = await Contact.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    console.log("req.body in update", req.body);
    const {  contactName, companyName, email,  phoneNo } = req.body;
    const contactData = await Contact.findById(req.params.id);
    console.log("contactData", contactData);
    if (!contactData) {
      return res.status(400).json({ error: "Contact not found" });
    }
    if (
      (email || phoneNo) &&
      contactData.email !== email &&
      contactData.phoneNo !== phoneNo
    ) {
      if (await Contact.findOne({ email })) {
        return res.status(400).json({ error: "Contact email already exists" });
      }
      if (await Contact.findOne({ phoneNo })) {
        return res
          .status(400)
          .json({ error: "Contact phone number already exists" });
      }
    }

    const data = await Contact.findByIdAndUpdate(
      req.params.id,
      { contactName, companyName, email, phoneNo },
      { new: true }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

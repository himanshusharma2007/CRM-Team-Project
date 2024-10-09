const Contact = require("../models/contactModels");

exports.createContact = async (req, res) => {
  try {
    const {contactName, companyName, email, phoneNo} = req.body;
    if(!contactName || !companyName || !email || !phoneNo){
        return res.status(400).json({error: "All fields are required"});
    }
    if(await Contact.findOne({email}) || await Contact.findOne({phoneNo})){
        return res.status(400).json({error: "Contact email or phone number already exists"});
    }
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
};

exports.getContacts = async (req, res) => {
  try {
    console.log(req.user.role);
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
};

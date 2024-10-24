const client = require("../models/clientModels");
const contact = require("../models/contactModels");
const lead = require("../models/leadModels");
const project = require("../models/projectModels");

exports.createClient = async (req, res) => {
    try {
        const { name, company, phone, email, location, timeZone} = req.body;
        if(!name || !company || !phone || !email || !location){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(await client.findOne({email})){
            return res.status(400).json({ message: "Client email already exists" });
        }
        if(await client.findOne({phone})){
            return res.status(400).json({ message: "Client phone no. already exists" });
        }
        const clientContact = await contact.findOne({phoneNo : phone, email});
        if(!clientContact){
            await contact.create({contactName: name, companyName: company, phoneNo: phone, email});
        }
        console.log({ name, company, phone, email, location, timeZone})
        const newClient = await client.create({name, company, phone, email, location, timeZone});
        return res.status(201).json(newClient);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.createClientByLead = async (req, res) => {
    try {
        console.log("Create client")
        const {leadId} = req.params;
        const leadData = await lead.findById(leadId);
        if(!leadData){
            return res.status(404).json({ error: "Lead not found" });
        }
        if(await client.find({email: leadData.email})){
            return res.status(400).json({
                error: "client already exists"
            })
        }
        const newClient = await client.create({name: leadData.contactName, company: leadData.companyName, phone: leadData.phone, email: leadData.email, location: leadData.location});
        return res.status(201).json(newClient);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.getAllClients = async (req, res) => {
    try {
        const clients = await client.find().populate("projectId");
        return res.status(200).json(clients);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const clientData = await client.findById(id).populate("projectId");
        if (!clientData) {
            return res.status(404).json({ error: "Client not found" });
        }
        return res.status(200).json(clientData);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, company, phone, email, location } = req.body;
        const clientData = await client.findById(id);
        if (!clientData) {
            return res.status(404).json({ error: "Client not found" });
        }
        if(phone && (await client.findOne({phone}))){
            return res.status(400).json({ error: "Client phone no. already exists" });
        }
        if(email && (await client.findOne({email}))){
            return res.status(400).json({ error: "Client email already exists" });
        }
        if(phone || email){
            const clientContact = await contact.findOne({phone: clientData.phone, email: clientData.email});
            clientContact.contactName = name || clientContact.contactName;
            clientContact.companyName = company || clientContact.companyName;
            clientContact.phone = phone || clientContact.phone;
            clientContact.email = email || clientContact.email;
            await clientContact.save();
        }
        clientData.name = name || clientData.name;
        clientData.company = company || clientData.company;
        clientData.phone = phone || clientData.phone;
        clientData.email = email || clientData.email;
        clientData.location = location || clientData.location;
        await clientData.save();
        return res.status(200).json(clientData);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const clientData = await client.findById(id);
        if (!clientData) {
            return res.status(404).json({ error: "Client not found" });
        }
        const projectData = await project.findOne({clientId: id});
        if(projectData){
            return res.status(400).json({ error: "Client has a project" });
        }
        await clientData.deleteOne(); // Use deleteOne instead of delete
        return res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        console.error("Error deleting client:", error); // More detailed logging
        return res.status(500).json({ error: "Internal server error" });
    }
};


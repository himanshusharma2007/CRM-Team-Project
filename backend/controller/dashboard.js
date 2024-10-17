const User = require("../models/userModels")
const Lead = require("../models/leadModels")
const LeadStage = require("../models/leadStagesModels")
const Project = require("../models/leadStagesModels")
const Client = require("../models/leadStagesModels")
const Meeting = require("../models/leadStagesModels")


exports.getAdminDashboardData = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

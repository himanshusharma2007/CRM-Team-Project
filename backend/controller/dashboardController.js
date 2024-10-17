const User = require("../models/userModels")
const Lead = require("../models/leadModels")
const LeadStage = require("../models/leadStagesModels")
const Project = require("../models/projectModels")
const Client = require("../models/clientModels")


const leadStatics = async() =>{
    try {
        let leadData = {}
        leadData.total = await Lead.countDocuments(); // Total leads
        // Use `for...of` to iterate over stages and await the results
        const stages = await LeadStage.find();
        for (const item of stages) {
            let name = item.stageName;
            // Await Lead count for each stage
            leadData[name] = await Lead.countDocuments({ currentStage: name });
        }
        console.log(leadData);
        return leadData;
    } catch (error) {
        console.log(error)
        throw error;
        
    }
}

const projectStatics = async () =>{
    try{
        let projectData = {}
        projectData.total = await Project.countDocuments()
        // ["pending", "ongoing", "completed", "cancelled"],
        projectData.pending = await Project.countDocuments({projectStatus: "pending"})
        projectData.ongoing = await Project.countDocuments({projectStatus: "ongoing"})
        projectData.completed = await Project.countDocuments({projectStatus: "completed"})
        projectData.cancelled = await Project.countDocuments({projectStatus: "cancelled"})
        return projectData;
    }catch(error){
        console.log(error)
        throw error;
    }
}

const userStatics = async (req) =>{
    try{
        const userData = {}
        userData.total = await User.countDocuments()
        userData.active = await User.countDocuments({isActive: true})
        userData.verify = await User.countDocuments({verify: true, _id: {$ne: req.user._id}})
        userData.subAdmin = await User.countDocuments({role: "subAdmin"})
        userData.emp = await User.countDocuments({role: "emp"})
        return userData
    }catch(error){
        console.log(error)
        throw error;
    }
}


exports.getAdminDashboardData = async (req, res) => {
    try {
        const leadData = await leadStatics()
        const projectData = await projectStatics()
        const userData = await userStatics(req)
        return res.status(200).send({leadData, projectData, userData});
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
}

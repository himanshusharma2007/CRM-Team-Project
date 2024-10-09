const project = require("../models/projectModels");
const client = require("../models/clientModels");

exports.createProject = async (req, res) => {
    try {
        const { name, description, serviceType, projectStatus, clientId, teamIds} = req.body;
        let hashtages = req.body.hashtages;
        if(!name || !description || !serviceType || !clientId){
            return res.status(400).json({ error: "All fields are required" });
        }
        if(await project.findOne({name})){
            return res.status(400).json({ error: "Project name already exists" });
        }
        hashtages = hashtages ? hashtages.split(",") : [];
        const newProject = await project.create({ name, description, serviceType, projectStatus, clientId, hashtages, teamIds });
        res.status(201).json(newProject);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await project.find();
        res.status(200).json(projects);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const projectData = await project.findById(req.params.id).populate("clientId teamIds");
        if(!projectData){
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json(projectData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getProjectByClientId = async (req, res) => {
    try {
        if(!(await client.findById(req.params.id))){
            return res.status(404).json({ error: "Client not found" });
        }
        const projectData = await project.find({ clientId: req.params.id });
        res.status(200).json(projectData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { name, description, serviceType, projectStatus, teamIds } = req.body;
        let hashtages = req.body.hashtages;
        const projectData = await project.findById(req.params.id);
        if(!projectData){
            return res.status(404).json({ error: "Project not found" });
        }
        const existingProject = await project.findOne({name, _id: {$ne: req.params.id}});
        if(existingProject){
            return res.status(400).json({ error: "Project name already exists" });
        }
        hashtages = hashtages ? hashtages.split(",") : [];
        await hashtages.map(async (item) => {
            if(!(projectData.hashtages.includes(item))){
                projectData.hashtages.push(item);
            }
        });
        await teamIds.map(async (item) => {
            if(!(projectData.teamIds.includes(item))){
                projectData.teamIds.push(item);
            }
        });
        projectData.name = name || projectData.name;
        projectData.description = description || projectData.description;
        projectData.serviceType = serviceType || projectData.serviceType;
        projectData.projectStatus = projectStatus || projectData.projectStatus;
        await projectData.save();
        res.status(200).json(projectData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

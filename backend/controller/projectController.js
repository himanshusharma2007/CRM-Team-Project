const project = require("../models/projectModels");

exports.createProject = async (req, res) => {
    try {
        const { name, description, serviceType, projectStatus, clientId, hashtages, teamIds} = req.body;
        if(!name || !description || !serviceType || !clientId){
            console.log("all feild are")
            return res.status(400).json({ error: "All fields are required" });
        }
        if(await project.findOne({name})){
            return res.status(400).json({ error: "Project name already exists" });
        }
        hashtages = (hashtages) ? hashtages.split(",") : [];
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
        const project = await project.findById(req.params.id);
        if(!project){
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { name, description, serviceType, projectStatus, hashtages, teamIds } = req.body;
        const projectData = await project.findById(req.params.id);
        if(!projectData){
            return res.status(404).json({ error: "Project not found" });
        }
        const existingProject = await project.findOne({name, _id: {$ne: req.params.id}});
        if(existingProject){
            return res.status(400).json({ error: "Project name already exists" });
        }
        projectData.name = name || projectData.name;
        projectData.description = description || projectData.description;
        projectData.serviceType = serviceType || projectData.serviceType;
        projectData.projectStatus = projectStatus || projectData.projectStatus;
        projectData.hashtages = hashtages.split(",") || projectData.hashtages;
        projectData.teamIds = teamIds || projectData.teamIds;
        await projectData.save();
        res.status(200).json(updatedProject);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

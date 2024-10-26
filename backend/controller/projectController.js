const project = require("../models/projectModels");
const client = require("../models/clientModels");
const team = require("../models/teamModels");
const uploadOnCloudinary = require("../utils/cloudinary");

const uploadProjectImage = async (req, res, projectId) => {
  try {
    const { path } = req.file;
    const projectData = await project.findById(projectId);
    if (!projectData) {
      return res.status(404).json({ error: "Project not found" });
    }
    console.log("file upload started......................");
    const uploadResponse = await uploadOnCloudinary(path);
    console.log("uploadResponse", uploadResponse);
    if (!uploadResponse) {
      throw new Error("Failed to upload image on cloudinary");
    }
    projectData.projectImage = uploadResponse.url;
    await projectData.save();
    console.log("file uploaded successfully......................");
    return uploadResponse.url;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createProject = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { name, description, serviceType, projectStatus, clientId, teamIds, hashtags } =
      req.body;

    if (!name || !description || !serviceType || !clientId) {
      console.log("all fields are required");
      return res.status(400).json({ error: "All fields are required" });
    }
     const projectData = await project.findOne({name: name})
    if (projectData) {
      console.log("projectData", projectData);
      return res.status(400).json({ error: "Project name already exists" });
    }
    const clientData = await client.findById(clientId);
    if (!clientData) {
      return res.status(404).json({ error: "Client not found" });
    }

    const newProject = await project.create({
      name,
      description,
      serviceType,
      projectStatus,
      clientId,
      hashtags,
      teamIds,
    });

    if (req.file) {
      const imageUrl = await uploadProjectImage(req, res, newProject._id);
      newProject.projectImage = imageUrl;
      await newProject.save();
    }

    clientData.projectId.push(newProject._id);
    await clientData.save();
    return res.status(201).json(newProject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.getAllProjects = async (req, res) => {
  try {
    const projects = await project
      .find()
      .populate("clientId teamIds lastMeetingId").sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const projectData = await project
      .findById(req.params.id)
      .populate("clientId teamIds lastMeetingId");
    if (!projectData) {
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
    console.log(" getProjectByClientId called req.params.id", req.params.id);
    if (!(await client.findById(req.params.id))) {
      return res.status(404).json({ error: "Client not found" });
    }
    const projectData = await project
      .find({ clientId: req.params.id })
      .populate("clientId teamIds lastMeetingId");
    res.status(200).json(projectData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description, serviceType, projectStatus, teamIds, hashtags } = req.body;
    const projectData = await project.findById(req.params.id);
    if (!projectData) {
      return res.status(404).json({ error: "Project not found" });
    }
    const existingProject = await project.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (existingProject) {
      return res.status(400).json({ error: "Project name already exists" });
    }
    await teamIds.map(async (item) => {
      if (!projectData.teamIds.includes(item)) {
        projectData.teamIds.push(item);
      }
    });
    projectData.name = name || projectData.name;
    projectData.description = description || projectData.description;
    projectData.serviceType = serviceType || projectData.serviceType;
    projectData.projectStatus = projectStatus || projectData.projectStatus;
    projectData.hashtags = hashtags || projectData.hashtags;
    await projectData.save();
    res.status(200).json(projectData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProjectImage = async (req, res) => {
  try {
    const { id } = req.params;
    const projectData = await project.findById(id);
    if (!projectData) {
      return res.status(404).json({ error: "Project not found" });
    }
    if(!req.file){
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = await uploadProjectImage(req, res, projectData._id);
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getProjectByLogedInUser = async (req, res) => {
  try {
    const teamData = await team.findOne({
      participants: { $in: [req.user.id] },
    });
    console.log("teamData", teamData._id);
    const projectData = await project
      .find({ teamIds: { $in: [teamData._id] } })
      .populate("clientId");
    console.log("projectData", projectData);
    res.status(200).json(projectData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

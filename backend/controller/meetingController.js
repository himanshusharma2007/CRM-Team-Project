const meeting = require("../models/meetingModels");
const client = require("../models/clientModels");
const project = require("../models/projectModels");

exports.createMeeting = async (req, res) => {
    try {
        const { clientId, projectId, meetingDateTime, clientNotification, leaderNotification } = req.body;
        if(!clientId || !projectId || !meetingDateTime){
            return res.status(400).json({ error: "All fields are required" });
        }
        if(!(await client.findById(clientId)) || !(await project.findById(projectId))){
            return res.status(404).json({ error: "Client or project not found" });
        }
        const meetingData = await meeting.create({ clientId, projectId, meetingDateTime });
        const projectData = await project.findByIdAndUpdate(projectId, {lastMeetingId: meetingData._id});
        res.status(201).json(meetingData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getMeetingById = async (req, res) => {
    try {
        const meetingData = await meeting.findById(req.params.id).populate("clientId projectId");
        if(!meetingData){
            return res.status(404).json({ error: "Meeting not found" });
        }
        res.status(200).json(meetingData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getUpcomingMeetings = async (req, res) => {
    try {
        const meetingsData = await meeting.find({ meetingDateTime: { $gte: Date.now() } });
        res.status(200).json(meetingsData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getAllMeetingsByStatus = async (req, res) => {
    try {
        const {status} = req.params;
        const meetingsData = await meeting.find({ meetingStatus: status });
        res.status(200).json(meetingsData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getAllMeetingsByProjectId = async (req, res) => {
    try {
        if(!(await project.findById(req.params.id))){
            return res.status(404).json({ error: "Project not found" });
        }
        const meetingsData = await meeting.find({ projectId: req.params.id });
        res.status(200).json(meetingsData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateMeeting = async (req, res) => {
    try {
        const { meetingConclusion, meetingStatus, meetingDateTime } = req.body;
        const meetingData = await meeting.findById(req.params.id);
        if(!meetingData){
            return res.status(404).json({ error: "Meeting not found" });
        }
        meetingData.meetingConclusion = meetingConclusion || meetingData.meetingConclusion;
        meetingData.meetingStatus = meetingStatus || meetingData.meetingStatus;
        meetingData.meetingDateTime = meetingDateTime || meetingData.meetingDateTime;
        await meetingData.save();
        res.status(200).json(meetingData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};



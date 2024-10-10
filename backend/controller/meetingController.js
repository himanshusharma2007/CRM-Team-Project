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
        const meeting = await meeting.create({ clientId, projectId, meetingDateTime });
        res.status(201).json(meeting);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getMeetingById = async (req, res) => {
    try {
        const meetingData = await meeting.findById(req.params.id);
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
        const meetings = await meeting.find({ meetingDateTime: { $gte: new Date() } });
        res.status(200).json(meetings);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getAllMeetingsByStatus = async (req, res) => {
    try {
        const meetings = await meeting.find({ meetingStatus: "pending" });
        res.status(200).json(meetings);
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
        const meetings = await meeting.find({ projectId: req.params.id });
        res.status(200).json(meetings);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateMeeting = async (req, res) => {
    try {
        const { meetingConclusion, meetingStatus, meetingDateTime } = req.body;
        const meeting = await meeting.findById(req.params.id);
        if(!meeting){
            return res.status(404).json({ error: "Meeting not found" });
        }
        meeting.meetingConclusion = meetingConclusion || meeting.meetingConclusion;
        meeting.meetingStatus = meetingStatus || meeting.meetingStatus;
        meeting.meetingDateTime = meetingDateTime || meeting.meetingDateTime;
        await meeting.save();
        res.status(200).json(meeting);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};



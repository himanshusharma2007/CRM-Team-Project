const meeting = require("../models/meetingModels");
const client = require("../models/clientModels");
const project = require("../models/projectModels");
const user = require("../models/userModels");
const team = require("../models/teamModels");
const sendEmail = require("../utils/mail");
const convertTimeToTimeZone = require("../utils/convertTimeToTimeZone");



const sendNotification = async (clientNotification, leaderNotification, clientData, projectData, meetingDateTime) => {

    try {
        let clientDateTime = convertTimeToTimeZone(meetingDateTime, clientData.timeZone);
        let clientSubject = `Project Meeting for ${projectData.name} - ${clientDateTime}`;
        if(clientNotification){
            let msgToClient = `
            
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .container {
            width: 100%;
            padding: 20px;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <p>Dear <b>${clientData.name}</b>,</p>
            
            <p>I hope this email finds you well. I would like to schedule a meeting to discuss the progress and next steps for the project, <b>${projectData.name}</b>.</p>
            
            <p>Would <b>${clientDateTime}</b> work for you? Please let me know if this time is convenient or if you'd prefer another slot.</p>
            
            <p>Looking forward to our discussion and ensuring the continued success of the project.</p>
            
            <p>Best regards,<br>
            Ujjwal Kumar<br>
            [Your Position]<br>
            [Your Company Name]<br>
            [Your Contact Information]</p>
        </div>

        <div class="footer">
            <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>



            `;
            console.log("client notification in progress ..................");
            const sendToClient = await sendEmail(clientData.email, clientSubject, msgToClient);
            console.log((!sendToClient)? "client notification not sent successfully" : "client notification sent successfully");
        }
        let LeaderDateTime = convertTimeToTimeZone(meetingDateTime, "Asia/Kolkata");
        let leaderSubject = `Project Meeting for ${projectData.name} - ${LeaderDateTime}`;
        if(leaderNotification){
            let msgToLeader = (leaderData) =>{
                return `
                
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .container {
            width: 100%;
            padding: 20px;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <p>Dear <b>${leaderData.name}</b>,</p>
            
            <p>I hope this message finds you well. I would like to schedule a meeting to review the progress and outline the next steps for our project, <b>${projectData.name}</b>.</p>
            
            <p>Would <b>${LeaderDateTime}</b> work for you? Please confirm your availability or suggest an alternate time that works better for you.</p>
            
            <p>Looking forward to your insights and continuing our collaboration on the project.</p>
            
            <p>Best regards,<br>
            Ujjwal Kumar<br>
            [Your Position]<br>
            [Your Company Name]<br>
            [Your Contact Information]</p>
        </div>

        <div class="footer">
            <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>
                
                `;
            }
            console.log("leader notification in progress ..................");
            await projectData.teamIds.map(async (id) => {
                const teamData = await team.findById(id);
                const leaderData = await user.findById(teamData.leaderId);
                const sendToLeader = await sendEmail(leaderData.email, leaderSubject, msgToLeader(leaderData));
                console.log((!sendToLeader)? "leader notification not sent successfully" : `${leaderData.name} leader notification sent successfully`);
            })
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }


}



exports.createMeeting = async (req, res) => {
    try {
        const { clientId, projectId, meetingDateTime, clientNotification, leaderNotification } = req.body;
        if(!clientId || !projectId || !meetingDateTime){
            return res.status(400).json({ error: "All fields are required" });
        }
        const clientData = await client.findById(clientId);
        const projectData = await project.findById(projectId);
        if(!clientData || !projectData){
            return res.status(404).json({ error: "Client or project not found" });
        }
        const meetingData = await meeting.create({ clientId, projectId, meetingDateTime });
        projectData.lastMeetingId = meetingData._id;
        await projectData.save();
        let notification = await sendNotification(clientNotification, leaderNotification, clientData, projectData, meetingDateTime);
        if(!notification){
            return res.status(500).json({ error: "error in sending notification to client and leader but meeting is created successfully" });
        }
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



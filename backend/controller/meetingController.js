const meeting = require("../models/meetingModels");
const client = require("../models/clientModels");
const project = require("../models/projectModels");
const user = require("../models/userModels");
const team = require("../models/teamModels");
const sendEmail = require("../utils/mail");
const convertTimeToTimeZone = require("../utils/convertTimeToTimeZone");


const sendClientNotification = async (clientData, projectData, meetingDateTime, meetingConclusion) =>{
  try{
    let clientDateTime = convertTimeToTimeZone(meetingDateTime,clientData.timeZone);
    let clientSubject = `Summary and Conclusion of Our Meeting for ${projectData.name} - ${clientDateTime}`;
    let msgToClient = `
            

      <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Conclusion Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
        }
 ol {
            list-style-type: none;
            counter-reset: item;
        }
        ol li {
            counter-increment: item;
            margin-bottom: 10px;
        }
        ol li:before {
            content: counter(item) ". ";
            font-weight: bold;
            margin-right: 10px;
        }
        h1 {
            color: #007bff;
        }

        p {
            margin: 10px 0;
        }

        .summary {
            background-color: #eef2f7;
            padding: 10px;
            border-left: 4px solid #007bff;
        }

        .footer {
            margin-top: 20px;
        }
    </style>
</head>

<body>

    <div class="container">
        <h1>Meeting Conclusion</h1>

        <p>Dear ${clientData.name},</p>

        <p>I hope this email finds you well.</p>

        <p>I would like to thank you for your time and participation in our meeting held on <strong>${clientDateTime}</strong>.
            It was a productive session, and I believe we've made significant progress on <strong>${projectData.name}</strong>.</p>

        <div class="summary">
            <h2>Meeting Conclusion:</h2>
            <pre>
                ${meetingConclusion}
            </pre>
        </div>

        <p>If you have any questions or need further clarification, feel free to reach out.</p>

        <div class="footer">
            <p>Thank you once again for your valuable input. I look forward to our continued collaboration.</p>

            <p>Best regards,<br>
                [Your Full Name]<br>
                [Your Position]<br>
                [Your Company Name]<br>
                [Contact Information]
            </p>
        </div>
    </div>

</body>

</html>




            `;
      console.log("client notification in progress ..................");
      const sendToClient = await sendEmail(
        clientData.email,
        clientSubject,
        msgToClient
      );
      if(!sendToClient){
        console.log("email not send to client")
        throw Error("error on sending email to client")
      }
      console.log("Email send to client")
      return true;
  }catch(error){
    console.log(error)
    return false;
  }
}

const sendLeaderNotification = async (projectData, meetingDateTime, meetingConclusion) =>{
  try{
    let LeaderDateTime = convertTimeToTimeZone(meetingDateTime, "Asia/Kolkata");
    let leaderSubject = `Project Changes for ${projectData.name} - ${LeaderDateTime}`;
    let msgToLeader = (leaderData) => {
      return `
              
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Changes Email</title>
  <style>
      body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
      }

      .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
      }
 ol {
            list-style-type: none;
            counter-reset: item;
        }
        ol li {
            counter-increment: item;
            margin-bottom: 10px;
        }
        ol li:before {
            content: counter(item) ". ";
            font-weight: bold;
            margin-right: 10px;
        }
      h1 {
          color: #007bff;
      }

      p {
          margin: 10px 0;
      }

      .changes {
          background-color: #eef2f7;
          padding: 10px;
          border-left: 4px solid #007bff;
      }

      .footer {
          margin-top: 20px;
      }
  </style>
</head>

<body>

  <div class="container">
      <h1>Project Update: New Changes Implemented</h1>

      <p>Dear ${leaderData.name},</p>

      <p>I hope this message finds you well. I'm writing to inform you about the recent changes made to our project <strong>${projectData.name}</strong>. The following updates were implemented:</p>

      <div class="changes">
          <h2>Key Changes:</h2>
          <ul>
              ${meetingConclusion}
          </ul>
      </div>

      <p>These adjustments were made to improve [specific aspect, e.g., performance, user experience, etc.]. If you have any feedback or suggestions regarding these changes, I would appreciate your input.</p>

      <p>Please let me know if we need to schedule a follow-up meeting to discuss these updates further.</p>

      <div class="footer">
          <p>Thank you for your guidance and continued support.</p>

          <p>Best regards,<br>
              Ujjwal Kumar<br>
              [Your Position]<br>
              [Your Company Name]<br>
              [Contact Information]
          </p>
      </div>
  </div>

</body>

</html>

              
              `;
    };
    console.log("leader notification in progress ..................");
    await projectData.teamIds.map(async (id) => {
      const teamData = await team.findById(id);
      const leaderData = await user.findById(teamData.leaderId);
      const sendToLeader = await sendEmail(
        leaderData.email,
        leaderSubject,
        msgToLeader(leaderData)
      );
      if(!sendToLeader){
        "leader notification not sent successfully"
      }else{
        `${leaderData.name} leader notification sent successfully`
      }
    });
    return true;
  }catch(error){
    console.log(error)
    return false;
  }
}

exports.createMeeting = async (req, res) => {
  try {
    console.log("Starting createMeeting function");
    console.log("Request body:", req.body);

    const {
      clientId,
      projectId,
      title,
      dateTime: meetingDateTime,
      meetingStatus,
      meetingConclusion,
      notifyClient: clientNotification,
      notifyTeamLeader: leaderNotification,
    } = req.body;

    console.log("Extracted data from request body:", {
      clientId,
      projectId,
      title,
      meetingDateTime,
      meetingStatus,
      meetingConclusion,
      clientNotification,
      leaderNotification,
    });

    if (!clientId || !projectId || !meetingDateTime || !title || !meetingConclusion) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("Fetching client data");
    const clientData = await client.findById(clientId);
    console.log("Client data:", clientData);

    console.log("Fetching project data");
    const projectData = await project.findById(projectId);
    console.log("Project data:", projectData);

    if (!clientData || !projectData) {
      console.log("Client or project not found");
      return res.status(404).json({ error: "Client or project not found" });
    }

    console.log("Creating meeting");
    const meetingData = await meeting.create({
      clientId,
      projectId,
      title,
      meetingDateTime,
      meetingStatus,
      meetingConclusion
    });
    console.log("Meeting created:", meetingData);

    console.log("Updating project with last meeting ID");
    projectData.lastMeetingId = meetingData._id;
    await projectData.save();
    console.log("Project updated");

    let mConclusion = ''
    if(meetingConclusion.length > 0){
      mConclusion = `
      
      <ol>
        ${
          meetingData.meetingConclusion.map((conclusion) => {
              return `
              <li>
              <input type="checkbox" checked=${conclusion.isCompleted}>
              <label>${conclusion.note}</label>
            </li>`
          })
        }
    </ol>
      
      `  
    }

    if(clientNotification){
      console.log("clientNotification")
      let notification = await sendClientNotification(clientData, projectData, meetingDateTime, mConclusion)
      if(!notification){
        return res.status(500).json({
          error:
            "Error in sending notification to client but meeting is created successfully",
        });
      }
      meetingData.clientNotification = true
    }

    if(leaderNotification){
      console.log("leaderNotification")
      let notification = await sendLeaderNotification(projectData, meetingDateTime, mConclusion)
      if(!notification){
        return res.status(500).json({
          error:
            "Error in sending notification to leader but meeting is created successfully",
        });
      }
      meetingData.leaderNotification = true
    }

    let status = 0;
    await meetingData.meetingConclusion.map((conclusion) => {
      if(conclusion.isCompleted){
        status++;
      }
    });
    console.log(status)
    meetingData.meetingStatus = (status === 0)? "initial" : (status === meetingData.meetingConclusion.length)? "completed" : "pending"
    await meetingData.save()

    console.log("Meeting creation successful");
    return res.status(201).json(meetingData);
  } catch (error) {
    console.error("Error in createMeeting:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMeetingById = async (req, res) => {
  try {
    const meetingData = await meeting
      .findById(req.params.id)
      .populate("clientId projectId");
    if (!meetingData) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    return res.status(200).json(meetingData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllMeetingsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const meetingsData = await meeting
      .find({ meetingStatus: status })
      .populate("clientId projectId");
    res.status(200).json(meetingsData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllMeetingsByProjectId = async (req, res) => {
  try {
    if (!(await project.findById(req.params.id))) {
      return res.status(404).json({ error: "Project not found" });
    }
    const meetingsData = await meeting
      .find({ projectId: req.params.id })
      .populate("clientId projectId");
    res.status(200).json(meetingsData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.isMeetingConclusionCompleted = async(req, res) =>{
  try{
    const {noteId, isCompleted} = req.body
    if(!noteId){
      return res.status(404).json({ message: "All fields are required" })
    }
    const meetingData = await meeting.findById(req.params.id).populate("meetingConclusion");
    if(!meetingData){
      return res.status(404).json({
        error: "meeting not found"
      })
    }
    let found = false;
    let status = 0;
    await meetingData.meetingConclusion.map((conclusion) => {
      if(conclusion._id.equals(noteId)){
        console.log(conclusion)
        conclusion.isCompleted = isCompleted
        found = true;
      }
      if(conclusion.isCompleted){
        status++;
      }
    });
    if(!found){
      return res.status(404).json({
        error: "Meeting Conclution not found"
      })
    }
    console.log(status)
    meetingData.meetingStatus = (status === 0)? "initial" : (status === meetingData.meetingConclusion.length)? "completed" : "pending"
    await meetingData.save()
    return res.status(200).json({
      message: "Meeting conclution updated",
      data: meetingData
    })
  }catch(error){
    console.log(error)
    return res.status(500).json({
      error: "Internal server error"
    })
  }
}

exports.getAllMeeting = async (req, res) => {
  try {
    const meetingsData = await meeting.find().populate("clientId projectId");
    res.status(200).json(meetingsData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

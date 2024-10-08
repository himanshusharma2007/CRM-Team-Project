const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "client",
        required: [true, "Client id is required"]
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: [true, "Project id is required"]
    },
    meetingDateTime: {
        type: Date,
        required: [true, "Meeting date is required"]
    },
    meetingConclusion: {
        type: String,
        default: ""
    },
    meetingStatus: {
        type: String,
        enum: ["pending", "completed", "cancelled", "rescheduled"],
        default: "pending"
    },
}, {timestamps:true});


const meeting = mongoose.model('meeting', meetingSchema);
module.exports = meeting;


/*




*/
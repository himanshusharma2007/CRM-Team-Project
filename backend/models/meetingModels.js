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
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    meetingDateTime: {
        type: Date,
        required: [true, "Meeting date is required"]
    },
    meetingConclusion: {
        type: String,
        required:[true, "Meeting conclusion is required"]
    },
    meetingStatus: {
        type: String,
        enum: ["initial", "pending", "completed"],
        default: "initial"
    },
    clientNotification: {
        type: Boolean,
        default: false
    }
}, {timestamps:true});


const meeting = mongoose.model('meeting', meetingSchema);
module.exports = meeting;
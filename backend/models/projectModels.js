const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "client",
        required: [true, "Client id is required"]
    },
    name: {
        type: String,
        required: [true, "Project name is required"],
        unique: [true, "Project name already exists"]
    },
    description: {
        type: String,
        required: [true, "Project description is required"]
    },
    serviceType: {
        type: String,
        required: [true, "Service type is required"]
    },
    projectStatus: {
        type: String,
        enum: ["pending", "ongoing", "completed", "cancelled"],
        default: "pending"
    },
    lastMeetingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "meeting"
    },
    teamIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "team"
    }],
    hashtages: {
        type: Array,
        default: []
    },
});

const project = mongoose.model('project', projectSchema);
module.exports = project;

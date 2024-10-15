const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
      required: [true, "Client id is required"],
    },
    name: {
      type: String,
      required: [true, "Project name is required"],
      unique: [true, "Project name already exists"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
    },
    projectImage: {
      type: String,
      default: null,
    },
    projectImage: {
        type: String,
        default: null
    },
    projectStatus: {
      type: String,
      enum: ["pending", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    lastMeetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "meeting",
    },
    teamIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "team",
      },
    ],
    hashtags: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const project = mongoose.model("project", projectSchema);
module.exports = project;

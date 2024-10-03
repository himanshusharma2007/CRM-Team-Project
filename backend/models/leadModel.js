const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    companyName: {
      type: String,
      required: [true, "companyName is required"],
    },
    contactName: {
      type: String,
      required: [true, "contactName is required"],
    },
    phone: {
      type: String,
      required: [true, "phone no. is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    stage: {
      type: String,
      enum: [
        "New-Lead",
        "Need-Analysis",
        "Price",
        "Negotiation",
        "Lead-Won",
        "Lead-Lost",
      ],
      default: "New-Lead",
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const lead = mongoose.model("lead", leadSchema);
module.exports = lead;

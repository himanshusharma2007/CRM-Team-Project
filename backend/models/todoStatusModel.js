const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: [true, "stageName is required"],
    unique: [true, "stageName must be unique"],
  },
  todo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "todo",
    },
  ],
});

const status = mongoose.model("status", statusSchema);

module.exports = status;

// "New-Lead",
// "Need-Analysis",
// "Price",
// "Negotiation",
// "Lead-Won",
// "Lead-Lost",

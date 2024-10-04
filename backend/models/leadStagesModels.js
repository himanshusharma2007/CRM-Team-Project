const mongoose = require("mongoose");

const stagesSchema = new mongoose.Schema({
    stageName: {
        type: String,
        required: [true, "stageName is required"],
        unique: [true, "stageName must be unique"],
    },
    leads: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "lead",
        }],
})

const stages = mongoose.model("stages", stagesSchema);

module.exports = stages;

// "New-Lead",
// "Need-Analysis",
// "Price",
// "Negotiation",
// "Lead-Won",
// "Lead-Lost",

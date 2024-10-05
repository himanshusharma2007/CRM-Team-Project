const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
    },
    teamName: {
      type: String,
      required: [true, "Team Name is required"],
      unique: [true, "team name is unique "],
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

const team = mongoose.model("team", teamSchema);
module.exports = team;

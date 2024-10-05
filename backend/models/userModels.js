const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: String,
    otpExpiry: Date,
    department: {
      type: String,
      enum: ["developer", "marketing", "other", "sales"],
      default: "other",
    },
    leadId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lead",
      },
    ],
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
    },
    role: {
      type: String,
      enum: ["admin", "subAdmin", "emp"],
      default: "emp",
    },
    verify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
module.exports = user;

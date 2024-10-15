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
      select: false,
    },
    otp: {
      type: String,
      default: null,
      select: false,
    },
    otpExpiry: {
      type: Date,
      default: null,
      select: false,
    },
    otpVerify: {
      type: Boolean,
      default: false,
      select: false,
    },
    team: {
      type: String,
      enum: ["developer", "marketing", "noVerify"],
      default: "noVerify",
    },
    deal: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
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

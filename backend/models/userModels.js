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

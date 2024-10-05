const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Status name is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User ID is required"]
  }
}, { timestamps: true });

// Compound index to ensure uniqueness of status names per user
statusSchema.index({ name: 1, userId: 1 }, { unique: true });

const Status = mongoose.model("Status", statusSchema);
module.exports = Status;
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "User ID is required"]
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status",
    required: [true, "Status is required"]
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  }
}, { timestamps: true });

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
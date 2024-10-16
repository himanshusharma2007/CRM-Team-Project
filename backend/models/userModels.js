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
    profileImage: {
      type: String,
      default: null,
    },
    permission: {
      lead:{
        create: {type: Boolean, default: false},
        update: {type: Boolean, default: false},
        delete: {type: Boolean, default: false},
        updateStage: {type: Boolean, default: false},
        read: {type: Boolean, default: false},
      },
      leadStage:{
        create: {type: Boolean, default: false},
        update: {type: Boolean, default: false},
        delete: {type: Boolean, default: false},
        read: {type: Boolean, default: false},
      },
      project:{
        create: {type: Boolean, default: false},
        update: {type: Boolean, default: false},
        read: {type: Boolean, default: false},
      },
      team:{
        create: {type: Boolean, default: false} ,
        update: {type: Boolean, default: false},
        removeParticipant: {type: Boolean, default: false},
        read: {type: Boolean, default: false},
      },
      user:{
        read: {type: Boolean, default: false},
        verifyAndAssignRoleAndTeam: {type: Boolean, default: false} ,
      },
      client:{
        create: {type: Boolean, default: false},
        update: {type: Boolean, default: false},
        delete: {type: Boolean, default: false},
        read: {type: Boolean, default: false},
      },
      meeting:{
        create: {type: Boolean, default: false} ,
        update: {type: Boolean, default: false},
        read: {type: Boolean, default: false},
        requiredPermitions:["projects","clients"]
      },
      connection:{
        create: {type: Boolean, default: false} ,
        update: {type: Boolean, default: false},
        delete: {type: Boolean, default: false},
        read: {type: Boolean, default: false},
      },
      query:{
        respond: {type: Boolean, default: false},
        read: {type: Boolean, default: false},
      },
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
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
      default: null,
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);
module.exports = user;

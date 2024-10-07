const jwt = require("jsonwebtoken");
const user = require("../models/userModels");
const Status = require("../models/todoStatusModels");
const bcrypt = require("bcryptjs");
const hashPassword = require("../utils/password");

// Generate JWT token
const generateToken = (id,res) => {
  console.log("id",id);
  const token = jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '1d' });
  res.cookie("token",token)
  console.log("token " + token)
  // return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register a new user    "/signup"
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "please fill all fields",
      });
    }
    const userExists = await user.findOne({ email });
    if (userExists)
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });

    const hashedPassword = await hashPassword(password);
    const userData = await user.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!userData) {
      return res.status(401).send({
        success: false,
        message: "Error in User Creation",
      });
    }
    await Status.create({
      name: "Todo",
      userId: userData._id
    });
    await Status.create({
      name: "Doing",
      userId: userData._id
    });
    await Status.create({
      name: "Done",
      userId: userData._id
    });
    res.status(201).send({
      success: true,
      massage: "User Register successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

// "/login"
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "please fill all fields",
      });
    }
    const userData = await user.findOne({ email });
    if (!userData) {
      return res.status(400).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    // if(!userData.verify){
    //   return res.status(203).send({
    //     success: false,
    //     message: "You are not verify by admin"
    //   })
    // }

    generateToken(userData.id, res);
    userData.password = "*****";
    console.log("user in userController",userData)
    return res
      .status(200)
      .json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

//  "/logout"
exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", { expiresIn: "0s" });
    return res.status(200).send({
      success: true,
      message: "log out successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

// "/verify/:id"
exports.verify = async (req, res) => {
  const { role, team } = req.body;
  try {
    console.log(req.user);
    const userdata = await user.findById(req.params.id).select();
    if (!userdata) {
      return res.status(400).send({
        success: false,
        message: "user not found",
      });
    }
    if (userdata.verify) {
      return res.status(400).send({
        success: false,
        message: "user already verify",
      });
    }
    // Check if the user is an admin
    if (req.user.role === "admin") {
      // Admin can set role and team
      userdata.verify = true;
      userdata.role = role;
      userdata.team = team;
    }
    // Check if the user is a sub-admin
    else if (req.user.role === "subAdmin" || req.user.role === "subAdmin") {
      // Sub-admin can set team only
      userdata.verify = true;
      userdata.team = team;
    } else {
      return res.status(403).send({
        success: false,
        message: "Insufficient permissions",
      });
    }

    await userdata.save();
    userdata.password = "*****";
    res.status(200).send({
      success: true,
      message: "verify successfully",
      user: userdata,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "please fill all fields",
      });
    }

    // Find user by email
    const userData = await user.findById(req.user._id);

    if (!userData) {
      return res.status(401).send({
        success: false,
        message: "User not found",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).send({
        success: false,
        message: "old or new password are same",
      });
    }

    // Validate old password
    const isMatch = await bcrypt.compare(oldPassword, userData.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // Update to the new password
    userData.password = await hashPassword(newPassword); // This will be hashed before saving due to the pre-save hook
    await userData.save();

    res.status(200).send({
      success: false,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

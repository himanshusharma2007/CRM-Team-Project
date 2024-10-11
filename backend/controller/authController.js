const jwt = require("jsonwebtoken");
const user = require("../models/userModels");
const Status = require("../models/todoStatusModels");
const bcrypt = require("bcryptjs");
const hashPassword = require("../utils/password");
const sendMail = require("../utils/mail");

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
    if(!hashedPassword){
      return res.status(400).send({
        success: false,
        message: "Error in hashing password",
      });
    }
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
  console.log('req.body :>> ', req.body);
  try {
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "please fill all fields",
      });
    }
    const userData = await user.findOne({ email }).select("+password");
    if (!userData) {
      return res.status(400).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    console.log("userData",userData);
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
    const userData = await user.findById(req.user._id).select("+password");

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
    const hashedPassword = await hashPassword(newPassword);
    if(!hashedPassword){
      return res.status(400).send({
        success: false,
        message: "Error in hashing password",
      });
    }
    userData.password = hashedPassword; // This will be hashed before saving due to the pre-save hook
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


let msg = (otp, name) =>{
  return `
  
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>We received a request to reset the password for your account. To continue with the reset, please use the following One-Time Password (OTP):</p>
        <div style="text-align: center; font-size: 20px; font-weight: bold; background-color: #f0f0f0; padding: 10px; border-radius: 5px; margin: 20px 0;">
            ${otp}
        </div>
        <p>This OTP is valid for the next 10 minutes. If you did not request this password reset, please ignore this email or contact our support team.</p>
        <p>For your security, do not share this OTP with anyone.</p>
        <p>Thank you,<br>
        The CODEDEV Team</p>
        <p style="font-size: 12px; color: #777; text-align: center;">If you need help, feel free to contact us at <a href="mailto:codedevservices@gmail.com">codedevservices@gmail.com</a></p>
    </div>
</body>
</html>
  
  `;
};

exports.sendOtp = async (req, res) => {
  try {
    console.log("req.body", req.body)
    const {email} = req.body;
    const userData = await user.findOne({email}).select("+otp +otpExpiry +otpVerify");
    if(!userData){
      console.log("user not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    sendMail(email, "OTP for password reset", msg(otp, userData.name));
    userData.otp = otp;
    userData.otpExpiry = new Date(Date.now() + (10 * 60 * 1000));
    userData.otpVerify = false;
    await userData.save();
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internel server error",
    });
  }
}

exports.verifyOtp = async (req, res) => {
  try {
    console.log("req.body",req.body);
    const {email, otp} = req.body;
    if(!email || !otp){
    console.log("please fill all fields");
    return res.status(400).json({
      success: false,
      message: "please fill all fields",
      });
    }
    const userData = await user.findOne({email}).select("+otp +otpExpiry +otpVerify");
    if(!userData){
      console.log("user not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if(userData.otp !== otp || userData.otpExpiry < Date.now()){
      console.log("invalid otp or expired");
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or expired",
      });
    }
    userData.otpVerify = true;
    await userData.save();
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internel server error",
    });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const {email, newPassword} = req.body;
    if(!email || !newPassword){
      return res.status(400).json({
        success: false,
        message: "please fill all fields",
      });
    }
    const userData = await user.findOne({email}).select("+otp +otpExpiry +otpVerify +password");
    if(!userData){
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if(!userData.otpVerify){
      return res.status(400).json({
        success: false,
        message: "OTP is not verified",
      });
    }
    if(!userData.otpVerify || userData.otpExpiry < Date.now()){
      return res.status(400).json({
        success: false,
        message: "OTP is not verified or expired session",
      });
    }
    const hashedPassword = await hashPassword(newPassword);
    console.log("hashedPassword",hashedPassword);
    if(!hashedPassword){
      return res.status(400).send({
        success: false,
        message: "Error in hashing password",
      });
    }
    userData.password = hashedPassword;
    userData.otp = undefined;
    userData.otpExpiry = undefined;
    userData.otpVerify = false;
    await userData.save();
    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internel server error",
    });
  }
}

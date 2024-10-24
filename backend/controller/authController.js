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
  const expirationTime = 24 * 60 * 60 * 1000; 
  res.cookie("token",token, {
    maxAge: expirationTime,
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  })
  console.log("token " + token)
  // return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


const msgForRegister = (otp, name) => {
  return `

  <!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>OTP Email Template</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 0;
      margin: 0;
    }

    .container-sec {
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }

    .otp-code {
      font-size: 24px;
      font-weight: bold;
      background-color: #f8f9fa;
      padding: 15px;
      text-align: center;
      border-radius: 8px;
      border: 1px dashed #007bff;
      color: #007bff;
      margin-bottom: 20px;
    }

    .footer-text {
      color: #6c757d;
      font-size: 14px;
      text-align: center;
      margin-top: 20px;
    }

    .footer-text a {
      color: #007bff;
      text-decoration: none;
    }

    .otp-lock {
      color: #333;
      font-size: 80px;
    }

    .welcome-section {
      background: #144fa9db;
      padding: 30px;
      border-radius: 4px;
      color: #fff;
      font-size: 20px;
      margin: 20px 0px;
    }

    .welcome-text {
      font-family: monospace;
    }

    .app-name {
      font-size: 30px;
      font-weight: 800;
      margin: 7px 0px;
    }

    .verify-text {
      margin-top: 25px;
      font-size: 25px;
      letter-spacing: 3px;
    }

    i.fas.fa-envelope-open {
      font-size: 35px !important;
      color: #ffffff;
    }

    .copy-btn {
      background-color: #007bff;
      border: none;
      color: #fff;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 8px;
      cursor: pointer;
    }

    .copy-btn:hover {
      background-color: #0056b3;
    }

    .copy-confirmation {
      color: green;
      font-size: 14px;
      margin-top: 10px;
      display: none;
    }
  </style>
</head>

<body>
  <div class="container-sec">
    <div class="text-center">
      <div><i class="fas fa-lock otp-lock"></i></div>
      <div class="welcome-section">
        <div class="app-name">
          --- CodeDev ---
        </div>
        <div class="welcome-text">
          Thanks for signing up !
        </div>

        <div class="verify-text">
          Please Verify Your Email Address
        </div>
        <div class="email-icon">
          <i class="fas fa-envelope-open"></i>
        </div>

      </div>
      <h2>Hello, ${name}</h2>
      <p>Your One-Time Password (OTP) for verification is:</p>
      <div class="otp-code" id="otpCode">${otp}</div>

      <button class="copy-btn" onclick="copyOTP()">Copy OTP</button>
      <div class="copy-confirmation" id="copyConfirmation">OTP copied to clipboard!</div>

      <p class="mt-4">Please use this OTP to complete your verification. The OTP is valid for the next 10 minutes.</p>
    </div>
    <div class="footer-text">
      <p>If you did not request this OTP, please <a href="#">contact us</a> immediately.</p>
      <p>Thank you,<br>The CodeDev Team</p>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
  <script>
    function copyOTP() {
      // Get the OTP text
      const otpText = document.getElementById("otpCode").textContent;

      // Create a temporary input element to copy the text
      const tempInput = document.createElement("input");
      document.body.appendChild(tempInput);
      tempInput.value = otpText;
      tempInput.select();
      tempInput.setSelectionRange(0, 99999); // For mobile devices

      // Copy the text to the clipboard
      document.execCommand("copy");

      // Remove the temporary input
      document.body.removeChild(tempInput);

      // Show confirmation message
      const confirmation = document.getElementById("copyConfirmation");
      confirmation.style.display = "block";

      // Hide the confirmation message after 2 seconds
      setTimeout(() => {
        confirmation.style.display = "none";
      }, 2000);
    }
  </script>
</body>

</html>
  `;
}


exports.sendOtpForRegister = async (req, res) => {
  console.log("req.body",req.body)
  const {name, email } = req.body;
  try {
    const userData = await user.findOne({ email });
    if(userData){
      return res.status(404).json({
        success: false,
        message: "User already exists",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sendOtpForEmailVerify = await sendMail(email, "OTP for password reset", msgForRegister(otp, name));
    if(!sendOtpForEmailVerify){
      return res.status(500).json({
        success: false,
        error: "email not send"
      })
    }
    const expirationTime = 10 * 60 * 1000;
    const hashOtp = await hashPassword(otp)
    if(!hashOtp){
      return res.status(400).send({
        success: false,
        message: "Error in hashing OTP",
      });
    }
    res.cookie("otp", hashOtp, { 
      maxAge: expirationTime,
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });
    res.cookie("name", name, { 
      maxAge: expirationTime,
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });
    res.cookie("email", email, { 
      maxAge: expirationTime,
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });
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

// Register a new user    "/signup"
exports.registerUser = async (req, res) => {
  const { password, otp } = req.body;
  try {
    const { otp: savedOtp, name, email } = req.cookies;
    
    if (!password || !otp) {
      return res.status(400).send({
        success: false,
        message: "Please fill all fields",
      });
    }

    const decodeOTP = await bcrypt.compare(otp, savedOtp);
    
    if (!name || !email || !decodeOTP){
      return res.status(400).send({
        success: false,
        message: "Invalid OTP or expired",
      });
    }

    const userExists = await user.findOne({ email });
    if (userExists) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
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

    const statuses = ["Todo", "Doing", "Done"];
    for (const status of statuses) {
      await Status.create({
        name: status,
        userId: userData._id,
      });
    }

    // Clear cookies after successful registration
    ['email', 'name', 'otp'].forEach(cookie => res.clearCookie(cookie));

    return res.status(201).send({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
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
    if (userData.isBlocked) {
      return res.status(403).send({
        success: false,
        message: "Your account has been blocked. Please contact the administrator.",
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
      message: "Internal server error",
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


const resetPasswordMsg = (name, email) => {
  return `
  
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Change Successful</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="text-align: center; color: #333;">Password Change Confirmation</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>We wanted to let you know that your password was successfully updated. If you initiated this change, no further action is required.</p>
        <p><strong>Account Details:</strong></p>
        <p>- Email: ${email}</p>
        <p>If you did not request this password change, please contact our support team immediately to secure your account.</p>
        <p>For your security, we recommend regularly updating your password and ensuring that your password is strong and unique.</p>
        <p>Thank you for using CODEDEV. If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>CODEDEV Team</p>
        <p style="font-size: 12px; color: #777; text-align: center;">If you need help, feel free to contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
    </div>
</body>
</html>

  
  `;
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
    await sendMail(userData.email, "Password Reset Successfully", resetPasswordMsg(userData.name, userData.email));
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



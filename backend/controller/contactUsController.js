const contactUs = require("../models/contactUsModels");
const sendEmail = require("../utils/mail");
const user = require("../models/userModels");
const jwt = require("jsonwebtoken");

const sendMailToClient = async (email) => {
  try {
    const msg = `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        @import url('https://fonts.googleapis.com/css?family=Raleway:400,600,900');

*{
  box-sizing:border-box;
 /* outline:1px solid ;*/
}
body{
        background: #D7272D;
        height: 100%;
        margin: 0;
        background-repeat: no-repeat;
        background-attachment: fixed;
  
}

.wrapper-1{
  width:100%;
  height:100vh;
  display: flex;
flex-direction: column;
}
.wrapper-2{
  padding: 30px;
  text-align:center;
}
h1{
  font-family: 'Raleway', Arial Black, Sans-Serif;
  font-size:4em;
  font-weight: 900;
  letter-spacing:3px;
  color: #fafafa;
  margin:0;
  margin-top: 40px;
  margin-bottom:40px;
}
.wrapper-2 p{
  margin:0;
  font-size:1.3em;
  color:#fafafa;
  font-family: 'Raleway', sans-serif;
  letter-spacing:1px;
  line-height: 1.5;
}
.footer-like{
  margin-top: auto; 
  background: rgb(31,38,130);
  padding:6px;
  text-align:center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.footer-like p{
  margin:0;
  padding:4px;
  color:#fafafa;
  font-family: 'Raleway', sans-serif;
  letter-spacing:1px;
}
.footer-like p a{
  text-decoration:none;
  color:#5892FF;
  font-weight: 600;
}

.footer-like p a:hover{
  color:#FFF;
 }

@media (min-width:360px){
  h1{
    font-size:4.5em;
  }
  .go-home{
    margin-bottom:20px;
  }
}

@media (min-width:600px){
  .thankyoucontent{
  max-width:1000px;
  margin:0 auto;
}
  .wrapper-1{
  height: initial;
  max-width:100%;
  margin:0 auto;
  margin-top:50px;
  }
  
  
}
    </style>
</head>
<body>
    <div class=thankyoucontent>
        <div class="wrapper-1">
           <div class="wrapper-2">
              <img src="https://i.ibb.co/Lkn7rkG/thank-you-envelope.png" alt="thank-you-envelope" border="0">
            <h1>Thank you!</h1>
             <p>for contacting us, we will reply promptly</p> 
             <p>once your message is received. </p>
             <hr/>
             <p>We have received your message and our team will get back to you as soon as possible.</p>
             <p>In the meantime, feel free to explore our website or contact us again if you have any additional questions.</p>
             <p>We appreciate your interest and look forward to assisting you.</p>
             <hr/>
             <div class="footer-like">
                 <p>This is an automated message, please do not reply directly to this email.</p>
             </div>
           </div>
          
       </div>
</body>
</html>
    
    `;
    await sendEmail(email, "Thank you for contacting us", msg);
    console.log("Email sent to client");
  } catch (err) {
    console.log("err", err);
  }
};

const sendMailToAdmin = async (email, name, message, subject, userData) => {
  try {
    const msg = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        <style>
            @import url('https://fonts.googleapis.com/css?family=Raleway:400,600,900');
            body{
              background: #D7272D;
              height: 100%;
              margin: 0;
              background-repeat: no-repeat;
              background-attachment: fixed;
            }
              h1{
                font-family: 'Raleway', Arial Black, Sans-Serif;
                font-size:4em;
                font-weight: 900;
                letter-spacing:3px;
                color: #fafafa;
                margin:0;
                margin-top: 40px;
                margin-bottom:40px;
              }
              p{
                margin:0;
                font-size:1.3em;
                color:#fafafa;
                font-family: 'Raleway', sans-serif;
                letter-spacing:1px;
                line-height: 1.5;
              }
              hr{
                border: 1px solid #fafafa;
              }
        </style>
    </head>
    <body>
    <h3>New Person Contact Us</h3>
    <p>Name: ${name}</p>
    <p>Email: ${email}</p>
    <p>Subject: ${subject}</p>
    <p>Message: ${message}</p>

    ${
      userData !== null
        ? `
      <hr/>
      <p>User are logged in on our website</p>
      <p>User ID: ${userData._id}</p>
      <p>User Name: ${userData.name}</p>
      <p>User Email: ${userData.email}</p>
      <p>User Role: ${userData.role}</p>
      <p>User Verify: ${userData.verify}</p>

      `
        : ""
    }

    </body>
    </html>
    `;
    await sendEmail(process.env.ADMIN_EMAIL, "New Contact Us", msg);
    console.log("Email sent to admin");
  } catch (err) {
    console.log("err", err);
  }
};

const decodedToken = async (req) => {
  try {
    const token = req.cookies.token || null;
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const userData = await user.findById(decoded.id).select("-password");
    if (!userData) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }
    return userData;
  } catch (err) {
    console.log("err", err);
    return null;
  }
};

exports.createContactUs = async (req, res) => {
  const { name, email, message, subject } = req.body;
  try {
    if (!name || !email || !message || !subject) {
      return res.status(400).send({
        success: false,
        message: "please fill all fields",
      });
    }
    const userData = await decodedToken(req);
    const contactUsData = await contactUs.create({
      name,
      email,
      message,
      subject,
      userId: userData?._id,
    });
    await sendMailToClient(email);
    await sendMailToAdmin(email, name, message, subject, userData);
    return res.status(200).send({
      success: true,
      message: "Contact Us created successfully",
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getContactUs = async (req, res) => {
  try {
    const contactUsData = await contactUs
      .find()
      .sort({ createdAt: -1 })
      .populate("userId");
      console.log('contactUsData', contactUsData)
    return res.status(200).send(contactUsData);
  } catch (err) {
    console.log("err", err);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteContactUs = async (req, res) => {
  try {
    const contactUsData = await contactUs.findByIdAndDelete(req.params.id);
    if (!contactUsData) {
      return res.status(404).send({
        success: false,
        message: "Contact Us not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Contact Us deleted successfully",
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const responedEmail = async (contactUsData, message) => {
  try {
    const msg = `
    
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href='https://fonts.googleapis.com/css?family=Bad+Script' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: lightgoldenrodyellow;
        }

        .paper {
            position: absolute;
            height: 90%;
            width: 90%;
            background: rgba(255, 255, 255, 0.9);
            margin: 5%;
            box-shadow: 0px 0px 5px 0px #888;
        }

        .paper::before {
            content: '';
            position: absolute;
            left: 45px;
            height: 100%;
            width: 2px;
            background: rgba(255, 0, 0, 0.4);
        }
        .Lettertext {
            position: absolute;
            top: 65px;
            left: 55px;
            bottom: 10px;
            right: 10px;
            line-height: 25px;
            font-weight: bold;
            overflow: hidden;
            outline: none;
        }
        .box {
            background-color: #f1f1f1;
            padding: 15px;
            border-left: 4px solid #4CAF50;
            margin-bottom: 20px;
            font-weight: bold;
            color: white;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>

<body>

    <div class="col-lg-12 col-md-12">
        <div class="col-lg-6 col-md-6 col-sm-6">
            <div class="paper">
                <div>
                    <div class="Lettertext" spellcheck="false">
                        <p>Dear <strong>${contactUsData.name}</strong>,</p>

                        <p>Thank you for reaching out to us through our contact form. We have received your query and appreciate your interest in <strong>CODEDEV</strong>.</p>

                        <p>Here's a copy of your query for reference:</p>

                        <div class="box">
                            <p><em>${contactUsData.message}</em></p>
                        </div>
                        
                        <p>After reviewing your message, I would like to provide the following response:</p>
                        
                        <hr/>
                        
                        <p class="box"><em>${message}</em></p>
                        
                        <hr/>

                        <p>If you have any further questions or need additional clarification, feel free to reply to this email or contact us at <strong>[Phone Number]</strong>. We're always happy to assist you!</p>

                        <p>Thank you again for getting in touch, and we look forward to helping you further.</p>

                        <p>Best regards,<br>
                        [Your Name]<br>
                        [Your Position]<br>
                        [Company Name]<br>
                        [Contact Information]</p>
                    </div>
                </div>
            </div>
            <div class="footer">
        <p>This is an automated message, please do not reply directly to this email.</p>
    </div>
        </div>
    </div>
</body>

</html>
    
    `;
    await sendEmail(contactUsData.email, "Contact Us Responded", msg);
    console.log("Email sent to client");
  } catch (err) {
    console.log("err", err);
  }
};

exports.responedContactUs = async (req, res) => {
  try {
    console.log("req.body in respond function", req.body);
    console.log("req.params", req.params);
    const message = req.body.response;
    if (!message) {
      console.log("check", message);
      return res.status(400).send({
        success: false,
        message: "please fill all fields",
      });
    }
    const contactUsData = await contactUs.findByIdAndUpdate(
      req.params.id,
      { responed: message, status: "responded" },
      { new: true }
    );
    console.log("contact us data in controller:", contactUsData);
    if (!contactUsData) {
      return res.status(404).send({
        success: false,
        message: "Contact Us not found",
      });
    }
    await responedEmail(contactUsData, message);
    return res.status(200).send({
      success: true,
      message: "Contact Us responded successfully",
    });
  } catch (err) {
    console.log("err", err);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

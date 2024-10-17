const jwt = require("jsonwebtoken");
const user = require("../models/userModels");

const jwtToken = async (req, res, next) => {
  let token = req.cookies.token;
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) {
      res.status(401).send({
        message: "Not authorized, token failed",
        success: false,
      });
    }
    req.user = await user.findById(decoded.id);
    if(!req.user){
      return res.status(404).send({
        success: false,
        message: "user not found"
      })
    }
    next();
  } catch (err) {
    res.status(401).send({
      message: "Not authorized, token failed",
      success: false,
    });
  }
};

module.exports = { jwtToken };

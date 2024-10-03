const user = require("../models/userModels");

exports.getUser = async (req, res) => {
  try {
    let user = req.user;
    res
      .status(200)
      .json(user);
  } catch (error) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await user.find()
    res.status(200).send(users);
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

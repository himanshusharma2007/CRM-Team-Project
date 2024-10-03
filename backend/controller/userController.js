const user = require("../models/userModels");

exports.getUser = async (req, res) => {
  try {
    let user = req.user;
    res.status(200).send({ user });
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
    const users = await user.find();
    res.status(200).send({
      success: true,
      usersdata: users,
      message: "all user",
    });
  } catch (error) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Internel server error",
    });
  }
};

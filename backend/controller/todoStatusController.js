const todo = require("../models/todoModels");

exports.addTodoStatus = async (req, res) => {
  try {
    if (!req.body.status) {
      return res.status(400).send({
        success: false,
        message: "status is required",
      });
    }
    const userTodoDatas = await todo.find({userId: req.user._id});

    const statusDatas = await userTodoDatas.map(async (item) => {
      if(item.status.includes(req.body.status)){
        return res.status(400).send({
          success: false,
          message: "status already exists",
        });
      }
      item.status.push(req.body.status)
      await item.save()
    });
    return res.status(200).send({
      success: true,
      message: "status added successfully"
    });
  } catch (err) {
    console.log("err", err)
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteTodoStatus= async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).send({
        success: false,
        message: "status is required",
      });
    }
    const userTodoDatas = await todo.find({userId: req.user._id});
    const statusDatas = await userTodoDatas.map(async (item) => {
      if(!(item.status.includes(req.body.status))){
        return res.status(400).send({
          success: false,
          message: "status not exists",
        });
      }
      item.status.splice(item.status.indexOf(req.body.status), 1);
      await item.save()
    });

    return res.status(200).send({
      success: true,
      message: "status deleted successfully"
    });

  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

exports.updateTodoStatus= async (req, res) => {
  try {
    const { status, newStatusName} = req.body;
    if (!status || !newStatusName) {
      return res.status(400).send({
        success: false,
        message: "status and newStatusName are required",
      });
    }
    const userTodoDatas = await todo.find({userId: req.user._id});
    const statusDatas = await userTodoDatas.map(async (item) => {
      if(!(item.status.includes(req.body.status))){
        return res.status(400).send({
          success: false,
          message: "status not exists",
        });
      }
      const index = item.status.indexOf(status);
      item.status[index] = newStatusName;
      await item.save()
    });
    return res.status(200).send({
      success: true,
      message: "status updated successfully",
    });
  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}


exports.getTodoStatus= async (req, res) => {
  try {
    const userTodoDatas = await todo.findOne({userId: req.user._id});
    return res.status(200).send(userTodoDatas.status);
  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

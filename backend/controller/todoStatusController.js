const Todo = require("../models/todoModels");
const Status = require("../models/todoStatusModels");

exports.addTodoStatus = async (req, res) => {
  try {
    if (!req.body.status) {
      return res.status(400).send({
        success: false,
        message: "status is required",
      });
    }
    const existingStatus = await Status.findOne({name: req.body.status, userId: req.user._id});
    if(existingStatus){
      return res.status(400).send({
        success: false,
        message: "status already exists",
      });
    }
    const statusData = await Status.create({
      name: req.body.status,
      userId: req.user._id
    });
    return res.status(200).send(statusData);
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
    const { statusId } = req.params;
    if (!statusId) {
      return res.status(400).send({
        success: false,
        message: "status is required",
      });
    }
    console.log("body: ", req.body)
    const statusData = await Status.findById(statusId)
    if(!statusData){
      return res.status(400).send({
        success: false,
        message: "status not exists",
      });
    }
    console.log(statusData._id)
    const statusTodoData = await Todo.find({status: statusData._id})
    console.log("statusTodoData", statusTodoData)
    if(statusTodoData.length > 0){
      return res.status(400).send({
        success: false,
        message: "status is used in todo",
      });
    }
    await Status.findByIdAndDelete(statusData._id)
    return res.status(200).send({
      success: true,
      message: "status deleted successfully",
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
    const statusData = await Status.findOneAndUpdate({name: status}, {name: newStatusName}, {new: true});
    return res.status(200).send({
      success: true,
      message: "status updated successfully",
      status: statusData.name
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
    const userTodoStatusDatas = await Status.find({userId: req.user._id}).select("-userId");
    return res.status(200).send(userTodoStatusDatas);
  } catch (err) {
    console.log("err", err)
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}


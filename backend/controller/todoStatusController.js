const TodoStatus = require("../models/todoStatusModel");

exports.addTodoStatus = async (req, res) => {
  try {
    if (!req.body.status) {
      return res.status(400).send({
        success: false,
        message: "status is required",
      });
    }
    if (await TodoStatus.findOne({status: req.body.status})) {
      return res.status(400).send({
        success: false,
        message: "status already exists",
      });
    }
    const todosData = await TodoStatus.create(req.body);
    res.status(200).send(todosData);
  } catch (err) {
    console.log("err", err)
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getTodosStatus = async (req, res) => {
  try {
    const todosStatusData = await to.find();
    res.status(200).send(todosStatusData);
  } catch (err) {
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
    const todosData = await TodoStatus.findOne({status});
    if (!todosData) {
      return res.status(404).send({
        success: false,
        message: "status not found",
      });
    }
    if(todosData.leads.length > 0) {
      return res.status(400).send({
        success: false,
        message: "status has leads, so it cannot be deleted",
      });
    }
    const statusToDelete = await TodoStatus.findOneAndDelete({status});
    res.status(200).send({
        success: true,
        message: "status deleted successfully",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}

exports.updateTodoStatus= async (req, res) => {
  try {
    const { status, newStatusName} = req.body;
    if (!status || !newTodoName) {
      return res.status(400).send({
        success: false,
        message: "status and newStatusNameare required",
      });
    }
    if(! (await TodoStatus.findOne({status}))){
        return res.status(400).send({
            success: false,
            message: "status does not exist",
          });
    }
    if (await TodoStatus.findOne({status: newTodoName})) {
      return res.status(400).send({
        success: false,
        message: "newStatusNamealready exists",
      });
    }
    const statusToUpdate = await TodoStatus.findOneAndUpdate({status}, {status: newTodoName}, {new: true});
    res.status(200).send(status);
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
}


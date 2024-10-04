const express = require("express");
const router = express.Router();
const { addTodoStatus, getTodoStatus, updateTodoStatus, deleteTodoStatus } = require("../controller/todoStatusController");
const { jwtToken } = require("../middleware/auth");

router.get("/", jwtToken, getTodoStatus);
router.post("/addTodoStatus", jwtToken, addTodoStatus);
router.put("/updateTodoStatus", jwtToken, updateTodoStatus);
router.delete("/deleteTodoStatus", jwtToken, deleteTodoStatus);

module.exports = router;
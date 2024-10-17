const express = require("express");
const { createTodo, updateTodo, getTodo, getSingleTodo, getAllTodoByAdmin } = require("../controller/todoController");
const { jwtToken } = require("../middleware/auth")
const { checkAdmin } = require("../middleware/checkAdmin")

const routers = express.Router()

routers.get("/", jwtToken, getTodo)
routers.get("/get-all-todos", jwtToken, checkAdmin, getAllTodoByAdmin)
routers.get("/:id", jwtToken, getSingleTodo)
routers.post("/create", jwtToken, createTodo)
routers.put("/update/:id", jwtToken, updateTodo)


module.exports = routers
const express = require("express");
const { createProject, getAllProjects, getProjectById, updateProject, deleteProject } = require("../controller/projectController");
const { jwtToken, checkAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", jwtToken,checkAdmin, getAllProjects);
router.get("/:id", jwtToken,checkAdmin, getProjectById);
router.post("/create", jwtToken,checkAdmin, createProject);
router.put("/update/:id", jwtToken,checkAdmin, updateProject);

module.exports = router;

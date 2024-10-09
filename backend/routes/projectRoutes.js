const express = require("express");
const { createProject, getAllProjects, getProjectById, updateProject, getProjectByClientId } = require("../controller/projectController");
const { jwtToken, checkAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", jwtToken,checkAdmin, getAllProjects);
router.get("/client/:id", jwtToken,checkAdmin, getProjectByClientId);
router.post("/create", jwtToken,checkAdmin, createProject);
router.put("/update/:id", jwtToken,checkAdmin, updateProject);
router.get("/:id", jwtToken,checkAdmin, getProjectById);


module.exports = router;

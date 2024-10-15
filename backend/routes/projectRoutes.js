const express = require("express");
const { createProject, getAllProjects, getProjectById, updateProject, getProjectByClientId, updateProjectImage, getProjectByLogedInUser } = require("../controller/projectController");
const { jwtToken, checkAdmin } = require("../middleware/auth");
const upload = require("../middleware/multer");

const router = express.Router();

router.get("/", jwtToken,checkAdmin, getAllProjects);
router.get("/client/:id", jwtToken,checkAdmin, getProjectByClientId);
router.get("/enrolledProjects", jwtToken, getProjectByLogedInUser);
router.post("/create", jwtToken,checkAdmin, upload.single("projectImage"), createProject);
router.put("/update/:id", jwtToken,checkAdmin, updateProject);
router.get("/:id", jwtToken,checkAdmin, getProjectById);
router.patch("/updateImage/:id", jwtToken,checkAdmin, upload.single("projectImage"), updateProjectImage);

module.exports = router;

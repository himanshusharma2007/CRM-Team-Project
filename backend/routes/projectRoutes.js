const express = require("express");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  getProjectByClientId,
  updateProjectImage,
  getProjectByLogedInUser,
} = require("../controller/projectController");
const { jwtToken } = require("../middleware/auth");
const { checkPermission } = require("../middleware/permission")
const upload = require("../middleware/multer");

const router = express.Router();

router.get("/", jwtToken, checkPermission("project read"), getAllProjects);
router.get("/client/:id", jwtToken, checkPermission("project read"), getProjectByClientId);
router.get("/enrolledProjects", jwtToken, getProjectByLogedInUser);
router.post("/create",jwtToken,checkPermission("project create"),upload.single("projectImage"),createProject);
router.put("/update/:id", jwtToken, checkPermission("project update"), updateProject);
router.get("/:id", jwtToken, checkPermission("project read"), getProjectById);
router.patch("/updateImage/:id",jwtToken,checkPermission("project update"),upload.single("projectImage"),updateProjectImage);

module.exports = router;

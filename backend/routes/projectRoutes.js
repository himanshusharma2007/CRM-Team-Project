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
const { jwtToken, checkAdmin, checkSubAdmin } = require("../middleware/auth");
const upload = require("../middleware/multer");

const router = express.Router();

router.get("/", jwtToken, checkSubAdmin, getAllProjects);
router.get("/client/:id", jwtToken, checkSubAdmin, getProjectByClientId);
router.get("/enrolledProjects", jwtToken, getProjectByLogedInUser);
router.post(
  "/create",
  jwtToken,
  checkAdmin,
  upload.single("projectImage"),
  createProject
);
router.put("/update/:id", jwtToken, checkSubAdmin, updateProject);
router.get("/:id", jwtToken, checkSubAdmin, getProjectById);
router.patch(
  "/updateImage/:id",
  jwtToken,
  checkAdmin,
  upload.single("projectImage"),
  updateProjectImage
);

module.exports = router;

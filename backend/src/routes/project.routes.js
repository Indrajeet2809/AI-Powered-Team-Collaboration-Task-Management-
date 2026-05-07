const express = require("express");

const projectController = require("../controllers/project.controller");

const {
  isAuthenticated,
  isOrganizationAdmin,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/organization/:organizationId",
  isAuthenticated,
  isOrganizationAdmin,
  projectController.createProject
);

router.get(
  "/organization/:organizationId",
  isAuthenticated,
  projectController.getOrganizationProjects
);

router.post(
  "/:projectId/tasks",
  isAuthenticated,
  projectController.createTask
);

router.get(
  "/:projectId/tasks",
  isAuthenticated,
  projectController.getProjectTasks
);

router.patch(
  "/tasks/:taskId/status",
  isAuthenticated,
  projectController.updateTaskStatus
);

module.exports = router;
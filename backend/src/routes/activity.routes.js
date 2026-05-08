const express = require("express");

const activityController = require("../controllers/activity.controller");

const {
  isAuthenticated,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/organization/:organizationId",
  isAuthenticated,
  activityController.getOrganizationActivities
);

module.exports = router;
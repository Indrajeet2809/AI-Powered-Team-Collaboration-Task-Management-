const express = require("express");

const teamController = require("../controllers/team.controller");

const {
  isAuthenticated,
  isOrganizationAdmin,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/organization/:organizationId",
  isAuthenticated,
  isOrganizationAdmin,
  teamController.createTeam
);

router.get(
  "/organization/:organizationId",
  isAuthenticated,
  teamController.getOrganizationTeams
);

router.post(
  "/:teamId/members",
  isAuthenticated,
  teamController.addMemberToTeam
);

module.exports = router;
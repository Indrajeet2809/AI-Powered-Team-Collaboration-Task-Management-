const express = require("express");

const teamController = require("../controllers/team.controller");

const {
  isAuthenticated,
  isOrganizationAdmin,
  isOrganizationManagerOrAdmin,
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

router.post(
  "/organization/:organizationId",
  isAuthenticated,
  isOrganizationManagerOrAdmin,
  teamController.createTeam
);

module.exports = router;
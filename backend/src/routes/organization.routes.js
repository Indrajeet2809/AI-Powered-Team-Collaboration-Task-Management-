const express = require("express");
const organizationController = require("../controllers/organization.controller");

const {
  isAuthenticated,
  isSuperAdmin,
  isOrganizationAdmin,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  organizationController.createOrganization
);

router.get(
  "/my",
  isAuthenticated,
  organizationController.getMyOrganizations
);

router.get(
  "/",
  isAuthenticated,
  isSuperAdmin,
  organizationController.getAllOrganizations
);

router.delete(
  "/:organizationId",
  isAuthenticated,
  isSuperAdmin,
  organizationController.deleteOrganization
);

router.post(
  "/:organizationId/members",
  isAuthenticated,
  isOrganizationAdmin,
  organizationController.addMemberToOrganization
);

module.exports = router;
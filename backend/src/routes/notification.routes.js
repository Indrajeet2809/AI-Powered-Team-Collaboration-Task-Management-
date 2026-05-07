const express = require("express");

const notificationController = require("../controllers/notification.controller");

const {
  isAuthenticated,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/",
  isAuthenticated,
  notificationController.getMyNotifications
);

router.patch(
  "/:notificationId/read",
  isAuthenticated,
  notificationController.markNotificationAsRead
);

module.exports = router;
const notificationService = require("../services/notification.service");

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getMyNotifications(
      req.user.id
    );

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await notificationService.markAsRead(notificationId, req.user.id);

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
};
const prisma = require("../config/prisma");

const createNotification = async ({ userId, title, message, type }) => {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });
};

const getMyNotifications = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const markAsRead = async (notificationId, userId) => {
  return await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
    },
  });
};

module.exports = {
  createNotification,
  getMyNotifications,
  markAsRead,
};
const prisma = require("../config/prisma");

const createActivityLog = async ({
  userId,
  organizationId,
  action,
  description,
}) => {
  return await prisma.activityLog.create({
    data: {
      userId,
      organizationId,
      action,
      description,
    },
  });
};

const getOrganizationActivities = async (
  organizationId
) => {
  return await prisma.activityLog.findMany({
    where: {
      organizationId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

module.exports = {
  createActivityLog,
  getOrganizationActivities,
};
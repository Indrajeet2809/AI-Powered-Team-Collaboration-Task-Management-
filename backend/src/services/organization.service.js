const prisma = require("../config/prisma");

const createOrganization = async (userId, name, description) => {
  const organization = await prisma.organization.create({
    data: {
      name,
      description,
      members: {
        create: {
          userId,
          role: "ORG_ADMIN",
        },
      },
    },
    include: {
      members: true,
    },
  });

  return organization;
};

const getMyOrganizations = async (userId) => {
  return await prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      members: true,
    },
  });
};

const getAllOrganizations = async () => {
  return await prisma.organization.findMany({
    include: {
      members: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const deleteOrganization = async (organizationId) => {
  return await prisma.organization.delete({
    where: {
      id: organizationId,
    },
  });
};

module.exports = {
  createOrganization,
  getMyOrganizations,
  getAllOrganizations,
  deleteOrganization,
};
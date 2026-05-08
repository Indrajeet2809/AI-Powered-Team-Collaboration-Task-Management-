const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

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

// const getMyOrganizations = async (userId) => {
//   return await prisma.organization.findMany({
//     where: {
//       members: {
//         some: {
//           userId,
//         },
//       },
//     },
//     include: {
//       members: true,
//     },
//   });
// };
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
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      teams: true,
      projects: true,
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

const addMemberToOrganization = async (
  organizationId,
  name,
  email,
  password,
  role = "MEMBER"
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }

  const existingMember = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId,
      },
    },
  });

  if (existingMember) {
    throw new Error("User is already a member of this organization");
  }

  const member = await prisma.organizationMember.create({
    data: {
      userId: user.id,
      organizationId,
      role,
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
  });

  return member;
};

module.exports = {
  createOrganization,
  getMyOrganizations,
  getAllOrganizations,
  deleteOrganization,
  addMemberToOrganization,
};
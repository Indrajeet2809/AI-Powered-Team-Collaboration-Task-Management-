const prisma = require("../config/prisma");

const createTeam = async (
  organizationId,
  name,
  description
) => {
  return await prisma.team.create({
    data: {
      name,
      description,
      organizationId,
    },
  });
};

const getOrganizationTeams = async (
  organizationId
) => {
  return await prisma.team.findMany({
    where: {
      organizationId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });
};

const addMemberToTeam = async (
  teamId,
  userId
) => {
  return await prisma.teamMember.create({
    data: {
      teamId,
      userId,
    },
  });
};

module.exports = {
  createTeam,
  getOrganizationTeams,
  addMemberToTeam,
};
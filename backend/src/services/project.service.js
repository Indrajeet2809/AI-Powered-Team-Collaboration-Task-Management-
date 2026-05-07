const prisma = require("../config/prisma");

const createProject = async (
  organizationId,
  teamId,
  name,
  description
) => {
  return await prisma.project.create({
    data: {
      name,
      description,
      organizationId,
      teamId,
    },
  });
};

const getOrganizationProjects = async (
  organizationId
) => {
  return await prisma.project.findMany({
    where: {
      organizationId,
    },
    include: {
      team: true,
      tasks: true,
    },
  });
};

const createTask = async (
  projectId,
  title,
  description,
  priority,
  dueDate,
  assignedToId
) => {
  return await prisma.task.create({
    data: {
      projectId,
      title,
      description,
      priority,
      dueDate: dueDate
        ? new Date(dueDate)
        : null,
      assignedToId,
    },
  });
};

const getProjectTasks = async (projectId) => {
  return await prisma.task.findMany({
    where: {
      projectId,
    },
    include: {
      assignedTo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateTaskStatus = async (
  taskId,
  status
) => {
  return await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status,
    },
  });
};

module.exports = {
  createProject,
  getOrganizationProjects,
  createTask,
  getProjectTasks,
  updateTaskStatus,
};
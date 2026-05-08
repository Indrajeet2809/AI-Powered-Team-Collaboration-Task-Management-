const prisma = require("../config/prisma");
const activityService = require("../services/activity.service");

const notificationService = require("../services/notification.service");

const projectService = require("../services/project.service");

const createProject = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const {
      teamId,
      name,
      description,
    } = req.body;

    const project =
      await projectService.createProject(
        organizationId,
        teamId,
        name,
        description
      );

      await activityService.createActivityLog({
       userId: req.user.id,
       organizationId,
       action: "CREATE_PROJECT",
       description: `${req.user.email} created project "${project.name}"`,
      });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrganizationProjects = async (
  req,
  res
) => {
  try {
    const { organizationId } = req.params;

    const projects =
      await projectService.getOrganizationProjects(
        organizationId
      );

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const createTask = async (req, res) => {
//   try {
//     const { projectId } = req.params;

//     const {
//       title,
//       description,
//       priority,
//       dueDate,
//       assignedToId,
//     } = req.body;

//     const task =
//       await projectService.createTask(
//         projectId,
//         title,
//         description,
//         priority,
//         dueDate,
//         assignedToId
//       );

//     res.status(201).json({
//       success: true,
//       message: "Task created successfully",
//       task,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      title,
      description,
      priority,
      dueDate,
      assignedToId,
    } = req.body;

    const task = await projectService.createTask(
      projectId,
      title,
      description,
      priority,
      dueDate,
      assignedToId
    );

     const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        },
      });

      await activityService.createActivityLog({
      userId: req.user.id,
      organizationId: project.organizationId,
      action: "CREATE_TASK",
      description: `${req.user.email} created task "${task.title}"`,
      });

    
     if (assignedToId) {
      // Save notification in PostgreSQL
      const notification =
      await notificationService.createNotification({
      userId: assignedToId,
      title: "New Task Assigned",
      message: `You have been assigned a new task: ${task.title}`,
      type: "TASK_ASSIGNED",
    });

    // Real-time socket notification
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    const receiverSocketId =
    onlineUsers.get(assignedToId);

    if (receiverSocketId) {
     io.to(receiverSocketId).emit(
      "taskAssigned",
       {
        notification,
        task,
       }
     );
    }
  }

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjectTasks = async (
  req,
  res
) => {
  try {
    const { projectId } = req.params;

    const tasks =
      await projectService.getProjectTasks(
        projectId
      );

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTaskStatus = async (
  req,
  res
) => {
  try {
    const { taskId } = req.params;

    const { status } = req.body;

    const task =
      await projectService.updateTaskStatus(
        taskId,
        status
      );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getOrganizationProjects,
  createTask,
  getProjectTasks,
  updateTaskStatus,
};
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.user.platformRole !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super Admin only.",
    });
  }

  next();
};

const isOrganizationAdmin = async (req, res, next) => {
  try {
    const { organizationId } = req.params;

    const membership =
      await prisma.organizationMember.findFirst({
        where: {
          userId: req.user.id,
          organizationId,
          role: "ORG_ADMIN",
        },
      });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Organization Admin only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const isOrganizationManagerOrAdmin = async (req, res, next) => {
  try {
    const organizationId =
      req.params.organizationId || req.body.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: req.user.id,
        organizationId,
        role: {
          in: ["ORG_ADMIN", "MANAGER"],
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin or Manager only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const canManageProjectByProjectId = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: req.user.id,
        organizationId: project.organizationId,
        role: {
          in: ["ORG_ADMIN", "MANAGER"],
        },
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin or Manager only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  isAuthenticated,
  isSuperAdmin,
  isOrganizationAdmin,
  isOrganizationManagerOrAdmin,
  canManageProjectByProjectId,
};
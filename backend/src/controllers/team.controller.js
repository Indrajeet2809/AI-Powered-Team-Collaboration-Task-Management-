const teamService = require("../services/team.service");
const activityService = require("../services/activity.service");

const createTeam = async (req, res) => {
  try {
    const { organizationId } = req.params;

    const { name, description } = req.body;

    const team = await teamService.createTeam(
      organizationId,
      name,
      description
    );

    await activityService.createActivityLog({
    userId: req.user.id,
    organizationId,
    action: "CREATE_TEAM",
    description: `${req.user.email} created team "${team.name}"`,
    });

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrganizationTeams = async (
  req,
  res
) => {
  try {
    const { organizationId } = req.params;

    const teams =
      await teamService.getOrganizationTeams(
        organizationId
      );

    res.status(200).json({
      success: true,
      teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addMemberToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const { userId } = req.body;

    const member =
      await teamService.addMemberToTeam(
        teamId,
        userId
      );

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      member,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTeam,
  getOrganizationTeams,
  addMemberToTeam,
};
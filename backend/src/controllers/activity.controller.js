const activityService = require("../services/activity.service");

const getOrganizationActivities = async (
  req,
  res
) => {
  try {
    const { organizationId } = req.params;

    const activities =
      await activityService.getOrganizationActivities(
        organizationId
      );

    res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getOrganizationActivities,
};
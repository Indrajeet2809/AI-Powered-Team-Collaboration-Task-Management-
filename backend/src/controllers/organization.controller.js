const organizationService = require("../services/organization.service");

const createOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Organization name is required",
      });
    }

    const organization = await organizationService.createOrganization(
      req.user.id,
      name,
      description
    );

    res.status(201).json({
      success: true,
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrganizations = async (req, res) => {
  try {
    const organizations = await organizationService.getMyOrganizations(
      req.user.id
    );

    res.status(200).json({
      success: true,
      organizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await organizationService.getAllOrganizations();

    res.status(200).json({
      success: true,
      organizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;

    await organizationService.deleteOrganization(organizationId);

    res.status(200).json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrganization,
  getMyOrganizations,
  getAllOrganizations,
  deleteOrganization,
};
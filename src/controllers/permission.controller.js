const permissionService = require('../services/permission.service');

const getPermissions = async (req, res) => {
  try {
    const permissions = await permissionService.getPermissions();

    res.status(200).json({
      success: true,
      message: 'Permissions fetched successfully',
      data: permissions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPermission = async (req, res) => {
  try {
    const permission = await permissionService.createPermission(req.body);

    res.status(201).json({
      success: true,
      message: 'Permission created successfully',
      data: permission
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updatePermission = async (req, res) => {
  try {
    const permission = await permissionService.updatePermission(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Permission updated successfully',
      data: permission
    });
  } catch (error) {
    const status = error.message === 'Permission not found' ? 404 : 400;
    res.status(status).json({ success: false, message: error.message });
  }
};

const deletePermission = async (req, res) => {
  try {
    const permission = await permissionService.deletePermission(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Permission deleted successfully',
      data: permission
    });
  } catch (error) {
    const status = error.message === 'Permission not found' ? 404 : 400;
    res.status(status).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission
};
const roleService = require('../services/role.service');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const XLSX = require('xlsx');

const getRoles = async (req, res) => {
  try {
    const roles = await roleService.getRoles(req.query);

    res.status(200).json({
      success: true,
      message: 'Roles fetched successfully',
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRoleById = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Role fetched successfully',
      data: role
    });
  } catch (error) {
    const status = error.message === 'Role not found' ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

const createRole = async (req, res) => {
  try {
    const role = await roleService.createRole(req.body);

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const role = await roleService.updateRoleById(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: role
    });
  } catch (error) {
    const status = error.message === 'Role not found' ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    const role = await roleService.deleteRoleById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
      data: role
    });
  } catch (error) {
    const status = error.message === 'Role not found' ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};

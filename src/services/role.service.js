const Role = require('../models/Role');

const toSlug = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const getRoles = async (filters = {}) => {
  const query = {};

  return Role.find(query)
    .sort({ createdAt: -1 });
};

const getRoleById = async (roleId) => {
  const role = await Role.findById(roleId)

  if (!role) {
    throw new Error('Role not found');
  }

  return role;
};

const createRole = async (payload = {}) => {
  const {
    name,
    description,
    permissions,
    isActive
  } = payload;


  if (!name || !String(name).trim()) {
    throw new Error('Role name is required');
  }
  const role = await Role.create({
    name: String(name).trim(),
    description: payload.description || '',
    permissions: payload.permissions || [],
    isActive: payload.isActive ?? true
  });

  return role;
};

const updateRoleById = async (roleId, payload = {}) => {
  const role = await Role.findById(roleId);

  if (!role) {
    throw new Error('Role not found');
  }

  if (payload.name) {
    role.name = String(payload.name).trim();
  }


  if (payload.description !== undefined) role.description = payload.description;
  if (payload.permissions !== undefined) role.permissions = payload.permissions;
  if (payload.isActive !== undefined) role.isActive = payload.isActive;

  await role.save();

  return role;
};

const deleteRoleById = async (roleId) => {
  const role = await Role.findByIdAndDelete(roleId);

  if (!role) {
    throw new Error('Role not found');
  }

  return role;
};




module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRoleById,
  deleteRoleById
};

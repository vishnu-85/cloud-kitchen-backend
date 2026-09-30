const { randomUUID } = require('crypto');
const Permission = require('../models/Permission');

const getPermissions = async () => Permission.find().sort({ name: 1 });

const createPermission = async (payload = {}) => {
  const name = String(payload.name || '').trim();
  const label = String(payload.label || '').trim();

  if (!name) {
    throw new Error('Permission name is required');
  }

  if (!label) {
    throw new Error('Permission label is required');
  }

  return Permission.create({
    _id: payload._id ? String(payload._id).trim() : randomUUID(),
    name,
    label
  });
};

const updatePermission = async (id, payload = {}) => {
  const updates = {};

  if (payload.name !== undefined) {
    const name = String(payload.name).trim();
    if (!name) throw new Error('Permission name is required');
    updates.name = name;
  }

  if (payload.label !== undefined) {
    const label = String(payload.label).trim();
    if (!label) throw new Error('Permission label is required');
    updates.label = label;
  }

  const permission = await Permission.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!permission) {
    throw new Error('Permission not found');
  }

  return permission;
};

const deletePermission = async (id) => {
  const permission = await Permission.findByIdAndDelete(id);

  if (!permission) {
    throw new Error('Permission not found');
  }

  return permission;
};

module.exports = {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission
};
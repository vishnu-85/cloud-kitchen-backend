const bcrypt = require('bcryptjs');
const User = require('../models/User');

const getUserByID = async (name) => {
  const user = await User.findOne({ name }).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const getUsers = async (filters = {}) => {
  const match = {};

  for (const field of ['name', 'email', 'phone']) {
    if (filters[field]) {
      match[field] = { $regex: filters[field], $options: 'i' };
    }
  }

  if (filters.roleId) {
    match.roleId = filters.roleId;
  }

  if (filters.isActive !== undefined) {
    match.isActive = String(filters.isActive).toLowerCase() === 'true';
  }

  return User.aggregate([
    { $match: match },
    {
      $lookup: {
        from: 'roles',
        localField: 'roleId',
        foreignField: '_id',
        as: 'role'
      }
    },
    {
      $unwind: {
        path: '$role',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        isActive: 1,
        roleId: 1,
        roleName: '$role.name'
      }
    }
  ]);
};

const createUser = async (payload = {}) => {
  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || '').trim();
  const { password, roleId } = payload;

  if (!name || !email || !phone || !password || !roleId) {
    throw new Error('Name, email, phone, password and roleId are required');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    roleId,
    isActive: payload.isActive ?? true
  });

  return User.findById(user._id).select('-password');
};

const updateUser = async (id, payload = {}) => {
  const updates = {};

  for (const field of ['name', 'email', 'phone']) {
    if (payload[field] !== undefined) {
      const value = String(payload[field]).trim();
      if (!value) throw new Error(`User ${field} is required`);
      updates[field] = field === 'email' ? value.toLowerCase() : value;
    }
  }

  if (payload.password !== undefined) {
    if (!payload.password) throw new Error('User password is required');
    updates.password = await bcrypt.hash(payload.password, 12);
  }

  if (payload.roleId !== undefined) {
    updates.roleId = payload.roleId;
  }

  if (payload.isActive !== undefined) {
    updates.isActive = payload.isActive;
  }

  const user = await User.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = {
  getUserByID,
  getUsers,
  createUser,
  updateUser
};
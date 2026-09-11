const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const registerUser = async (payload = {}) => {
  const { name, email, phone, password, roleId } = payload;

  if (!name || !email || !phone || !password) {
    throw new Error('Name, email, phone and password are required');
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }]
  });

  if (existingUser) {
    throw new Error('Email or phone already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    roleId: roleId || null
  });

  const token = generateToken({
    userId: user._id.toString(),
    role: user.roleId
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.roleId
    },
    token
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken({
    userId: user._id.toString(),
    role: user.roleId
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.roleId
    },
    token
  };
};

const getUserByID = async (name) => {
  const user = await User.findOne({ name });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserByID
};
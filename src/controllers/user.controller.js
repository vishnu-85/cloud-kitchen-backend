const userService = require('../services/user.service');

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers(req.query);
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserByID = async (req, res) => {
  try {
    const user = await userService.getUserByID(req.params.name);
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user
    });
  } catch (error) {
    const status = error.message === 'User not found' ? 404 : 400;
    res.status(status).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    const status = error.message === 'User not found' ? 404 : 400;
    res.status(status).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUser
};
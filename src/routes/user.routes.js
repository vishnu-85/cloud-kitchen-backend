const express = require('express');
const {
  getUserByID,
  getUsers,
  createUser,
  updateUser
} = require('../controllers/user.controller');

const router = express.Router();

router.get('/', getUsers);
router.get('/:name', getUserByID);
router.post('/', createUser);
router.patch('/:id', updateUser);

module.exports = router;
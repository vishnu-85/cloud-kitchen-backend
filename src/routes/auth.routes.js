const express = require('express');
const { Auth } = require('../middleware/auth.middleware')

const {
  register,
  login,
  getUserByID,
  getUsers
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);
router.get('/users', getUsers);
router.get('/user/:name', getUserByID);

module.exports = router;
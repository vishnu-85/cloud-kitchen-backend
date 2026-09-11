const express = require('express');
const { Auth } = require('../middleware/auth.middleware')

const {
  register,
  login,
  getUserByID
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);
router.get('/user/:name', getUserByID);

module.exports = router;
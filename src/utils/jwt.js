const jwt = require('jsonwebtoken');

const generateToken = (data = {}, role) => {
  const payload = {
    userId: data.userId || data._id || data,
    role: data.role || role
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'cloud-kitchen-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = {
  generateToken
};
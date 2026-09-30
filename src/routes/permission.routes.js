const express = require('express');
const {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission
} = require('../controllers/permission.controller');

const router = express.Router();

router.get('/', getPermissions);
router.post('/', createPermission);
router.patch('/:id', updatePermission);
router.delete('/:id', deletePermission);

module.exports = router;
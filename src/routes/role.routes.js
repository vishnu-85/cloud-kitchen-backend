const express = require('express');

const {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/role.controller');

const router = express.Router();

router.get('/', getRoles);
router.get('/:id', getRoleById);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;

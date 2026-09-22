const express = require('express');

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');

const router = express.Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/delete/:id', deleteCategory);

module.exports = router;

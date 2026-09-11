const express = require('express');

const {
  getCart,
  addItemToCart,
  updateCartItem,
  deleteCartItem
} = require('../controllers/cart.controller');

const router = express.Router();

router.get('/', getCart);
router.post('/items', addItemToCart);
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', deleteCartItem);

module.exports = router;

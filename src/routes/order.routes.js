const express = require('express');

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} = require('../controllers/order.controller');

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;

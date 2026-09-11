const orderService = require('../services/order.service');

const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders(req.user?.userId || req.query.userId);

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user?.userId || req.query.userId);

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order
    });
  } catch (error) {
    const status = error.message === 'Order not found' ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder({
      ...req.body,
      userId: req.user?.userId || req.body.userId
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status, req.user?.userId || req.body.userId);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    const status = error.message === 'Order not found' ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
};

const { randomUUID } = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const generateOrderNumber = () => `CK-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`;

const getOrders = async (userId) => {
  const query = {};

  if (userId) {
    query.userId = userId;
  }

  return Order.find(query).sort({ createdAt: -1 });
};

const getOrderById = async (orderId, userId) => {
  const query = { _id: orderId };

  if (userId) {
    query.userId = userId;
  }

  const order = await Order.findOne(query);

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};

const createOrder = async (payload = {}) => {
  const { userId, items, deliveryAddress, paymentMethod, notes } = payload;

  if (!userId) {
    throw new Error('User is required');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order items are required');
  }

  if (!deliveryAddress) {
    throw new Error('Delivery address is required');
  }

  if (!paymentMethod) {
    throw new Error('Payment method is required');
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.total || item.price * item.quantity || 0), 0);
  const discount = payload.pricing?.discount || 0;
  const deliveryFee = payload.pricing?.deliveryFee || 0;
  const tax = payload.pricing?.tax || 0;
  const grandTotal = payload.pricing?.grandTotal || subtotal + discount + deliveryFee + tax;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    userId,
    items: items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image || '',
      total: Number(item.total || item.price * item.quantity)
    })),
    deliveryAddress: {
      receiverName: deliveryAddress.receiverName,
      receiverPhone: deliveryAddress.receiverPhone,
      addressLine1: deliveryAddress.addressLine1,
      addressLine2: deliveryAddress.addressLine2 || '',
      landmark: deliveryAddress.landmark || '',
      city: deliveryAddress.city,
      state: deliveryAddress.state,
      pincode: deliveryAddress.pincode
    },
    pricing: {
      subtotal,
      discount,
      deliveryFee,
      tax,
      grandTotal
    },
    paymentMethod,
    paymentStatus: payload.paymentStatus || 'pending',
    orderStatus: payload.orderStatus || 'pending',
    notes: notes || ''
  });

  if (payload.clearCart) {
    await Cart.findOneAndUpdate({ userId }, { items: [], subtotal: 0, discount: 0, deliveryFee: 0, tax: 0, grandTotal: 0 }, { new: true });
  }

  return order;
};

const updateOrderStatus = async (orderId, status, userId) => {
  const order = await getOrderById(orderId, userId);

  if (!status) {
    throw new Error('Status is required');
  }

  order.orderStatus = status;

  if (status === 'delivered') {
    order.deliveredAt = new Date();
  }

  if (status === 'cancelled') {
    order.cancelledAt = new Date();
  }

  await order.save();
  return order;
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
};

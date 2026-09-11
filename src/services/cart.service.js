const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCartByUserId = async (userId) => {
  if (!userId) {
    throw new Error('User is required');
  }

  let cart = await Cart.findOne({ userId }).lean();

  if (!cart) {
    cart = { userId, items: [], subtotal: 0, discount: 0, deliveryFee: 0, tax: 0, grandTotal: 0 };
  }

  return cart;
};

const addItemToCart = async (userId, payload = {}) => {
  if (!userId) {
    throw new Error('User is required');
  }

  const { productId, quantity = 1 } = payload;

  if (!productId) {
    throw new Error('Product is required');
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  const qty = Number(quantity) > 0 ? Number(quantity) : 1;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [], subtotal: 0, discount: 0, deliveryFee: 0, tax: 0, grandTotal: 0 });
  }

  const existingItem = cart.items.find((item) => item.productId.toString() === productId.toString());

  if (existingItem) {
    existingItem.quantity += qty;
    existingItem.total = existingItem.quantity * existingItem.price;
  } else {
    cart.items.push({
      productId,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.image || '',
      total: product.price * qty
    });
  }

  cart.subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
  cart.tax = cart.subtotal * 0.05;
  cart.deliveryFee = cart.items.length > 0 ? 40 : 0;
  cart.grandTotal = cart.subtotal + cart.tax + cart.deliveryFee - cart.discount;

  await cart.save();
  return cart;
};

const updateCartItem = async (userId, productId, payload = {}) => {
  if (!userId) {
    throw new Error('User is required');
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error('Cart not found');
  }

  const item = cart.items.find((cartItem) => cartItem.productId.toString() === productId.toString());

  if (!item) {
    throw new Error('Cart item not found');
  }

  const quantity = Number(payload.quantity || item.quantity);

  if (quantity <= 0) {
    cart.items = cart.items.filter((cartItem) => cartItem.productId.toString() !== productId.toString());
  } else {
    item.quantity = quantity;
    item.total = item.quantity * item.price;
  }

  cart.subtotal = cart.items.reduce((sum, cartItem) => sum + cartItem.total, 0);
  cart.tax = cart.subtotal * 0.05;
  cart.deliveryFee = cart.items.length > 0 ? 40 : 0;
  cart.grandTotal = cart.subtotal + cart.tax + cart.deliveryFee - cart.discount;

  await cart.save();
  return cart;
};

const deleteCartItem = async (userId, productId) => {
  if (!userId) {
    throw new Error('User is required');
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new Error('Cart not found');
  }

  const originalLength = cart.items.length;
  cart.items = cart.items.filter((item) => item.productId.toString() !== productId.toString());

  if (cart.items.length === originalLength) {
    throw new Error('Cart item not found');
  }

  cart.subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
  cart.tax = cart.subtotal * 0.05;
  cart.deliveryFee = cart.items.length > 0 ? 40 : 0;
  cart.grandTotal = cart.subtotal + cart.tax + cart.deliveryFee - cart.discount;

  await cart.save();
  return cart;
};

module.exports = {
  getCartByUserId,
  addItemToCart,
  updateCartItem,
  deleteCartItem
};

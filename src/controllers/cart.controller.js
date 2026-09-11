const cartService = require('../services/cart.service');

const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCartByUserId(req.user?.userId || req.query.userId);

    res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data: cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const addItemToCart = async (req, res) => {
  try {
    const cart = await cartService.addItemToCart(req.user?.userId || req.body.userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const cart = await cartService.updateCartItem(req.user?.userId || req.body.userId, req.params.productId, req.body);

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: cart
    });
  } catch (error) {
    const status = error.message === 'Cart not found' || error.message === 'Cart item not found' ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const cart = await cartService.deleteCartItem(req.user?.userId || req.body.userId, req.params.productId);

    res.status(200).json({
      success: true,
      message: 'Cart item deleted successfully',
      data: cart
    });
  } catch (error) {
    const status = error.message === 'Cart not found' || error.message === 'Cart item not found' ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  deleteCartItem
};

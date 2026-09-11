const addressService = require('../services/address.service');

const getAddresses = async (req, res) => {
  try {
    const addresses = await addressService.getAddresses(req.user?.userId || req.query.userId);

    res.status(200).json({
      success: true,
      message: 'Addresses fetched successfully',
      data: addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createAddress = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user?.userId || req.body.userId
    };

    const address = await addressService.createAddress(payload);

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await addressService.updateAddressById(req.params.id, req.body, req.user?.userId || req.body.userId);

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    const status = error.message === 'Address not found' ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await addressService.deleteAddressById(req.params.id, req.user?.userId || req.body.userId);

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: address
    });
  } catch (error) {
    const status = error.message === 'Address not found' ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
};

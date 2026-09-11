const Address = require('../models/Address');

const getAddresses = async (userId) => {
  const query = {};

  if (userId) {
    query.userId = userId;
  }

  return Address.find(query).sort({ isDefault: -1, createdAt: -1 });
};

const getAddressById = async (addressId, userId) => {
  const address = await Address.findOne({ _id: addressId, ...(userId ? { userId } : {}) });

  if (!address) {
    throw new Error('Address not found');
  }

  return address;
};

const createAddress = async (payload = {}) => {
  const required = ['userId', 'receiverName', 'receiverPhone', 'addressLine1', 'city', 'state', 'pincode'];

  for (const field of required) {
    if (!payload[field]) {
      throw new Error(`${field} is required`);
    }
  }

  const address = await Address.create({
    userId: payload.userId,
    label: payload.label || 'home',
    receiverName: payload.receiverName,
    receiverPhone: payload.receiverPhone,
    addressLine1: payload.addressLine1,
    addressLine2: payload.addressLine2 || '',
    landmark: payload.landmark || '',
    city: payload.city,
    state: payload.state,
    pincode: payload.pincode,
    location: payload.location || {},
    isDefault: payload.isDefault ?? false
  });

  return address;
};

const updateAddressById = async (addressId, payload = {}, userId) => {
  const address = await getAddressById(addressId, userId);

  Object.keys(payload).forEach((key) => {
    if (payload[key] !== undefined && key !== 'userId') {
      address[key] = payload[key];
    }
  });

  await address.save();

  return address;
};

const deleteAddressById = async (addressId, userId) => {
  const address = await getAddressById(addressId, userId);
  await Address.deleteOne({ _id: address._id });
  return address;
};

module.exports = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddressById,
  deleteAddressById
};

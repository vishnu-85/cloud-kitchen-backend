const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    label: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },

    receiverName: {
      type: String,
      required: true,
      trim: true
    },

    receiverPhone: {
      type: String,
      required: true,
      trim: true
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true
    },

    addressLine2: {
      type: String,
      trim: true
    },

    landmark: {
      type: String,
      trim: true
    },

    city: {
      type: String,
      required: true,
      trim: true
    },

    state: {
      type: String,
      required: true,
      trim: true
    },

    pincode: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      latitude: {
        type: Number
      },

      longitude: {
        type: Number
      }
    },

    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'addresses',
    timestamps: true
  }
);

module.exports = mongoose.model('Address', addressSchema);
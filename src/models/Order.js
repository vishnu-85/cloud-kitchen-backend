const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

    name: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    image: {
      type: String
    },

    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: 'Order must contain at least one item'
      }
    },

    deliveryAddress: {
      receiverName: {
        type: String,
        required: true
      },

      receiverPhone: {
        type: String,
        required: true
      },

      addressLine1: {
        type: String,
        required: true
      },

      addressLine2: {
        type: String
      },

      landmark: {
        type: String
      },

      city: {
        type: String,
        required: true
      },

      state: {
        type: String,
        required: true
      },

      pincode: {
        type: String,
        required: true
      }
    },

    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0
      },

      discount: {
        type: Number,
        default: 0,
        min: 0
      },

      deliveryFee: {
        type: Number,
        default: 0,
        min: 0
      },

      tax: {
        type: Number,
        default: 0,
        min: 0
      },

      grandTotal: {
        type: Number,
        required: true,
        min: 0
      }
    },

    paymentMethod: {
      type: String,
      enum: ['cod', 'upi', 'card', 'netbanking'],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: [
        'pending',
        'paid',
        'failed',
        'refunded',
        'partially_refunded'
      ],
      default: 'pending'
    },

    orderStatus: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'rejected'
      ],
      default: 'pending',
      index: true
    },

    notes: {
      type: String,
      trim: true
    },

    cancelledAt: {
      type: Date
    },

    deliveredAt: {
      type: Date
    }
  },
  {
    collection: 'orders',
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
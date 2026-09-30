const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    _id: {
      type: String
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    label: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    collection: 'permissions',
    timestamps: true
  }
);

module.exports = mongoose.model('Permission', permissionSchema);
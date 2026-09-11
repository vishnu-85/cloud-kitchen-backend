const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    permissions: [
      {
        type: String,
        trim: true
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    collection: 'roles',
    timestamps: true
  }
);

module.exports = mongoose.model('Role', roleSchema);
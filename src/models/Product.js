const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
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

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discountPrice: {
      type: Number,
      min: 0
    },

    image: {
      type: String,
      trim: true
    },

    images: [
      {
        type: String,
        trim: true
      }
    ],

    foodType: {
      type: String,
      enum: ['veg', 'non-veg', 'egg'],
      required: true
    },

    isSpicy: {
      type: Boolean,
      default: false
    },

    spiceLevel: {
      type: String,
      enum: ['none', 'mild', 'medium', 'high'],
      default: 'none'
    },

    preparationTime: {
      type: Number,
      default: 20,
      min: 1
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    isBestseller: {
      type: Boolean,
      default: false
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    collection: 'products',
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
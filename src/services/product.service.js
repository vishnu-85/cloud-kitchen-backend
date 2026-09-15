const Product = require('../models/Product');

const toSlug = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const getProducts = async (filters = {}) => {
  const query = {};

  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }

  if (filters.foodType) {
    query.foodType = filters.foodType;
  }

  if (filters.isAvailable !== undefined) {
    query.isAvailable = String(filters.isAvailable).toLowerCase() === 'true';
  }

  if (filters.isFeatured !== undefined) {
    query.isFeatured = String(filters.isFeatured).toLowerCase() === 'true';
  }

  return Product.find(query)
    .populate('categoryId', 'name slug')
    .sort({ createdAt: -1 });
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId).populate('categoryId', 'name slug');

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

const createProduct = async (payload = {}) => {
  const {
    categoryId,
    name,
    price,
    foodType
  } = payload;

  if (!categoryId) {
    throw new Error('Category is required');
  }

  if (!name || !String(name).trim()) {
    throw new Error('Product name is required');
  }

  if (price === undefined || Number(price) < 0) {
    throw new Error('Valid product price is required');
  }

  if (!foodType) {
    throw new Error('Food type is required');
  }

  const slug = String(payload.slug || toSlug(name)).trim();

  const product = await Product.create({
    categoryId,
    name: String(name).trim(),
    slug,
    description: payload.description || '',
    price: Number(price),
    discountPrice: payload.discountPrice !== undefined ? Number(payload.discountPrice) : undefined,
    image: payload.image || '',
    images: payload.images || [],
    foodType,
    isSpicy: payload.isSpicy ?? false,
    spiceLevel: payload.spiceLevel || 'none',
    preparationTime: payload.preparationTime ?? 20,
    isAvailable: payload.isAvailable ?? true,
    isFeatured: payload.isFeatured ?? false,
    isBestseller: payload.isBestseller ?? false,
    rating: payload.rating ?? 0,
    totalReviews: payload.totalReviews ?? 0,
    stock: payload.stock || 10
  });

  return product;
};

const updateProductById = async (productId, payload = {}) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  if (payload.name) {
    product.name = String(payload.name).trim();
  }

  if (payload.slug) {
    product.slug = String(payload.slug).trim();
  } else if (payload.name) {
    product.slug = toSlug(product.name);
  }

  if (payload.categoryId) product.categoryId = payload.categoryId;
  if (payload.description !== undefined) product.description = payload.description;
  if (payload.price !== undefined) product.price = Number(payload.price);
  if (payload.discountPrice !== undefined) product.discountPrice = Number(payload.discountPrice);
  if (payload.image !== undefined) product.image = payload.image;
  if (payload.images) product.images = payload.images;
  if (payload.foodType) product.foodType = payload.foodType;
  if (payload.isSpicy !== undefined) product.isSpicy = payload.isSpicy;
  if (payload.spiceLevel) product.spiceLevel = payload.spiceLevel;
  if (payload.preparationTime !== undefined) product.preparationTime = payload.preparationTime;
  if (payload.isAvailable !== undefined) product.isAvailable = payload.isAvailable;
  if (payload.isFeatured !== undefined) product.isFeatured = payload.isFeatured;
  if (payload.isBestseller !== undefined) product.isBestseller = payload.isBestseller;
  if (payload.rating !== undefined) product.rating = payload.rating;
  if (payload.totalReviews !== undefined) product.totalReviews = payload.totalReviews;

  await product.save();

  return product;
};

const deleteProductById = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};


const saveProducts = async (products = []) => {
    try {
        await Product.insertMany(products);
        return products;
    } catch (error) {
        // console.error('Error saving products:', error);
        throw new Error('Failed to save products');
    }
}


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  saveProducts
};

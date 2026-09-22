const Category = require('../models/Category');
const Product = require('../models/Product');
const { mongoose } = require('mongoose');

const toSlug = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const getAllCategories = async (filters = {}) => {
  const query = {};

  if (filters.isActive !== undefined) {
    query.isActive = String(filters.isActive).toLowerCase() === 'true';
  }
  

  return Category.find(query).sort({ sortOrder: 1, name: 1 });
};

const createCategory = async (payload = {}) => {
  const name = String(payload.name || '').trim();

  if (!name) {
    throw new Error('Category name is required');
  }

  const slug = String(payload.slug || toSlug(name)).trim();

  const category = await Category.create({
    name,
    slug,
    description: payload.description || '',
    image: payload.image || '',
    sortOrder: payload.sortOrder ?? 0,
    isActive: payload.isActive ?? true
  });

  return category;
};

const updateCategory = async (id, payload) => {
  const data = {};

  if (payload.name !== undefined) {
    const name = String(payload.name).trim();

    if (name) {
      data.name = name;
      data.slug = payload.slug
        ? String(payload.slug).trim()
        : toSlug(name);
    }
  } else if (payload.slug !== undefined) {
    const slug = String(payload.slug).trim();

    if (slug) {
      data.slug = slug;
    }
  }

  if (payload.description !== undefined) {
    data.description = String(payload.description).trim();
  }

  if (payload.image !== undefined) {
    data.image = String(payload.image).trim();
  }

  if (payload.sortOrder !== undefined) {
    data.sortOrder = Number(payload.sortOrder);
  }

  if (payload.isActive !== undefined) {
    data.isActive = Boolean(payload.isActive);
  }

  const category = await Category.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true
    }
  );

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

const deleteCategoryID = async (id)=>{

  const product = await Product.find({
    categoryId: new mongoose.Types.ObjectId(id)
  })
  
  if(product?.length){
    throw new Error('categories associated with products');
  }
  const category = await Category.findByIdAndUpdate( id,
    { isActive: false },
    { new: true }
  );

    if (!category) {
      throw new Error('category not found');
    }

    return category;

}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategoryID
};
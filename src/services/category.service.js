const Category = require('../models/Category');

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

module.exports = {
  getAllCategories,
  createCategory
};
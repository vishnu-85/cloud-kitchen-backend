require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('../config/db');

const Role = require('../models/Role');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Address = require('../models/Address');

const rolesData = require('./roles.data');
const usersData = require('./users.data');
const categoriesData = require('./categories.data');
const productsData = require('./products.data');
const addressesData = require('./addresses.data');

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing seed data...');

    await Address.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    await Role.deleteMany({});

    console.log('Existing data cleared.');

    // --------------------------------------------------
    // 1. CREATE ROLES
    // --------------------------------------------------

    const roles = await Role.insertMany(rolesData);

    console.log(`Created ${roles.length} roles`);

    const roleMap = {};

    roles.forEach((role) => {
      roleMap[role.name] = role._id;
    });

    // --------------------------------------------------
    // 2. CREATE USERS
    // --------------------------------------------------

    const defaultPassword = 'Password@123';

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const usersToInsert = usersData.map((user) => ({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: hashedPassword,
      roleId: roleMap[user.role],
      isActive: user.isActive
    }));

    const users = await User.insertMany(usersToInsert);

    console.log(`Created ${users.length} users`);

    const userMap = {};

    users.forEach((user) => {
      userMap[user.email] = user._id;
    });

    // --------------------------------------------------
    // 3. CREATE CATEGORIES
    // --------------------------------------------------

    const categories = await Category.insertMany(categoriesData);

    console.log(`Created ${categories.length} categories`);

    const categoryMap = {};

    categories.forEach((category) => {
      categoryMap[category.slug] = category._id;
    });

    // --------------------------------------------------
    // 4. CREATE PRODUCTS
    // --------------------------------------------------

    const productsToInsert = productsData.map((product) => {
      const {
        categorySlug,
        ...productData
      } = product;

      return {
        ...productData,
        categoryId: categoryMap[categorySlug]
      };
    });

    const products = await Product.insertMany(productsToInsert);

    console.log(`Created ${products.length} products`);

    // --------------------------------------------------
    // 5. CREATE ADDRESSES
    // --------------------------------------------------

    const addressesToInsert = addressesData.map((address) => {
      const {
        userEmail,
        ...addressData
      } = address;

      return {
        ...addressData,
        userId: userMap[userEmail]
      };
    });

    const addresses = await Address.insertMany(addressesToInsert);

    console.log(`Created ${addresses.length} addresses`);

    // --------------------------------------------------
    // SUMMARY
    // --------------------------------------------------

    console.log('\n=================================');
    console.log('DATABASE SEED COMPLETED');
    console.log('=================================');

    console.log(`Roles:      ${roles.length}`);
    console.log(`Users:      ${users.length}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Products:   ${products.length}`);
    console.log(`Addresses:  ${addresses.length}`);

    console.log('\nDevelopment login credentials:');

    console.log('Customer:');
    console.log('Email: vishnu@example.com');
    console.log('Password: Password@123');

    console.log('\nAdmin:');
    console.log('Email: admin@example.com');
    console.log('Password: Password@123');

    console.log('\nKitchen:');
    console.log('Email: kitchen@example.com');
    console.log('Password: Password@123');

    console.log('\nDelivery:');
    console.log('Email: delivery@example.com');
    console.log('Password: Password@123');

    console.log('\n=================================');

    await mongoose.connection.close();

    process.exit(0);

  } catch (error) {
    console.error('\nSeed failed:');
    console.error(error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedDatabase();
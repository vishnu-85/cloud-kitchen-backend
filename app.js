const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Auth } = require('./src/middleware/auth.middleware');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const categoryRoutes = require('./src/routes/category.routes');
const productRoutes = require('./src/routes/product.routes');
const downloadRoutes = require('./src/routes/download.routes');
const addressRoutes = require('./src/routes/address.routes');
const cartRoutes = require('./src/routes/cart.routes');
const orderRoutes = require('./src/routes/order.routes');
const roleRoutes = require('./src/routes/role.routes');
const permissionRoutes = require('./src/routes/permission.routes');

const app = express();

app.use(helmet());

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cloud Kitchen API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', Auth, userRoutes);
app.use('/api/categories', Auth, categoryRoutes);
app.use('/api/products', Auth, productRoutes);
app.use('/api/product-data', Auth, downloadRoutes);
app.use('/api/addresses', Auth, addressRoutes);
app.use('/api/cart', Auth, cartRoutes);
app.use('/api/orders', Auth, orderRoutes);
app.use('/api/roles', Auth, roleRoutes);
app.use('/api/permissions', Auth, permissionRoutes);

module.exports = app;
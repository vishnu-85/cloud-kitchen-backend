const express = require('express');

const { downloadTemplate } = require('../controllers/download.controller');
const { uploadProducts } = require('../controllers/product.controller')
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.get('/product-template', downloadTemplate);

// Upload products
router.post('/product-upload', upload.single('file'), uploadProducts);

module.exports = router;
const productService = require('../services/product.service');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const XLSX = require('xlsx');

const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts(req.query);

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: product
    });
  } catch (error) {
    const status = error.message === 'Product not found' ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProductById(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    const status = error.message === 'Product not found' ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProductById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });
  } catch (error) {
    const status = error.message === 'Product not found' ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};



// Upload products from CSV / Excel
const uploadProducts = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a CSV or Excel file'
            });
        }

        const filePath = req.file.path;
        const extension = path.extname(req.file.originalname).toLowerCase();

        let products = [];

        // =========================
        // Read CSV
        // =========================
        if (extension === '.csv') {

            products = await new Promise((resolve, reject) => {

                const rows = [];

                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        rows.push(row);
                    })
                    .on('end', () => {
                        resolve(rows);
                    })
                    .on('error', reject);
            });
        }

        // =========================
        // Read Excel
        // =========================
        else if (extension === '.xlsx' || extension === '.xls') {

            const workbook = XLSX.readFile(filePath);

            const sheetName = workbook.SheetNames[0];

            const worksheet = workbook.Sheets[sheetName];

            products = XLSX.utils.sheet_to_json(worksheet);
        }

        // =========================
        // Validate
        // =========================

        if (!products.length) {

            fs.unlinkSync(filePath);

            return res.status(400).json({
                success: false,
                message: 'Uploaded file is empty'
            });
        }

        // =========================
        // Convert data
        // =========================

        const productData = products.map((product, index) => {

            return {
                categoryId: product.categoryId,

                name: product.name?.trim(),

                slug: product.slug
                    ? product.slug.trim()
                    : product.name
                        ?.toLowerCase()
                        .trim()
                        .replace(/\s+/g, '-'),

                description: product.description?.trim() || '',

                price: Number(product.price) || 0,

                discountPrice:
                    product.discountPrice !== undefined &&
                    product.discountPrice !== ''
                        ? Number(product.discountPrice)
                        : undefined,

                image: product.image?.trim() || '',

                images: product.images
                    ? product.images
                        .split(',')
                        .map(img => img.trim())
                    : [],

                foodType: product.foodType?.toLowerCase() || 'veg',

                isSpicy:
                    String(product.isSpicy).toLowerCase() === 'true',

                spiceLevel:
                    product.spiceLevel?.toLowerCase() || 'mild',

                preparationTime:
                    Number(product.preparationTime) || 0,

                isAvailable:
                    product.isAvailable === undefined
                        ? true
                        : String(product.isAvailable).toLowerCase() === 'true',

                isFeatured:
                    String(product.isFeatured).toLowerCase() === 'true',

                isBestseller:
                    String(product.isBestseller).toLowerCase() === 'true',

                rating:
                    Number(product.rating) || 0,

                totalReviews:
                    Number(product.totalReviews) || 0,

                stock:
                    Number(product.stock) || 10
            };
        });


        // =========================
        // Validate required fields
        // =========================

        const invalidRows = [];

        productData.forEach((product, index) => {

            if (!product.name) {
                invalidRows.push({
                    row: index + 2,
                    message: 'Product name is required'
                });
            }

            if (!product.categoryId) {
                invalidRows.push({
                    row: index + 2,
                    message: 'Category ID is required'
                });
            }

            if (!product.price || product.price <= 0) {
                invalidRows.push({
                    row: index + 2,
                    message: 'Valid price is required'
                });
            }
        });


        if (invalidRows.length) {

            fs.unlinkSync(filePath);

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: invalidRows
            });
        }
        //save products to database
       await productService.saveProducts(productData);

        // Delete uploaded file
        
        fs.unlinkSync(filePath);


        return res.status(201).json({
            success: true,
            message: `${productData.length} products uploaded successfully`,
            count: productData.length,
            data: productData
        });

    } catch (error) {
        
        console.error('Upload products error:', error);

        // Remove uploaded file if exists
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProducts
};

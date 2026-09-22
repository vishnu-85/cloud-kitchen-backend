const categoryService = require('../services/category.service');

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories(req.query);

    res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await categoryService.updateCategory(id, req.body);

    res.status(201).json({
      success: true,
      message: 'Category update successfully',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const deleteCategory = async (req, res)=>{
  try {
     const id = req.params.id;
     const category = await categoryService.deleteCategoryID(id);
    res.status(200).json({
      success: true,
      data: category.name,
      message: "Category Deleted"
    })
  } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
  }
}


module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};

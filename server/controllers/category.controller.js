const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort('categoryName');

    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }

    res.json({
      success: true,
      data: {
        category
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get parent categories (kept for backwards compatibility, returns all categories)
// @route   GET /api/categories/parent
exports.getParentCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort('categoryName');

    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a new category (Admin)
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { categoryName, description, imageUrl } = req.body;

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: 'Tên danh mục không được để trống'
      });
    }

    const category = await Category.create({
      categoryName,
      description,
      imageUrl
    });

    res.status(201).json({
      success: true,
      message: 'Thêm danh mục thành công',
      data: {
        category
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update a category (Admin)
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: {
        category: updatedCategory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a category (Admin)
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }

    // Kiểm tra xem có sách nào đang dùng danh mục này không
    const Book = require('../models/Book');
    const booksCount = await Book.countDocuments({ category: req.params.id });

    if (booksCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa danh mục này vì còn ${booksCount} sách đang sử dụng`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Đã xóa danh mục thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/parent', categoryController.getParentCategories);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin routes
router.post('/', authenticateToken, authorizeAdmin, categoryController.createCategory);
router.put('/:id', authenticateToken, authorizeAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateToken, authorizeAdmin, categoryController.deleteCategory);

module.exports = router;

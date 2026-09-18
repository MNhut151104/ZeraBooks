const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public routes
router.get('/featured', bookController.getFeaturedBooks);
router.get('/bestsellers', bookController.getBestsellers);
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.get('/:id/reviews', bookController.getBookReviews);
router.get('/:id/related', bookController.getRelatedBooks);

// Protected admin routes
router.post('/', protect, adminOnly, bookController.createBook);
router.put('/:id', protect, adminOnly, bookController.updateBook);
router.post('/:id/upload', protect, adminOnly, upload.single('image'), bookController.uploadBookImage);
router.delete('/:id', protect, adminOnly, bookController.deleteBook);

module.exports = router;

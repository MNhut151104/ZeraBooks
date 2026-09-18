const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

// Validation rules
const createReviewValidation = [
  body('bookId').notEmpty().withMessage('Book ID không được để trống'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Đánh giá phải từ 1-5 sao'),
  body('comment').optional().trim()
];

// Admin routes (must be before customer routes to avoid conflicts)
router.get('/', protect, adminOnly, reviewController.getAllReviews);
router.put('/:id/approval', protect, adminOnly, reviewController.updateReviewApproval);
router.delete('/:id/admin', protect, adminOnly, reviewController.adminDeleteReview);

// Customer routes (require authentication)
router.post('/', protect, createReviewValidation, validate, reviewController.createReview);
router.get('/my-reviews', protect, reviewController.getMyReviews);
router.put('/:id', protect, reviewController.updateReview);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;

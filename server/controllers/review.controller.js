const Review = require('../models/Review');
const Book = require('../models/Book');
const Order = require('../models/Order');

// @desc    Create a review
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }

    // Check if customer has purchased this book
    const hasPurchased = await Order.findOne({
      customer: req.user.id,
      'orderDetails.book': bookId,
      orderStatus: 'Delivered'
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chỉ có thể đánh giá sách đã mua'
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      book: bookId,
      customer: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đánh giá sách này rồi'
      });
    }

    // Create review
    const review = await Review.create({
      book: bookId,
      customer: req.user.id,
      rating,
      comment,
      isApproved: true // Auto-approve all reviews
    });

    const populatedReview = await Review.findById(review._id)
      .populate('customer', 'fullName avatarUrl')
      .populate('book', 'bookTitle');

    res.status(201).json({
      success: true,
      message: 'Đánh giá đã được gửi thành công',
      review: populatedReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get customer's reviews
// @route   GET /api/reviews/my-reviews
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.user.id })
      .populate('book', 'bookTitle imageUrl')
      .sort('-reviewDate');

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }

    // Check ownership
    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền sửa đánh giá này'
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.isApproved = true; // Auto-approve updated reviews
    await review.save();

    res.json({
      success: true,
      message: 'Cập nhật đánh giá thành công',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }

    // Check ownership
    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa đánh giá này'
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Xóa đánh giá thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('customer', 'fullName email')
      .populate('book', 'bookTitle imageUrl')
      .sort('-createdAt');

    res.json({
      success: true,
      data: {
        reviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve/Reject review (Admin)
// @route   PUT /api/reviews/:id/approval
exports.updateReviewApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('customer', 'fullName email')
     .populate('book', 'bookTitle');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }

    res.json({
      success: true,
      message: isApproved ? 'Đã duyệt đánh giá' : 'Đã từ chối đánh giá',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id/admin
exports.adminDeleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Xóa đánh giá thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Sách không được để trống']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Khách hàng không được để trống']
  },
  rating: {
    type: Number,
    required: [true, 'Đánh giá không được để trống'],
    min: [1, 'Đánh giá phải từ 1-5'],
    max: [5, 'Đánh giá phải từ 1-5']
  },
  comment: {
    type: String,
    maxlength: [1000, 'Nội dung đánh giá không được vượt quá 1000 ký tự']
  },
  reviewDate: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Update book's average rating after review is saved, updated, or deleted
reviewSchema.statics.updateBookRating = async function(bookId) {
  const Product = mongoose.model('Product');
  try {
    const targetBookId = typeof bookId === 'string' ? new mongoose.Types.ObjectId(bookId) : bookId;
    const stats = await this.aggregate([
      { $match: { book: targetBookId, isApproved: true } },
      {
        $group: {
          _id: '$book',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);
    
    if (stats.length > 0) {
      await Product.findByIdAndUpdate(bookId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        reviewCount: stats[0].reviewCount
      });
    } else {
      await Product.findByIdAndUpdate(bookId, {
        averageRating: 0,
        reviewCount: 0
      });
    }
  } catch (error) {
    console.error('Error updating book rating:', error);
  }
};

reviewSchema.post('save', async function() {
  await this.constructor.updateBookRating(this.book);
});

reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await doc.constructor.updateBookRating(doc.book);
  }
});

reviewSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) {
    await doc.constructor.updateBookRating(doc.book);
  }
});

// Prevent duplicate reviews from same customer for same book
reviewSchema.index({ book: 1, customer: 1 }, { unique: true });
reviewSchema.index({ book: 1, isApproved: 1 });

module.exports = mongoose.model('Review', reviewSchema);

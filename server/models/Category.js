const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, 'Tên danh mục không được để trống'],
    maxlength: [100, 'Tên danh mục không được vượt quá 100 ký tự'],
    trim: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  imageUrl: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for books
categorySchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'category'
});

// Index for search
categorySchema.index({ categoryName: 'text' });

module.exports = mongoose.model('Category', categorySchema);


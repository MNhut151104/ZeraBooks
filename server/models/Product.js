const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    sparse: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Tên sản phẩm không được để trống'],
    maxlength: [500, 'Tên sản phẩm không được vượt quá 500 ký tự'],
    trim: true,
    alias: 'bookTitle' // Alias to maintain backwards compatibility
  },
  slug: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Giá bán không được để trống'],
    min: [0, 'Giá bán phải lớn hơn hoặc bằng 0']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Giá gốc phải lớn hơn hoặc bằng 0']
  },
  discountPercent: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Số lượng tồn kho không được để trống'],
    min: 0,
    default: 0
  },
  imageUrl: {
    type: String,
    maxlength: 200,
    default: '/images/books/default.jpg'
  },
  images: [{
    type: String,
    maxlength: 200
  }],
  description: {
    type: String,
    maxlength: 2000
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Danh mục không được để trống']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    min: 0,
    default: 0
  },
  soldQuantity: {
    type: Number,
    min: 0,
    default: 0
  },
  author: {
    type: String,
    trim: true,
    default: ''
  },
  publisher: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true,
  discriminatorKey: 'productType', // The discriminator key
  collection: 'products',          // Store all products in the 'products' collection
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'book'
});

// Virtual for category to maintain backwards compatibility with populate('category')
productSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ categoryId: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ soldQuantity: -1 });

// Pre-save middleware: Calculate discount
productSchema.pre('save', function(next) {
  if (this.originalPrice && this.price && this.originalPrice > this.price) {
    this.discountPercent = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);

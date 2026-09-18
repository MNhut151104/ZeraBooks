const mongoose = require('mongoose');
const Product = require('./Product');

const bookSchema = new mongoose.Schema({
  author: {
    type: String,
    trim: true,
    default: ''
  },
  publisher: {
    type: String,
    trim: true,
    default: ''
  },
  isbn: {
    type: String,
    maxlength: 50,
    sparse: true
  },
  publishYear: { // keep name publishYear for compatibility
    type: Number,
    min: [1900, 'Năm xuất bản không hợp lệ']
  },
  pageCount: {
    type: Number,
    min: [1, 'Số trang phải lớn hơn 0']
  },
  bookLanguage: { // keep name bookLanguage for compatibility
    type: String,
    maxlength: 100,
    default: 'Tiếng Việt'
  },
  coverType: {
    type: String,
    maxlength: 100
  },
  genre: {
    type: String,
    enum: ['Văn học', 'Kinh tế', 'Kỹ năng sống', 'Thiếu nhi', 'Khoa học', 'Tâm lý'],
    trim: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes specific to Book
bookSchema.index({ author: 1 });

// Define discriminator
const Book = Product.discriminator('Book', bookSchema);

module.exports = Book;

const Book = require('../models/Book');
const Product = require('../models/Product');
const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { PAGINATION } = require('../utils/constants');

const buildBookQuery = (queryParams) => {
  const { category, author, publisher, minPrice, maxPrice, search, featured, showAll, genre } = queryParams;
  const query = {};
  
  // Filter active books unless admin requests all
  if (showAll !== 'true') {
    query.isActive = true;
  }
  
  if (category) query.categoryId = category; // Map category query param to categoryId field
  if (author) query.author = { $regex: author, $options: 'i' };
  if (publisher) query.publisher = { $regex: publisher, $options: 'i' };
  if (featured) query.isFeatured = true;
  if (genre) query.genre = genre;
  
  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  
  // Text search
  if (search) {
    query.$text = { $search: search };
  }
  
  return query;
};

// @desc    Get all books with filters
// @route   GET /api/books
exports.getBooks = asyncHandler(async (req, res) => {
  const { 
    page = PAGINATION.DEFAULT_PAGE, 
    limit, 
    sort = '-createdAt'
  } = req.query;

  const query = buildBookQuery(req.query);
  const pageNum = Number(page);
  const limitNum = req.query.showAll === 'true' && !limit ? 10000 : Number(limit || PAGINATION.DEFAULT_LIMIT);

  console.log('📚 Product Query Debug:');
  console.log('  - Query:', JSON.stringify(query));
  console.log('  - ShowAll:', req.query.showAll);

  // Execute query with pagination
  const [books, count] = await Promise.all([
    Product.find(query)
      .populate('category', 'categoryName')
      .sort(sort)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum),
    Product.countDocuments(query)
  ]);

  console.log('  - Products Found:', books.length);
  console.log('  - Total Count:', count);

  ResponseHandler.success(res, {
    books,
    pagination: {
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      total: count,
      limit: limitNum
    }
  });
});

// @desc    Get single book by ID
// @route   GET /api/books/:id
exports.getBookById = asyncHandler(async (req, res) => {
  const book = await Product.findById(req.params.id)
    .populate('category');

  if (!book || !book.isActive) {
    return ResponseHandler.notFound(res, 'Không tìm thấy sản phẩm');
  }

  ResponseHandler.success(res, { book });
});

// @desc    Get book reviews
// @route   GET /api/books/:id/reviews
exports.getBookReviews = asyncHandler(async (req, res) => {
  const { page = PAGINATION.DEFAULT_PAGE, limit = 10 } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);

  const query = { book: req.params.id, isApproved: true };

  const [reviews, count] = await Promise.all([
    Review.find(query)
      .populate('customer', 'fullName avatarUrl')
      .sort('-reviewDate')
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum),
    Review.countDocuments(query)
  ]);

  ResponseHandler.success(res, {
    reviews,
    pagination: {
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      total: count
    }
  });
});

// @desc    Get featured books
// @route   GET /api/books/featured
exports.getFeaturedBooks = asyncHandler(async (req, res) => {
  const books = await Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'categoryName')
    .limit(10)
    .sort('-createdAt');

  ResponseHandler.success(res, { books });
});

// @desc    Get bestseller books
// @route   GET /api/books/bestsellers
exports.getBestsellers = asyncHandler(async (req, res) => {
  const books = await Product.find({ isActive: true })
    .populate('category', 'categoryName')
    .sort('-soldQuantity')
    .limit(10);

  ResponseHandler.success(res, { books });
});

// @desc    Get related books
// @route   GET /api/books/:id/related
exports.getRelatedBooks = asyncHandler(async (req, res) => {
  const book = await Product.findById(req.params.id);
  
  if (!book) {
    return ResponseHandler.notFound(res, 'Không tìm thấy sản phẩm');
  }

  const relatedBooks = await Product.find({
    isActive: true,
    _id: { $ne: book._id },
    $or: [
      { categoryId: book.categoryId },
      ...(book.author ? [{ author: book.author }] : [])
    ]
  })
    .populate('category', 'categoryName')
    .limit(8);

  ResponseHandler.success(res, { books: relatedBooks });
});

// @desc    Create a new book (Admin)
// @route   POST /api/books
exports.createBook = asyncHandler(async (req, res) => {
  // If productType is not provided, default to Book
  if (!req.body.productType) {
    req.body.productType = 'Book';
  }
  const book = await Product.create(req.body);
  
  const populatedBook = await Product.findById(book._id)
    .populate('category', 'categoryName');

  ResponseHandler.created(res, { book: populatedBook }, 'Thêm sản phẩm thành công');
});

// @desc    Update a book (Admin)
// @route   PUT /api/books/:id
exports.updateBook = asyncHandler(async (req, res) => {
  const book = await Product.findById(req.params.id);
  
  if (!book) {
    return ResponseHandler.notFound(res, 'Không tìm thấy sản phẩm');
  }

  const validateFields = !req.body.isActive || Object.keys(req.body).length > 1;

  const updatedBook = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { 
      new: true, 
      runValidators: validateFields,
      context: 'query'
    }
  )
    .populate('category', 'categoryName');

  ResponseHandler.success(res, { book: updatedBook }, 'Cập nhật sản phẩm thành công');
});

// @desc    Upload book image (Admin)
// @route   POST /api/books/:id/upload
exports.uploadBookImage = asyncHandler(async (req, res) => {
  const book = await Product.findById(req.params.id);
  
  if (!book) {
    return ResponseHandler.notFound(res, 'Không tìm thấy sản phẩm');
  }

  if (!req.file) {
    return ResponseHandler.badRequest(res, 'Vui lòng chọn file ảnh');
  }

  const imageUrl = `/images/books/${req.file.filename}`;
  book.imageUrl = imageUrl;
  await book.save();

  ResponseHandler.success(res, { imageUrl }, 'Upload ảnh thành công');
});

// @desc    Delete a book (Admin)
// @route   DELETE /api/books/:id
exports.deleteBook = asyncHandler(async (req, res) => {
  const book = await Product.findById(req.params.id);
  
  if (!book) {
    return ResponseHandler.notFound(res, 'Không tìm thấy sản phẩm');
  }

  // Soft delete - set isActive to false
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });

  ResponseHandler.success(res, null, 'Xóa sản phẩm thành công');
});

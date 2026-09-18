const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Load models (important for populate to work)
require('./models/Category');
require('./models/Book');
require('./models/Customer');
require('./models/Admin');
require('./models/Order');
require('./models/Review');
require('./models/Banner');

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files (images)
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Zera Books API',
    version: '1.0.0',
    status: 'running'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/customers', require('./routes/customer.routes'));
app.use('/api/banners', require('./routes/banner.routes'));

// 404 handler - must be before error handler
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.statusCode = 404;
  next(error);
});

// Global error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

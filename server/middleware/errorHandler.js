const ResponseHandler = require('../utils/responseHandler');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return ResponseHandler.validationError(res, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return ResponseHandler.badRequest(res, `${field} đã tồn tại`);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return ResponseHandler.badRequest(res, 'ID không hợp lệ');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ResponseHandler.unauthorized(res, 'Token không hợp lệ');
  }

  if (err.name === 'TokenExpiredError') {
    return ResponseHandler.unauthorized(res, 'Token đã hết hạn');
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi server';

  return ResponseHandler.error(res, message, statusCode);
};

module.exports = errorHandler;

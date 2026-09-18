const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để tiếp tục'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    if (decoded.type === 'customer') {
      req.user = await Customer.findById(decoded.id);
      req.userType = 'customer';
    } else if (decoded.type === 'admin') {
      req.user = await Admin.findById(decoded.id);
      req.userType = 'admin';
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    // Check if user is active
    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị khóa'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

// Admin only middleware
exports.adminOnly = (req, res, next) => {
  if (req.userType !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ admin mới có quyền truy cập'
    });
  }
  next();
};

// SuperAdmin only middleware
exports.superAdminOnly = (req, res, next) => {
  if (req.userType !== 'admin' || req.user.role !== 'SuperAdmin') {
    return res.status(403).json({
      success: false,
      message: 'Chỉ SuperAdmin mới có quyền truy cập'
    });
  }
  next();
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, just continue without user
    if (!token) {
      req.user = null;
      req.userType = 'guest';
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    if (decoded.type === 'customer') {
      req.user = await Customer.findById(decoded.id);
      req.userType = 'customer';
    } else if (decoded.type === 'admin') {
      req.user = await Admin.findById(decoded.id);
      req.userType = 'admin';
    }

    // Check if user exists and is active
    if (req.user && !req.user.isActive) {
      req.user = null;
      req.userType = 'guest';
    }

    next();
  } catch (error) {
    // If token is invalid, just treat as guest
    req.user = null;
    req.userType = 'guest';
    next();
  }
};

// Alias for protect (for consistency with other code)
exports.authenticateToken = exports.protect;

// Alias for adminOnly (for consistency with other code)
exports.authorizeAdmin = exports.adminOnly;

// Optional authentication - doesn't require token (for guest checkout)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, continue as guest
    if (!token) {
      req.user = null;
      req.userType = 'guest';
      return next();
    }

    // Verify token if exists
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      if (decoded.type === 'customer') {
        req.user = await Customer.findById(decoded.id);
        req.userType = 'customer';
      } else if (decoded.type === 'admin') {
        req.user = await Admin.findById(decoded.id);
        req.userType = 'admin';
      }

      // Check if user is active
      if (req.user && !req.user.isActive) {
        req.user = null;
        req.userType = 'guest';
      }
    } catch (error) {
      // Invalid token - continue as guest
      req.user = null;
      req.userType = 'guest';
    }

    next();
  } catch (error) {
    next(error);
  }
};

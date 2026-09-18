const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { JWT } = require('../utils/constants');

// Helper: Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || JWT.DEFAULT_EXPIRE }
  );
};

// Helper: Format user response
const formatUserResponse = (user, type) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  avatarUrl: user.avatarUrl,
  ...(type === 'admin' && { role: user.role }),
  type
});

// @desc    Register new customer
// @route   POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, city, district, address } = req.body;

  // Check if customer exists
  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    return ResponseHandler.badRequest(res, 'Email đã được sử dụng');
  }

  // Create customer
  const customer = await Customer.create({
    fullName,
    email,
    password,
    phone,
    city,
    district,
    address
  });

  const token = generateToken({ id: customer._id, type: 'customer' });

  ResponseHandler.created(res, {
    token,
    customer: formatUserResponse(customer, 'customer')
  }, 'Đăng ký thành công');
});

// @desc    Login customer or admin
// @route   POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return ResponseHandler.badRequest(res, 'Vui lòng nhập tài khoản và mật khẩu');
  }

  const accountInput = String(email).trim();

  // Try admin first (by email or username)
  let admin = await Admin.findOne({
    $or: [{ email: accountInput }, { username: accountInput }]
  }).select('+password');
  
  if (admin) {
    if (!admin.isActive) {
      return ResponseHandler.unauthorized(res, 'Tài khoản đã bị khóa');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return ResponseHandler.unauthorized(res, 'Tài khoản hoặc mật khẩu không chính xác');
    }

    admin.lastLoginDate = Date.now();
    await admin.save();

    const token = generateToken({ id: admin._id, type: 'admin', role: admin.role });

    return ResponseHandler.success(res, {
      token,
      customer: formatUserResponse(admin, 'admin')
    }, 'Đăng nhập thành công');
  }

  // Try customer (by email or phone)
  const customer = await Customer.findOne({
    $or: [{ email: accountInput }, { phone: accountInput }]
  }).select('+password');
  
  if (!customer) {
    return ResponseHandler.unauthorized(res, 'Tài khoản hoặc mật khẩu không chính xác');
  }

  if (!customer.isActive) {
    return ResponseHandler.unauthorized(res, 'Tài khoản đã bị khóa');
  }

  const isMatch = await customer.comparePassword(password);
  if (!isMatch) {
    return ResponseHandler.unauthorized(res, 'Tài khoản hoặc mật khẩu không chính xác');
  }

  customer.lastLoginDate = Date.now();
  await customer.save();

  const token = generateToken({ id: customer._id, type: 'customer' });

  ResponseHandler.success(res, {
    token,
    customer: formatUserResponse(customer, 'customer')
  }, 'Đăng nhập thành công');
});

// @desc    Get current customer profile
// @route   GET /api/auth/profile
exports.getProfile = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.user.id);
  
  if (!customer) {
    return ResponseHandler.notFound(res, 'Không tìm thấy thông tin khách hàng');
  }

  ResponseHandler.success(res, { customer });
});

// @desc    Update customer profile
// @route   PUT /api/auth/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, address, city, district, dateOfBirth, gender } = req.body;

  const customer = await Customer.findByIdAndUpdate(
    req.user.id,
    { fullName, phone, address, city, district, dateOfBirth, gender },
    { new: true, runValidators: true }
  );

  ResponseHandler.success(res, { customer }, 'Cập nhật thông tin thành công');
});

// @desc    Change password
// @route   PUT /api/auth/change-password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const customer = await Customer.findById(req.user.id).select('+password');
  
  const isMatch = await customer.comparePassword(currentPassword);
  if (!isMatch) {
    return ResponseHandler.unauthorized(res, 'Mật khẩu hiện tại không chính xác');
  }

  customer.password = newPassword;
  await customer.save();

  ResponseHandler.success(res, null, 'Đổi mật khẩu thành công');
});

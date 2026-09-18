const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Họ tên không được để trống'],
    maxlength: [200, 'Họ tên không được vượt quá 200 ký tự'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email không được để trống'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 100,
    match: [/^\S+@\S+\.\S+$/, 'Email không đúng định dạng']
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu không được để trống'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    select: false // Không trả về password khi query
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại không được để trống'],
    maxlength: 20,
    match: [/^0[35789][0-9]{8}$/, 'Số điện thoại không đúng định dạng Việt Nam (VD: 0901234567)']
  },
  address: {
    type: String,
    maxlength: 500
  },
  city: {
    type: String,
    required: [true, 'Vui lòng chọn tỉnh/thành phố'],
    maxlength: 100
  },
  district: {
    type: String,
    required: [true, 'Vui lòng chọn quận/huyện'],
    maxlength: 100
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['Nam', 'Nữ', 'Khác'],
    maxlength: 10
  },
  avatarUrl: {
    type: String,
    maxlength: 200
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registerDate: {
    type: Date,
    default: Date.now
  },
  lastLoginDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for orders
customerSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'customer'
});

// Virtual for reviews
customerSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'customer'
});

// Hash password before saving
customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
customerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index for search
customerSchema.index({ phone: 1 });

module.exports = mongoose.model('Customer', customerSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Tên đăng nhập không được để trống'],
    unique: true,
    maxlength: 50,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Mật khẩu không được để trống'],
    minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
    select: false
  },
  fullName: {
    type: String,
    required: [true, 'Họ tên không được để trống'],
    maxlength: 200,
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
  phone: {
    type: String,
    maxlength: 20,
    match: [/^0[35789][0-9]{8}$/, 'Số điện thoại không đúng định dạng']
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'SuperAdmin', 'Manager'],
    default: 'Admin'
  },
  avatarUrl: {
    type: String,
    maxlength: 200
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  lastLoginDate: {
    type: Date
  },
  createdBy: {
    type: String,
    maxlength: 50
  }
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
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
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);

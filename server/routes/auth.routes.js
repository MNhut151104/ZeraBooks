const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

// Validation rules
const registerValidation = [
  body('fullName').trim().notEmpty().withMessage('Họ tên không được để trống'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('phone').matches(/^0[35789][0-9]{8}$/).withMessage('Số điện thoại không hợp lệ'),
  body('city').trim().notEmpty().withMessage('Vui lòng chọn tỉnh/thành phố'),
  body('district').trim().notEmpty().withMessage('Vui lòng chọn quận/huyện')
];

const loginValidation = [
  body('email').notEmpty().withMessage('Tài khoản không được để trống'),
  body('password').notEmpty().withMessage('Mật khẩu không được để trống')
];

// Routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);

module.exports = router;

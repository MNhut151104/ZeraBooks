const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/order.controller');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

// Validation rules
const createOrderValidation = [
  body('shippingName').trim().notEmpty().withMessage('Họ tên người nhận không được để trống'),
  body('shippingAddress').trim().notEmpty().withMessage('Địa chỉ giao hàng không được để trống'),
  body('shippingPhone').matches(/^0[35789][0-9]{8}$/).withMessage('Số điện thoại không hợp lệ'),
  body('shippingCity').trim().notEmpty().withMessage('Vui lòng chọn tỉnh/thành phố'),
  body('shippingDistrict').trim().notEmpty().withMessage('Vui lòng chọn quận/huyện'),
  body('paymentMethod').trim().notEmpty().withMessage('Vui lòng chọn phương thức thanh toán'),
  body('orderDetails').isArray({ min: 1 }).withMessage('Đơn hàng phải có ít nhất một sản phẩm')
];

// Public routes (không cần đăng nhập, nhưng có thể dùng token nếu có)
router.post('/', optionalAuth, createOrderValidation, validate, orderController.createOrder);
router.post('/track', orderController.trackOrder);

// Protected routes (cần đăng nhập)
router.get('/', protect, orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/cancel', protect, orderController.cancelOrder);
router.post('/:id/return-request', protect, orderController.requestReturn);

// Admin only routes
router.put('/:id/status', protect, adminOnly, orderController.updateOrderStatus);
router.put('/:id/process-return', protect, adminOnly, orderController.processReturn);

module.exports = router;

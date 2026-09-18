const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const ResponseHandler = require('../utils/responseHandler');

// @desc    Get all customers (Admin only)
// @route   GET /api/customers
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const customers = await Customer.find()
      .select('-password')
      .sort({ createdDate: -1 });

    console.log('📋 Customers Query Debug:');
    console.log('  - Customers Found:', customers.length);

    return ResponseHandler.success(res, {
      customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return ResponseHandler.error(res, error.message, 500);
  }
});

// @desc    Get single customer
// @route   GET /api/customers/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select('-password');

    if (!customer) {
      return ResponseHandler.notFound(res, 'Không tìm thấy khách hàng');
    }

    return ResponseHandler.success(res, { customer });
  } catch (error) {
    return ResponseHandler.error(res, error.message, 500);
  }
});

// @desc    Update customer status
// @route   PUT /api/customers/:id/status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khách hàng'
      });
    }

    customer.isActive = req.body.isActive;
    await customer.save();

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

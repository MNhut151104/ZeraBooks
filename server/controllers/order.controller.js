const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const asyncHandler = require('../utils/asyncHandler');
const ResponseHandler = require('../utils/responseHandler');
const { SHIPPING, ORDER_STATUS } = require('../utils/constants');

// Helper: Verify product stock and update prices
const verifyAndUpdateOrderItems = async (orderDetails) => {
  for (let item of orderDetails) {
    const product = await Product.findById(item.book);
    
    if (!product || !product.isActive) {
      throw new Error('Sản phẩm không tồn tại hoặc đã ngừng bán');
    }

    if (product.stockQuantity < item.quantity) {
      const title = product.bookTitle || product.name || 'Sản phẩm';
      throw new Error(`Sản phẩm "${title}" chỉ còn ${product.stockQuantity} sản phẩm`);
    }

    item.unitPrice = product.price;
    item.discountPercent = product.discountPercent || 0;
  }
};

// Helper: Update product stock
const updateBookStock = async (orderDetails, isIncrement = false) => {
  const multiplier = isIncrement ? 1 : -1;
  
  for (let item of orderDetails) {
    await Product.findByIdAndUpdate(item.book, {
      $inc: {
        stockQuantity: item.quantity * multiplier,
        soldQuantity: item.quantity * (multiplier * -1)
      }
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const {
    shippingName,
    shippingAddress,
    shippingPhone,
    shippingCity,
    shippingDistrict,
    paymentMethod,
    notes,
    orderDetails
  } = req.body;

  if (!orderDetails || orderDetails.length === 0) {
    return ResponseHandler.badRequest(res, 'Đơn hàng phải có ít nhất một sản phẩm');
  }

  // Verify stock and prices
  await verifyAndUpdateOrderItems(orderDetails);

  // Create order (customer is optional - allow guest checkout)
  const orderData = {
    shippingName,
    shippingAddress,
    shippingPhone,
    shippingCity,
    shippingDistrict,
    paymentMethod,
    notes,
    orderDetails,
    shippingFee: SHIPPING.DEFAULT_FEE
  };

  // Check if user is logged in
  if (req.user && req.user.id) {
    orderData.customer = req.user.id;
  } else {
    // Guest checkout - check if phone number matches any existing customer
    const existingCustomer = await Customer.findOne({ phone: shippingPhone, isActive: true });
    
    if (existingCustomer) {
      // Merge order into existing customer account
      orderData.customer = existingCustomer._id;
      console.log(`Guest order merged into customer account: ${existingCustomer.email}`);
    }
  }

  const order = await Order.create(orderData);

  // Update stock
  await updateBookStock(orderDetails);

  const populatedOrder = await Order.findById(order._id)
    .populate('customer', 'fullName email phone')
    .populate({ path: 'orderDetails.book', populate: { path: 'categoryId' } });

  ResponseHandler.created(res, { order: populatedOrder }, 'Đặt hàng thành công');
});

// @desc    Get customer orders (or all orders for admin)
// @route   GET /api/orders
exports.getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  
  const query = req.userType === 'admin' ? {} : { customer: req.user.id };
  if (status) query.orderStatus = status;

  console.log('🔍 Order Query Debug:');
  console.log('  - User Type:', req.userType);
  console.log('  - Query:', JSON.stringify(query));
  console.log('  - User ID:', req.user?.id);

  const [orders, count] = await Promise.all([
    Order.find(query)
      .populate('customer', 'fullName email phone')
      .populate({ path: 'orderDetails.book', populate: { path: 'categoryId' } })
      .sort('-orderDate')
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum),
    Order.countDocuments(query)
  ]);

  console.log('  - Orders Found:', orders.length);
  console.log('  - Total Count:', count);

  ResponseHandler.success(res, {
    orders,
    pagination: {
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      total: count
    }
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'fullName email phone')
    .populate({ path: 'orderDetails.book', populate: { path: 'categoryId' } })
    .populate('statusLog.updatedBy', 'fullName email');

  if (!order) {
    return ResponseHandler.notFound(res, 'Không tìm thấy đơn hàng');
  }

  // Check permissions
  if (req.userType !== 'admin') {
    // If order has customer, must match logged in user
    if (order.customer && order.customer._id.toString() !== req.user.id) {
      return ResponseHandler.forbidden(res, 'Bạn không có quyền xem đơn hàng này');
    }
    // If order is guest order, cannot view (no auth mechanism for guests)
    if (!order.customer) {
      return ResponseHandler.forbidden(res, 'Không thể xem đơn hàng khách vãng lai');
    }
  }

  ResponseHandler.success(res, { order });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return ResponseHandler.notFound(res, 'Không tìm thấy đơn hàng');
  }

  // Check ownership: only customer who placed the order can cancel
  // If order has customer, must match logged in user
  // If order is guest order, cannot be cancelled (no auth)
  if (!req.user || !req.user.id) {
    return ResponseHandler.unauthorized(res, 'Vui lòng đăng nhập để hủy đơn hàng');
  }

  if (order.customer && order.customer.toString() !== req.user.id) {
    return ResponseHandler.forbidden(res, 'Bạn không có quyền hủy đơn hàng này');
  }

  if (!order.customer) {
    return ResponseHandler.badRequest(res, 'Không thể hủy đơn hàng khách vãng lai. Vui lòng liên hệ admin.');
  }

  if (!['Pending', 'Processing'].includes(order.orderStatus)) {
    return ResponseHandler.badRequest(res, 'Không thể hủy đơn hàng ở trạng thái này');
  }

  // Restore stock
  await updateBookStock(order.orderDetails, true);

  order.orderStatus = 'Cancelled';
  await order.save();

  ResponseHandler.success(res, { order }, 'Hủy đơn hàng thành công');
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, reason, previousStatus } = req.body;
  
  const validStatuses = ['Pending', 'Processing', 'AwaitingShipment', 'Shipping', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return ResponseHandler.badRequest(res, 'Trạng thái không hợp lệ');
  }

  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return ResponseHandler.notFound(res, 'Không tìm thấy đơn hàng');
  }

  // If cancelling, restore stock
  if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
    await updateBookStock(order.orderDetails, true);
  }

  // If marking as paid
  if (status === 'Delivered' && !order.isPaid) {
    order.isPaid = true;
    order.paymentDate = Date.now();
  }

  // Add status log entry
  if (!order.statusLog) {
    order.statusLog = [];
  }
  
  order.statusLog.push({
    status,
    previousStatus: previousStatus || order.orderStatus,
    reason: reason || null,
    timestamp: new Date(),
    updatedBy: req.user.id,
    updatedByModel: req.userType === 'admin' ? 'Admin' : 'Customer'
  });

  order.orderStatus = status;
  
  if (status === 'Delivered') {
    order.deliveryDate = Date.now();
  }
  
  await order.save();

  const populatedOrder = await Order.findById(order._id)
    .populate('customer', 'fullName email')
    .populate('orderDetails.book', 'bookTitle imageUrl')
    .populate('statusLog.updatedBy', 'fullName email');

  ResponseHandler.success(res, { order: populatedOrder }, 'Cập nhật trạng thái thành công');
});

// @desc    Track order by order ID and phone (for guests)
// @route   POST /api/orders/track
exports.trackOrder = asyncHandler(async (req, res) => {
  const { orderId, phone } = req.body;

  if (!orderId || !phone) {
    return ResponseHandler.badRequest(res, 'Vui lòng nhập mã đơn hàng và số điện thoại');
  }

  // Clean phone and orderId (strip leading '#', whitespace)
  const cleanPhone = phone.toString().trim();
  const cleanOrderId = orderId.toString().replace(/^#/, '').trim();

  // Validate phone format
  if (!/^0[35789][0-9]{8}$/.test(cleanPhone)) {
    return ResponseHandler.badRequest(res, 'Số điện thoại không hợp lệ');
  }

  // Find order by orderNumber or _id and phone
  let query = { shippingPhone: cleanPhone };
  
  // Check if cleanOrderId is MongoDB ObjectId or orderNumber
  if (/^[0-9a-fA-F]{24}$/.test(cleanOrderId)) {
    query.$or = [
      { _id: cleanOrderId },
      { orderNumber: cleanOrderId }
    ];
  } else {
    query.orderNumber = cleanOrderId;
  }

  const order = await Order.findOne(query)
    .populate('customer', 'fullName email phone')
    .populate({
      path: 'orderDetails.book',
      populate: { path: 'categoryId' }
    })
    .populate('statusLog.updatedBy', 'fullName');

  if (!order) {
    return ResponseHandler.notFound(res, 'Không tìm thấy đơn hàng với thông tin này');
  }

  ResponseHandler.success(res, { order });
});

// @desc    Request return/refund for an order
// @route   POST /api/orders/:id/return-request
exports.requestReturn = asyncHandler(async (req, res) => {
  const { reason, bankAccount } = req.body;

  if (!reason || reason.trim().length === 0) {
    return ResponseHandler.badRequest(res, 'Vui lòng nhập lý do hoàn hàng');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return ResponseHandler.notFound(res, 'Không tìm thấy đơn hàng');
  }

  // Check ownership
  if (!req.user || !req.user.id) {
    return ResponseHandler.unauthorized(res, 'Vui lòng đăng nhập để yêu cầu hoàn hàng');
  }

  if (order.customer && order.customer.toString() !== req.user.id) {
    return ResponseHandler.forbidden(res, 'Bạn không có quyền yêu cầu hoàn hàng cho đơn hàng này');
  }

  if (!order.customer) {
    return ResponseHandler.badRequest(res, 'Không thể yêu cầu hoàn hàng cho đơn hàng khách vãng lai');
  }

  // Only delivered orders can be returned
  if (order.orderStatus !== 'Delivered') {
    return ResponseHandler.badRequest(res, 'Chỉ có thể yêu cầu hoàn hàng cho đơn đã giao');
  }

  // Check if already requested
  if (order.returnRequest && order.returnRequest.isRequested) {
    return ResponseHandler.badRequest(res, 'Đơn hàng này đã có yêu cầu hoàn hàng');
  }

  // Check delivery date (within 7 days)
  if (order.deliveryDate) {
    const daysSinceDelivery = Math.floor((Date.now() - order.deliveryDate) / (1000 * 60 * 60 * 24));
    if (daysSinceDelivery > 7) {
      return ResponseHandler.badRequest(res, 'Chỉ có thể yêu cầu hoàn hàng trong vòng 7 ngày sau khi nhận hàng');
    }
  }

  // Create return request
  order.returnRequest = {
    isRequested: true,
    requestDate: Date.now(),
    reason: reason.trim(),
    status: 'Pending'
  };

  // Save bank account if provided
  if (bankAccount && bankAccount.accountNumber) {
    order.refundInfo = order.refundInfo || {};
    order.refundInfo.bankAccount = {
      accountNumber: bankAccount.accountNumber,
      accountName: bankAccount.accountName,
      bankName: bankAccount.bankName
    };
  }

  order.orderStatus = 'ReturnRequested';
  await order.save();

  const populatedOrder = await Order.findById(order._id)
    .populate('customer', 'fullName email phone')
    .populate('orderDetails.book', 'bookTitle imageUrl');

  ResponseHandler.success(res, { order: populatedOrder }, 'Yêu cầu hoàn hàng đã được gửi');
});

// @desc    Process return request (Admin only)
// @route   PUT /api/orders/:id/process-return
exports.processReturn = asyncHandler(async (req, res) => {
  const { status, adminNote, refundAmount, refundMethod } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return ResponseHandler.badRequest(res, 'Trạng thái không hợp lệ');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return ResponseHandler.notFound(res, 'Không tìm thấy đơn hàng');
  }

  if (!order.returnRequest || !order.returnRequest.isRequested) {
    return ResponseHandler.badRequest(res, 'Đơn hàng này chưa có yêu cầu hoàn hàng');
  }

  if (order.returnRequest.status !== 'Pending') {
    return ResponseHandler.badRequest(res, 'Yêu cầu hoàn hàng đã được xử lý');
  }

  // Update return request
  order.returnRequest.status = status;
  order.returnRequest.adminNote = adminNote || '';
  order.returnRequest.processedBy = req.user.id;
  order.returnRequest.processedDate = Date.now();

  if (status === 'Approved') {
    // Restore stock
    await updateBookStock(order.orderDetails, true);

    // Update refund info
    order.refundInfo = order.refundInfo || {};
    order.refundInfo.isRefunded = true;
    order.refundInfo.refundAmount = refundAmount || order.totalAmount;
    order.refundInfo.refundMethod = refundMethod || 'Original Payment Method';
    order.refundInfo.refundDate = Date.now();

    // Update order status
    order.orderStatus = 'Returned';

    // Add to status log
    if (!order.statusLog) {
      order.statusLog = [];
    }
    order.statusLog.push({
      status: 'Returned',
      previousStatus: 'ReturnRequested',
      reason: `Hoàn hàng được chấp nhận: ${adminNote || 'Không có ghi chú'}`,
      timestamp: new Date(),
      updatedBy: req.user.id,
      updatedByModel: 'Admin'
    });
  } else {
    // Rejected - restore to Delivered
    order.orderStatus = 'Delivered';

    // Add to status log
    if (!order.statusLog) {
      order.statusLog = [];
    }
    order.statusLog.push({
      status: 'Delivered',
      previousStatus: 'ReturnRequested',
      reason: `Yêu cầu hoàn hàng bị từ chối: ${adminNote || 'Không có ghi chú'}`,
      timestamp: new Date(),
      updatedBy: req.user.id,
      updatedByModel: 'Admin'
    });
  }

  await order.save();

  const populatedOrder = await Order.findById(order._id)
    .populate('customer', 'fullName email')
    .populate('orderDetails.book', 'bookTitle imageUrl')
    .populate('returnRequest.processedBy', 'fullName email')
    .populate('statusLog.updatedBy', 'fullName email');

  ResponseHandler.success(res, { order: populatedOrder }, 
    status === 'Approved' ? 'Đã chấp nhận hoàn hàng' : 'Đã từ chối hoàn hàng');
});

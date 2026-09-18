const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Số lượng không được để trống'],
    min: [1, 'Số lượng phải lớn hơn 0'],
    max: [1000, 'Số lượng không được vượt quá 1000']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Đơn giá không được để trống'],
    min: [0, 'Đơn giá phải lớn hơn 0']
  },
  discountPercent: {
    type: Number,
    min: [0, 'Giảm giá phải từ 0-100%'],
    max: [100, 'Giảm giá phải từ 0-100%'],
    default: 0
  },
  totalPrice: {
    type: Number,
    min: 0,
    default: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false  // Cho phép đặt hàng không cần đăng nhập
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  shippingName: {
    type: String,
    required: [true, 'Họ tên người nhận không được để trống'],
    maxlength: 200,
    trim: true
  },
  shippingAddress: {
    type: String,
    required: [true, 'Địa chỉ giao hàng không được để trống'],
    maxlength: 500
  },
  shippingPhone: {
    type: String,
    required: [true, 'Số điện thoại không được để trống'],
    maxlength: 20,
    match: [/^0[35789][0-9]{8}$/, 'Số điện thoại không đúng định dạng']
  },
  shippingCity: {
    type: String,
    required: [true, 'Thành phố không được để trống'],
    maxlength: 100
  },
  shippingDistrict: {
    type: String,
    required: [true, 'Quận/Huyện không được để trống'],
    maxlength: 100
  },
  subTotal: {
    type: Number,
    min: 0,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 30000,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  paymentMethod: {
    type: String,
    required: [true, 'Phương thức thanh toán không được để trống'],
    enum: ['COD', 'BANK', 'CARD', 'MOMO', 'ZALOPAY'],
    default: 'COD'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentDate: {
    type: Date
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'AwaitingShipment', 'Shipping', 'Delivered', 'Cancelled', 'ReturnRequested', 'Returned'],
    default: 'Pending'
  },
  notes: {
    type: String,
    maxlength: 500
  },
  deliveryDate: {
    type: Date
  },
  // Return/Refund fields
  returnRequest: {
    isRequested: {
      type: Boolean,
      default: false
    },
    requestDate: {
      type: Date
    },
    reason: {
      type: String,
      maxlength: 1000
    },
    images: [{
      type: String
    }],
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    adminNote: {
      type: String,
      maxlength: 500
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    processedDate: {
      type: Date
    }
  },
  refundInfo: {
    isRefunded: {
      type: Boolean,
      default: false
    },
    refundAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    refundMethod: {
      type: String,
      enum: ['Bank Transfer', 'Cash', 'Original Payment Method'],
      default: 'Original Payment Method'
    },
    refundDate: {
      type: Date
    },
    bankAccount: {
      accountNumber: String,
      accountName: String,
      bankName: String
    }
  },
  statusLog: [{
    status: {
      type: String,
      required: true
    },
    previousStatus: {
      type: String
    },
    reason: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'updatedByModel'
    },
    updatedByModel: {
      type: String,
      enum: ['Admin', 'Customer']
    }
  }],
  orderDetails: [orderDetailSchema]
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  // Generate orderNumber if not exists
  if (!this.orderNumber && this.isNew) {
    // Format: YYMMDD + HHMMSSms + 4 random digits
    const date = new Date();
    const yy = date.getFullYear().toString().slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    const timePart = `${hh}${min}${ss}${ms}`;
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `${yy}${mm}${dd}${timePart}${random}`;
  }

  // Calculate subTotal from orderDetails
  if (this.orderDetails && this.orderDetails.length > 0) {
    this.subTotal = this.orderDetails.reduce((sum, item) => {
      // Calculate item total price
      item.totalPrice = item.unitPrice * item.quantity;
      if (item.discountPercent > 0) {
        item.totalPrice = item.totalPrice * (1 - item.discountPercent / 100);
      }
      return sum + item.totalPrice;
    }, 0);
    
    // Calculate total amount
    this.totalAmount = this.subTotal + this.shippingFee - this.discountAmount;
  }
  next();
});

// Indexes
orderSchema.index({ customer: 1, orderDate: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ orderDate: -1 });

module.exports = mongoose.model('Order', orderSchema);

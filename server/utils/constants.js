/**
 * Application-wide constants
 */

// Order Status
const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPING: 'Shipping',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

// Payment Methods
const PAYMENT_METHODS = {
  COD: 'COD',
  BANK_TRANSFER: 'BankTransfer',
  MOMO: 'MoMo',
  VNPAY: 'VNPay'
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100
};

// Price Limits
const PRICE = {
  MIN: 0,
  MAX: 999999999
};

// Book Limits
const BOOK = {
  MIN_YEAR: 1900,
  MAX_YEAR: new Date().getFullYear(),
  MIN_PAGES: 1,
  MAX_PAGES: 10000,
  MAX_TITLE_LENGTH: 500,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_STOCK: 999999
};

// Discount
const DISCOUNT = {
  MIN: 0,
  MAX: 100
};

// Rating
const RATING = {
  MIN: 0,
  MAX: 5
};

// Shipping
const SHIPPING = {
  DEFAULT_FEE: 30000
};

// JWT
const JWT = {
  DEFAULT_EXPIRE: '7d'
};

module.exports = {
  ORDER_STATUS,
  PAYMENT_METHODS,
  PAGINATION,
  PRICE,
  BOOK,
  DISCOUNT,
  RATING,
  SHIPPING,
  JWT
};

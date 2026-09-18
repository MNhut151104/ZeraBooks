const mongoose = require('mongoose');
const Product = require('./Product');

const giftWrapSchema = new mongoose.Schema({
  brand: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },
  material: {
    type: String, // ví dụ: giấy bóng, hộp carton, ruy băng vải...
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  dimensions: {
    type: String, // ví dụ: 50x70cm, 20x20x10cm...
    trim: true
  }
});

const GiftWrap = Product.discriminator('GiftWrap', giftWrapSchema);

module.exports = GiftWrap;

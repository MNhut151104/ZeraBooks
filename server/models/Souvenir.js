const mongoose = require('mongoose');
const Product = require('./Product');

const souvenirSchema = new mongoose.Schema({
  brand: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },
  type: {
    type: String, // ví dụ: quả cầu tuyết, tượng gỗ, móc khóa anime...
    trim: true
  },
  material: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  }
});

const Souvenir = Product.discriminator('Souvenir', souvenirSchema);

module.exports = Souvenir;

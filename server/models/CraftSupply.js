const mongoose = require('mongoose');
const Product = require('./Product');

const craftSupplySchema = new mongoose.Schema({
  brand: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },
  type: {
    type: String, // ví dụ: keo sữa, đất sét tự khô, kéo cắt răng cưa...
    trim: true
  },
  material: {
    type: String,
    trim: true
  },
  safetyWarning: {
    type: String,
    trim: true
  }
});

const CraftSupply = Product.discriminator('CraftSupply', craftSupplySchema);

module.exports = CraftSupply;

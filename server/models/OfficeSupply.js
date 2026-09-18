const mongoose = require('mongoose');
const Product = require('./Product');

const officeSupplySchema = new mongoose.Schema({
  brand: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },
  material: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  dimensions: {
    type: String,
    trim: true
  },
  weight: {
    type: Number,
    min: 0
  }
});

const OfficeSupply = Product.discriminator('OfficeSupply', officeSupplySchema);

module.exports = OfficeSupply;

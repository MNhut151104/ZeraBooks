const mongoose = require('mongoose');
const Product = require('./Product');

const artSupplySchema = new mongoose.Schema({
  brand: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true
  },
  colorCount: {
    type: Number,
    min: 0
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

const ArtSupply = Product.discriminator('ArtSupply', artSupplySchema);

module.exports = ArtSupply;

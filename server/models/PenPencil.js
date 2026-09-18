const mongoose = require('mongoose');
const Product = require('./Product');

const penPencilSchema = new mongoose.Schema({
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
  inkColor: {
    type: String,
    trim: true
  },
  tipSize: {
    type: String,
    trim: true
  },
  material: {
    type: String,
    trim: true
  },
  isRefillable: {
    type: Boolean,
    default: false
  }
});

const PenPencil = Product.discriminator('Pen', penPencilSchema);

module.exports = PenPencil;

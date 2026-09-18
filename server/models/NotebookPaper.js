const mongoose = require('mongoose');
const Product = require('./Product');

const notebookPaperSchema = new mongoose.Schema({
  brand: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },
  paperSize: {
    type: String,
    trim: true
  },
  pageCount: {
    type: Number,
    min: 0
  },
  paperWeight: {
    type: String,
    trim: true
  },
  rulingType: {
    type: String,
    trim: true
  },
  coverMaterial: {
    type: String,
    trim: true
  }
});

const NotebookPaper = Product.discriminator('Notebook', notebookPaperSchema);

module.exports = NotebookPaper;

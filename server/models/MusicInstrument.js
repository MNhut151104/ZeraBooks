const mongoose = require('mongoose');
const Product = require('./Product');

const musicInstrumentSchema = new mongoose.Schema({
  brand: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },
  type: {
    type: String, // ví dụ: Ukulele, sáo trúc, harmonica, tuner lên dây...
    trim: true
  },
  material: {
    type: String,
    trim: true
  },
  dimensions: {
    type: String,
    trim: true
  },
  weight: {
    type: Number, // gram
    min: 0
  }
});

const MusicInstrument = Product.discriminator('MusicInstrument', musicInstrumentSchema);

module.exports = MusicInstrument;

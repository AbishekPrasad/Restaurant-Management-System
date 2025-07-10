const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  ingredients: [String],
  image: String,
  amount: { type: Number, required: true },
  category: {
    type: String,
    enum: ['veg', 'non-veg'],
    default: 'veg'
  }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  note: String,
  quantity: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Ready', 'Delivered'],
    default: 'Pending'
  },
  orderNumber: { type: Number, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
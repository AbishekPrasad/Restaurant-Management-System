const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { authenticateUser, isAdmin } = require('../middleware/auth');

router.post('/', authenticateUser, async (req, res) => {
  try {
    const { item, note, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(item)) {
      return res.status(400).json({ message: 'Invalid item ID format' });
    }

    const lastOrder = await Order.findOne().sort({ orderNumber: -1 });
    const nextOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1000;

    const order = await Order.create({
      user: req.user.id,
      item,
      note,
      quantity,
      orderNumber: nextOrderNumber,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('Order Error:', err);
    res.status(500).json({ message: 'Order placement failed' });
  }
});

router.get('/', authenticateUser, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find().populate('user').populate('item');
    } else {
      orders = await Order.find({ user: req.user.id }).populate('item');
    }
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.put('/:id', authenticateUser, isAdmin, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

router.delete('/:id', authenticateUser, isAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

router.get('/user', authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('item');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
});

// Add this inside routes/order.js
router.get('/user', authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('item');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user orders' });
  }
});


module.exports = router;
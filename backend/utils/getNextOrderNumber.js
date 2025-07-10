const Counter = require('../models/Counter');

async function getNextOrderNumber() {
  const counter = await Counter.findOneAndUpdate(
    { name: 'order' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value;
}

module.exports = getNextOrderNumber;

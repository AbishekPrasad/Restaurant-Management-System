import React, { useState } from 'react';
import API from '../api';

const OrderForm = ({ itemId }) => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const placeOrder = async () => {
    try {
      await API.post('/order', {
        item: itemId,
        note,
        quantity
      });
      alert('Order placed successfully!');
      setNote('');
      setQuantity(1);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to place order.');
    }
  };

  return (
    <div className="mt-2">
      <div className="input-group mb-2">
        <button className="btn btn-outline-secondary" onClick={decrement}>-</button>
        <input
          type="number"
          className="form-control text-center"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
        />
        <button className="btn btn-outline-secondary" onClick={increment}>+</button>
      </div>
      <textarea
        className="form-control mb-2"
        placeholder="Any note?"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button className="btn btn-primary w-100" onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default OrderForm;

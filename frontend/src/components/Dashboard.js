import React, { useEffect, useState } from 'react';
import API from '../api';

const Dashboard = ({ onLogout }) => {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [notes, setNotes] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [diningCart, setDiningCart] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMenu();
    fetchUserOrders();
  }, []);

  const fetchMenu = async () => {
    const res = await API.get('/menu');
    setMenu(res.data);

    const qty = {}, nts = {};
    res.data.forEach(item => {
      qty[item._id] = 1;
      nts[item._id] = '';
    });
    setQuantities(qty);
    setNotes(nts);
  };

  const fetchUserOrders = async () => {
    try {
      const res = await API.get('/order/user');
      setOrders(res.data);
      const total = res.data.reduce((sum, order) => sum + (order.item?.amount || 0) * order.quantity, 0);
      setTotalAmount(total);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuantityChange = (itemId, delta) => {
    setQuantities(prev => ({ ...prev, [itemId]: Math.max(1, (prev[itemId] || 1) + delta) }));
  };

  const handleNoteChange = (itemId, value) => {
    setNotes(prev => ({ ...prev, [itemId]: value }));
  };

  const addToDining = (itemId) => {
    const existing = diningCart.find(i => i.item === itemId);
    if (!existing) {
      setDiningCart([...diningCart, {
        item: itemId,
        quantity: quantities[itemId],
        note: notes[itemId]
      }]);
    }
  };

  const removeFromDining = (itemId) => {
    setDiningCart(prev => prev.filter(i => i.item !== itemId));
  };

  const confirmOrder = async () => {
    try {
      for (let order of diningCart) {
        await API.post('/order', order);
      }
      alert('All items placed!');
      setDiningCart([]);
      fetchUserOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place some items');
    }
  };

  const filteredMenu = filter === 'all' ? menu : menu.filter(item => item.category === filter);

  return (
    <div className="container mt-4">
      <header className="bg-light text-dark py-4 mb-4 shadow-sm rounded text-center border">
        <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', letterSpacing: '1.5px' }}>
          Indulge in a Seamless Dining Experience
        </h2>
        <p className="mb-0" style={{ fontSize: '1rem', fontStyle: 'italic' }}>
          Choose your favorite dishes and enjoy effortless ordering
        </p>
      </header>
      <div className="text-end mb-3">
        <button className="btn btn-outline-dark" onClick={onLogout}>Logout</button>
      </div>

      <div className="mb-3">
        <button className={`btn me-2 ${filter === 'all' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilter('all')}>All</button>
        <button className={`btn me-2 ${filter === 'veg' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilter('veg')}>Veg</button>
        <button className={`btn ${filter === 'non-veg' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setFilter('non-veg')}>Non-Veg</button>
      </div>

      <h4>Menu</h4>
      <div className="row">
        {filteredMenu.map(item => (
          <div key={item._id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={item.image} className="card-img-top" alt={item.name} style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
                <p className="card-text"><strong>Amount:</strong> ₹{item.amount}</p>
                <div className="input-group mb-2">
                  <button className="btn btn-outline-secondary" onClick={() => handleQuantityChange(item._id, -1)}>-</button>
                  <input type="number" className="form-control text-center" value={quantities[item._id] || 1} readOnly />
                  <button className="btn btn-outline-secondary" onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                </div>
                <textarea className="form-control mb-2" placeholder="Add note..." value={notes[item._id] || ''} onChange={e => handleNoteChange(item._id, e.target.value)} />
                <button className="btn btn-warning mt-auto" onClick={() => addToDining(item._id)}>
                  Add to Dining
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {diningCart.length > 0 && (
        <div className="mt-5">
          <h4>Your Dining Selection</h4>
          <table className="table table-bordered">
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Note</th><th>Amount</th><th>Action</th></tr>
            </thead>
            <tbody>
              {diningCart.map((d, i) => {
                const item = menu.find(m => m._id === d.item);
                return (
                  <tr key={i}>
                    <td>{item?.name}</td>
                    <td>{d.quantity}</td>
                    <td>{d.note}</td>
                    <td>₹{(item?.amount || 0) * d.quantity}</td>
                    <td><button className="btn btn-sm btn-danger" onClick={() => removeFromDining(d.item)}>Remove</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <h5 className="mt-3">
            Total: ₹{diningCart.reduce((sum, d) => {
              const item = menu.find(m => m._id === d.item);
              return sum + (item?.amount || 0) * d.quantity;
            }, 0)}
          </h5>
          <button className="btn btn-success mt-2" onClick={confirmOrder}>Confirm Order</button>
        </div>
      )}

      <h4 className="mt-5">Your Orders</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Item</th>
            <th>Amount</th>
            <th>Quantity</th>
            <th>Note</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.item?.name}</td>
              <td>₹{order.item?.amount}</td>
              <td>{order.quantity}</td>
              <td>{order.note}</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5 className="mt-3">Total Amount: ₹{totalAmount}</h5>
      <footer className="bg-light text-center mt-5 py-3 border-top">
        <p className="mb-0 text-muted">
          &copy; {new Date().getFullYear()} Abishek Prasad Subramanian. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;

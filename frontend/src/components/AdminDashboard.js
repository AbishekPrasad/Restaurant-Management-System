import React, { useEffect, useState } from 'react';
import API from '../api';

const AdminDashboard = ({ onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('all');
  const [form, setForm] = useState({
    name: '',
    description: '',
    ingredients: '',
    image: '',
    amount: '',
    category: 'veg'
  });
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ordersRes = await API.get('/order');
      const menuRes = await API.get('/menu');
      setOrders(ordersRes.data);
      setMenu(menuRes.data);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  const handleAddOrUpdate = async () => {
    const ingredientsArray = form.ingredients.split(',').map(s => s.trim());
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        ingredients: ingredientsArray
      };

      if (editingItemId) {
        await API.put(`/menu/${editingItemId}`, payload);
      } else {
        await API.post('/menu', payload);
      }

      setForm({ name: '', description: '', ingredients: '', image: '', amount: '', category: 'veg' });
      setEditingItemId(null);
      fetchData();
    } catch (err) {
      console.error('Add/Update Menu Error:', err);
    }
  };

  const handleEdit = (item) => {
    const confirmEdit = window.confirm(`Are you sure you want to edit "${item.name}"?`);
    if (!confirmEdit) return;

    setForm({
      name: item.name,
      description: item.description,
      ingredients: item.ingredients.join(', '),
      image: item.image,
      amount: item.amount,
      category: item.category || 'veg'
    });
    setEditingItemId(item._id);
  };

  const handleDelete = async (id) => {
    const itemToDelete = menu.find(item => item._id === id);
    if (!window.confirm(`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`)) return;

    try {
      await API.delete(`/menu/${id}`);
      fetchData();
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Failed to delete the item.');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/order/${orderId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Status Update Error:', err);
    }
  };

  const handleRemoveOrder = async (id) => {
    if (!window.confirm('Are you sure you want to remove this delivered order?')) return;
    await API.delete(`/order/${id}`);
    fetchData();
  };

  const filteredMenu = filteredCategory === 'all' ? menu : menu.filter(item => item.category === filteredCategory);

  return (
    <div className="container mt-4">
      <header className="bg-light text-dark py-4 mb-4 shadow-sm rounded text-center border">
        <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', letterSpacing: '1.5px' }}>
          Manage Orders and Menu Seamlessly
        </h2>
        <p className="mb-0" style={{ fontSize: '1rem', fontStyle: 'italic' }}>
          Empower your kitchen with efficient control and updates
        </p>
      </header>
      <div className="text-end mb-3">
        <button className="btn btn-outline-dark" onClick={onLogout}>Logout</button>
      </div>

      <h4>Orders</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>User</th>
            <th>Item</th>
            <th>Note</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.user?.email}</td>
              <td>{order.item?.name}</td>
              <td>{order.note}</td>
              <td>{order.quantity}</td>
              <td>{order.status}</td>
              <td>
                {order.status !== 'Delivered' ? (
                  <select
                    className="form-select form-select-sm"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                ) : (
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemoveOrder(order._id)}>
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="mt-5">Manage Menu</h4>

      <div className="mb-3">
        <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="form-control mb-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="form-control mb-2" placeholder="Ingredients (comma-separated)" value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} />
        <input className="form-control mb-2" placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
        <input className="form-control mb-2" placeholder="Amount (₹)" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
        <select className="form-select mb-2" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>

        <button className="btn btn-success me-2" onClick={handleAddOrUpdate}>
          {editingItemId ? 'Update Item' : 'Add Item'}
        </button>
        {editingItemId && (
          <button className="btn btn-secondary" onClick={() => {
            setForm({ name: '', description: '', ingredients: '', image: '', amount: '', category: 'veg' });
            setEditingItemId(null);
          }}>
            Cancel
          </button>
        )}
      </div>

      <div className="mb-3">
        <button className={`btn me-2 ${filteredCategory === 'all' ?  'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilteredCategory('all')}>All</button>
        <button className={`btn me-2 ${filteredCategory === 'veg' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilteredCategory('veg')}>Veg</button>
        <button className={`btn ${filteredCategory === 'non-veg' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setFilteredCategory('non-veg')}>Non-Veg</button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr><th>Name</th><th>Amount</th><th>Category</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filteredMenu.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>₹{item.amount}</td>
              <td>{item.category}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="mt-5 text-center text-muted">
        <hr />
        <p>&copy; {new Date().getFullYear()} Abishek Prasad Subramanian. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;

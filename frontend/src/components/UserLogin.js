import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const UserLogin = ({ setToken, setRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });

      if (res.data.role !== 'user') {
        alert('You are not a user. Use the admin login page.');
        return;
      }

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      setToken(res.data.token);
      setRole(res.data.role); // ✅ Added
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-3">User Login</h3>
        <form onSubmit={handleLogin}>
          <input className="form-control mb-3" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="form-control mb-3" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <button className="btn btn-link w-100 mt-2" onClick={() => navigate('/admin-login')}>
          Admin Login
        </button>
        <button className="btn btn-outline-secondary w-100 mt-2" onClick={() => navigate('/register')}>
          Register
        </button>
      </div>
    </div>
  );
};

export default UserLogin;

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import UserLogin from './components/UserLogin';
import AdminLogin from './components/AdminLogin';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  return (
    <Router>
      <Routes>
        {!token ? (
          <>
            <Route path="/login" element={<UserLogin setToken={setToken} setRole={setRole} />} />
            <Route path="/admin-login" element={<AdminLogin setToken={setToken} setRole={setRole} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            {role === 'admin' ? (
              <Route path="/admin" element={<AdminDashboard onLogout={handleLogout} />} />
            ) : (
              <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
            )}
            <Route path="*" element={<Navigate to={role === 'admin' ? '/admin' : '/dashboard'} replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;

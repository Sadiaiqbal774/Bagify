import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // New role state
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { name, email, password, role });
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
      <SEO title="Register" />
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Account Type</label>
          <select
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Customer (User)</option>
            <option value="admin">Store Manager (Admin)</option>
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Full Name</label>
          <input type="text" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email Address</label>
          <input type="email" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Password</label>
          <input type="password" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Sign Up</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/auth/register', { name, email, password, role });
      await login(email, password);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === 'User already exists') {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (msg) {
        setError(msg);
      } else {
        setError('We could not complete your registration. Please try again.');
      }
    }
  };

  return (
    <div className="auth-page-wrap">
      <SEO title="Register" />
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
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

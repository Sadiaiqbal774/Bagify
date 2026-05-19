import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid Credentials');
    }
  };

  return (
    <div className="auth-page-wrap">
      <SEO title="Login" />
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Account Login</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email Address</label>
          <input type="email" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Password</label>
          <input type="password" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Sign In</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        New User? <Link to="/register">Create Account</Link>
      </p>
    </div>
  );
};

export default Login;

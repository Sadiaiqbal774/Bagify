import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const CheckoutSuccess = () => {
  const orderNumber = `BG-${Math.floor(Math.random() * 100000)}`;

  return (
    <div style={{ maxWidth: '600px', margin: '6rem auto', textAlign: 'center', padding: '3rem', background: 'white', border: '1px solid var(--border-color)' }}>
      <SEO title="Order Confirmed" />
      <CheckCircle size={80} color="#10b981" style={{ marginBottom: '2rem' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Order Confirmed</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '3rem' }}>
        Thank you for your purchase. We are preparing your items for shipment.
      </p>

      <div style={{ padding: '2rem', border: '1px solid var(--border-color)', marginBottom: '3rem', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package size={20} /> Order Summary
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Order Number:</span>
          <span style={{ fontWeight: 700 }}>{orderNumber}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Status:</span>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Processing</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/products" className="btn" style={{ background: 'none', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
        <Link to="/profile" className="btn">View Orders</Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

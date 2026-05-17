import React from 'react';
import SEO from '../components/SEO';
import { TrendingUp, ShoppingCart, Package, Users, ArrowUpRight } from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: '$24,500', change: '+12.4%', icon: <TrendingUp size={22} />, color: '#c5a059' },
  { label: 'Orders', value: '124', change: '+8.1%', icon: <ShoppingCart size={22} />, color: '#6366f1' },
  { label: 'Products', value: '45', change: '+3', icon: <Package size={22} />, color: '#10b981' },
  { label: 'Customers', value: '89', change: '+14.2%', icon: <Users size={22} />, color: '#f43f5e' },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Aisha Khan', product: 'Midnight Executive Backpack', amount: '$240', status: 'Delivered' },
  { id: '#ORD-002', customer: 'James Miller', product: 'Capri Leather Clutch', amount: '$85', status: 'Processing' },
  { id: '#ORD-003', customer: 'Sophia Lane', product: 'Heritage Satchel', amount: '$175', status: 'Shipped' },
  { id: '#ORD-004', customer: 'Ethan Brooks', product: 'Parisian Tote', amount: '$320', status: 'Delivered' },
];

const statusColors = {
  Delivered: '#10b981',
  Processing: '#f59e0b',
  Shipped: '#6366f1',
};

const AdminDashboard = () => {
  return (
    <>
      <SEO title="Admin Dashboard" description="Manage your Bagify store" />

      <div className="admin-page-header">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-tertiary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Welcome back, Admin. Here's what's happening.
          </p>
        </div>
        <button className="admin-action-btn">+ New Product</button>
      </div>

      {/* Stat Cards */}
      <div className="admin-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-icon" style={{ background: `${s.color}18`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="admin-stat-label">{s.label}</p>
              <p className="admin-stat-value">{s.value}</p>
            </div>
            <div className="admin-stat-change">
              <ArrowUpRight size={14} />
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Orders</h2>
          <button className="admin-view-all-btn">View All →</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>{order.id}</td>
                <td>{order.customer}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{order.product}</td>
                <td style={{ fontWeight: 700 }}>{order.amount}</td>
                <td>
                  <span className="admin-status-pill" style={{ background: `${statusColors[order.status]}18`, color: statusColors[order.status] }}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminDashboard;

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Bell, TrendingUp, Brain } from 'lucide-react';
import CustomCursor from './CustomCursor';

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Overview' },
  { to: '/dashboard/analytics', icon: <Brain size={18} />, label: 'AI Analytics' },
  { to: '/dashboard/products', icon: <Package size={18} />, label: 'Products' },
  { to: '/dashboard/orders', icon: <ShoppingCart size={18} />, label: 'Orders' },
  { to: '/dashboard/users', icon: <Users size={18} />, label: 'Users' },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="admin-shell">
      <CustomCursor />

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="admin-brand-name">Bagify</span>
            <span className="admin-brand-tag">Admin</span>
          </Link>
        </div>

        <nav className="admin-nav">
          <p className="admin-nav-section-label">Main</p>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-nav-link ${location.pathname === item.to ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}

          <p className="admin-nav-section-label" style={{ marginTop: '2rem' }}>System</p>
          <Link to="/" className="admin-nav-link">
            <LogOut size={18} />
            <span>Back to Store</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-avatar">A</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'white' }}>Admin User</p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Super Admin</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <TrendingUp size={20} style={{ color: 'var(--accent-gold)' }} />
            <span>Bagify Command Center</span>
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-icon-btn">
              <Bell size={18} />
              <span className="admin-notif-dot"></span>
            </button>
            <div className="admin-topbar-avatar">A</div>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;

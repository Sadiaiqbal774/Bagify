import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Heart, Package, LogOut } from 'lucide-react';
import SEO from '../components/SEO';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { wishlist } = useContext(CartContext);

  if (!user) return <div style={{ textAlign: 'center', padding: '4rem' }}>Please login to view your profile.</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <SEO title="My Profile" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Welcome, {user.name}!</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{user.email} • {user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
        </div>
        <button className="btn" style={{ background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Wishlist Section */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Heart size={24} color="#ef4444" fill="#ef4444" />
            <h2 style={{ margin: 0 }}>My Wishlist</h2>
          </div>
          {wishlist.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No items saved to wishlist.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {wishlist.map(item => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <div style={{ width: '50px', height: '50px', background: 'var(--bg-primary)', borderRadius: '0.5rem' }}></div>
                  <span style={{ fontWeight: 500 }}>{item.name}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 600 }}>${item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders & Tracking Section */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Package size={24} color="var(--accent-primary)" />
            <h2 style={{ margin: 0 }}>Recent Orders</h2>
          </div>
          <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>Order #BG-9921</span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Shipped</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Placed on: Oct 24, 2024</p>
            <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
               Status: <strong>Out for Delivery</strong>
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Track all your e-commerce shipments here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

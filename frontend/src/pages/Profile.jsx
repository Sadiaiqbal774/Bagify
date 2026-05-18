import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Heart, Package, LogOut, ExternalLink, Clock } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { wishlist } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchMyOrders = async () => {
        try {
          const { data } = await axios.get('/api/orders/myorders', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setOrders(data);
        } catch (err) {
          console.error("Error fetching orders:", err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchMyOrders();
    }
  }, [user]);

  if (!user) return <div style={{ textAlign: 'center', padding: '8rem 2rem', fontSize: '1.2rem', fontWeight: 600 }}>Please login to view your profile.</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '4rem auto', padding: '0 1.5rem' }}>
      <SEO title="My Profile - Bagify" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: 'var(--text-primary)' }}>Welcome, {user.name}!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
            {user.email} • <span style={{ fontWeight: 700, color: user.role === 'admin' ? 'var(--accent-gold)' : 'inherit' }}>{user.role === 'admin' ? 'Administrator Account' : 'VIP Member'}</span>
          </p>
        </div>
        <button className="btn" style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #f87171', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '50px', fontWeight: 700 }} onClick={logout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem' }}>
        {/* Wishlist Section */}
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Heart size={26} color="#ef4444" fill="#ef4444" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>My Curated Wishlist ({wishlist.length})</h2>
          </div>
          {wishlist.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
               <Heart size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
               <p style={{ fontSize: '1rem', margin: 0 }}>No items currently saved to your wishlist.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {wishlist.map(item => (
                <div key={item._id || item.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '1.25rem' }}>
                  <div style={{ width: '64px', height: '64px', background: 'var(--bg-primary)', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(0,0,0,0.04)' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.brand || 'Luxury'}</span>
                  </div>
                  <span style={{ marginLeft: 'auto', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>${item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders & Tracking Section */}
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Package size={26} color="var(--accent-gold)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Order History & Tracking</h2>
          </div>

          {loadingOrders ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <Package size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontSize: '1rem', margin: 0 }}>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {orders.map(order => (
                <div key={order._id || order.id} style={{ background: 'var(--bg-primary)', padding: '1.6rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', transition: '0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-gold)' }}>{order._id || order.id}</span>
                    <span style={{ 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '50px', 
                      fontSize: '0.75rem', 
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      background: order.status === 'Delivered' ? '#10b98118' : order.status === 'Shipped' ? '#6366f118' : '#f59e0b18',
                      color: order.status === 'Delivered' ? '#10b981' : order.status === 'Shipped' ? '#6366f1' : '#f59e0b'
                    }}>
                      {order.status || 'Processing'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
                     <Clock size={14} />
                     <span>Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString()} • Paid via {order.paymentMethod || 'Card'}</span>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <strong>Latest Status Update:</strong> {order.lastUpdate || 'Your items are being prepared for dispatch.'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem', fontWeight: 800, fontSize: '1.05rem' }}>
                    <span>Total Investment</span>
                    <span>${order.totalPrice || order.total || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

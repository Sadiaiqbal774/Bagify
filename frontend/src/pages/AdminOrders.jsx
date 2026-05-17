import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';
import SEO from '../components/SEO';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchOrders();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      await axios.delete(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchOrders();
    }
  };

  return (
    <div>
      <SEO title="Manage Orders" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Order Directory</h1>
      </div>

      <div style={{ background: '#fff', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-primary)', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '1rem' }}>ORDER ID</th>
              <th style={{ padding: '1rem' }}>EMAIL</th>
              <th style={{ padding: '1rem' }}>TOTAL</th>
              <th style={{ padding: '1rem' }}>STATUS</th>
              <th style={{ padding: '1rem' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id || o._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1.5rem 1rem', fontWeight: 600 }}>{o.id || o._id}</td>
                <td style={{ padding: '1.5rem 1rem' }}>{o.userEmail}</td>
                <td style={{ padding: '1.5rem 1rem' }}>${o.totalPrice || o.total}</td>
                <td style={{ padding: '1.5rem 1rem' }}>
                  <select 
                    value={o.status} 
                    onChange={(e) => handleStatusChange(o.id || o._id, e.target.value)}
                    style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td style={{ padding: '1.5rem 1rem' }}>
                  <button onClick={() => deleteHandler(o.id || o._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;

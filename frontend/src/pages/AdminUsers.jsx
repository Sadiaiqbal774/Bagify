import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';
import SEO from '../components/SEO';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchUsers();
      } catch (e) {
        alert(e.response?.data?.message || 'Error deleting user');
      }
    }
  };

  return (
    <div>
      <SEO title="Manage Users" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>User Management</h1>
      </div>

      <div className="admin-table-responsive" style={{ background: '#fff', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-primary)', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '1rem' }}>NAME</th>
              <th style={{ padding: '1rem' }}>EMAIL</th>
              <th style={{ padding: '1rem' }}>ROLE</th>
              <th style={{ padding: '1rem' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id || u._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1.5rem 1rem', fontWeight: 600 }}>{u.name}</td>
                <td style={{ padding: '1.5rem 1rem' }}>{u.email}</td>
                <td style={{ padding: '1.5rem 1rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    background: u.role === 'admin' ? 'var(--accent-gold)' : '#eee', 
                    color: u.role === 'admin' ? '#fff' : '#333',
                    borderRadius: '4px', fontSize: '0.8rem' 
                  }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1.5rem 1rem' }}>
                  {u._id !== user._id && u.id !== user._id && (
                    <button onClick={() => deleteHandler(u.id || u._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18}/></button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import SEO from '../components/SEO';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchProducts = async () => {
    const { data } = await axios.get('/api/products');
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchProducts();
    }
  };

  return (
    <div>
      <SEO title="Manage Products" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Products Catalog</h1>
        <Link to="/dashboard/products/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      <div style={{ background: '#fff', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-primary)', textAlign: 'left' }}>
            <tr>
              <th style={{ padding: '1rem' }}>NAME</th>
              <th style={{ padding: '1rem' }}>PRICE</th>
              <th style={{ padding: '1rem' }}>CATEGORY</th>
              <th style={{ padding: '1rem' }}>STOCK</th>
              <th style={{ padding: '1rem' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id || p._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1.5rem 1rem', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '1.5rem 1rem' }}>${p.price}</td>
                <td style={{ padding: '1.5rem 1rem' }}><span style={{ padding: '0.4rem 0.8rem', background: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: '0.8rem' }}>{p.category}</span></td>
                <td style={{ padding: '1.5rem 1rem' }}><span style={{ color: p.stock < 10 ? '#ef4444' : 'inherit' }}>{p.stock} units</span></td>
                <td style={{ padding: '1.5rem 1rem', display: 'flex', gap: '1.5rem' }}>
                  <Link to={`/dashboard/products/edit/${p.id || p._id}`} style={{ color: 'var(--text-primary)' }}><Edit size={18}/></Link>
                  <button onClick={() => deleteHandler(p.id || p._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;

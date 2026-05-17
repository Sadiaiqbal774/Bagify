import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';
import SEO from '../components/SEO';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    name: '', price: 0, description: '', category: '', stock: 0,
    slug: '', metaTitle: '', metaDescription: '', metaKeywords: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const { data } = await axios.get(`/api/products`);
        const p = data.find(x => String(x._id) === String(id) || String(x.id) === String(id));
        if (p) {
          setFormData({
            ...p,
            metaKeywords: p.metaKeywords ? p.metaKeywords.join(', ') : ''
          });
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`/api/products/${id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        showToast('Product updated successfully!');
      } else {
        await axios.post(`/api/products`, formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        showToast('New product added to inventory!');
      }
      navigate('/dashboard/products');
    } catch (error) {
       showToast('Error saving product', 'error');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGenerateSEO = async () => {
    if (!formData.name || !formData.description) {
      showToast('Please provide Name and Description first', 'error');
      return;
    }
    setIsGenerating(true);
    try {
      const { data } = await axios.post(`/api/ai/generate-seo`, {
        name: formData.name,
        description: formData.description,
        category: formData.category
      });
      setFormData(prev => ({
        ...prev,
        metaTitle: data.metaTitle || prev.metaTitle,
        metaDescription: data.metaDescription || prev.metaDescription,
        metaKeywords: data.metaKeywords || prev.metaKeywords,
        slug: prev.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
      showToast('SEO Auto-Generated Successfully!');
    } catch (error) {
      showToast('Failed to auto-generate SEO', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '4rem auto', background: '#fff', padding: '4rem', border: '1px solid var(--border-color)' }}>
      <SEO title={id ? "Edit Product" : "Add Product"} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>{id ? 'Refine Product' : 'Create New Collection Item'}</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div>
            <h3 style={{ marginBottom: '1.5rem', opacity: 0.5 }}>Commercial Data</h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Designation Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Price ($)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Availability</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Category Portfolio</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Visual/Written Narrative</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, height: '120px' }} />
              </div>
            </div>
          </div>

          <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h3 style={{ opacity: 0.5, margin: 0 }}>On-Page Optimization (SEO)</h3>
               <button type="button" onClick={handleGenerateSEO} disabled={isGenerating} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: isGenerating ? 'not-allowed' : 'pointer', fontSize: '0.8rem', borderRadius: '4px' }}>
                 {isGenerating ? 'Generating...' : '✨ Auto-Generate SEO'}
               </button>
             </div>
             <div style={{ display: 'grid', gap: '1.5rem', padding: '2rem', background: '#fcfcfc', border: '1px dashed #ccc' }}>
               <div>
                  <label style={labelStyle}>SEO URL Identifier (Slug)</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleChange} required style={inputStyle} />
               </div>
               <div>
                  <label style={labelStyle}>Structural Title Tag</label>
                  <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} maxLength={60} style={inputStyle} />
               </div>
               <div>
                  <label style={labelStyle}>Narrative Description (Meta)</label>
                  <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} maxLength={160} style={{ ...inputStyle, height: '80px' }} />
               </div>
               <div>
                  <label style={labelStyle}>Indexing Keywords</label>
                  <input type="text" name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} placeholder="e.g. luxury, leather, travel" style={inputStyle} />
               </div>
             </div>
          </div>
        </div>
        <button type="submit" className="btn" style={{ marginTop: '4rem', width: '100%', padding: '1.5rem', fontSize: '1rem' }}>
          {id ? 'Save Changes' : 'Initialize Product'}
        </button>
      </form>
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-secondary)' };
const inputStyle = { width: '100%', padding: '1rem 0', marginTop: '0.25rem', border: 'none', borderBottom: '1px solid var(--border-color)', outline: 'none', background: 'none', fontSize: '1rem' };

export default AdminProductForm;

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
        <div className="home-collections-grid">
          <div>
            <h3 style={{ marginBottom: '1.5rem', opacity: 0.5 }}>Commercial Data</h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Executive Leather Backpack" required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Price ($)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="240" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Stock Quantity</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="25" required style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Backpacks, Handbags" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Product Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed product description including materials and features..." required style={{ ...inputStyle, height: '120px' }} />
              </div>
            </div>
          </div>

          <div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
               <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.2rem' }}>Google & Search Engine Meta Tags (SEO)</h3>
               <button type="button" onClick={handleGenerateSEO} disabled={isGenerating} style={{ background: 'var(--accent-gold)', color: '#000', border: 'none', padding: '0.6rem 1.2rem', cursor: isGenerating ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 700, borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 12px rgba(197,160,89,0.3)' }}>
                 {isGenerating ? 'Generating...' : '✨ Auto-Generate AI Meta Tags'}
               </button>
             </div>
             
             <div style={{ background: 'rgba(197,160,89,0.08)', border: '1px solid rgba(197,160,89,0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
               💡 <strong>Admin Tip:</strong> Click the button above to let AI write perfect SEO meta tags automatically based on your product details, OR type/edit them manually in the fields below.
             </div>

             <div style={{ display: 'grid', gap: '1.8rem', padding: '2rem', background: '#fbfbfb', border: '1px solid #eaeaea', borderRadius: '12px' }}>
               <div>
                  <label style={labelStyle}>URL Slug (Web Address)</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. executive-leather-backpack" required style={inputStyle} />
                  <span style={hintStyle}>The web link for this product: yourwebsite.com/product/<strong>{formData.slug || 'slug-here'}</strong></span>
               </div>
               <div>
                  <label style={labelStyle}>SEO Meta Title (Google Search Title)</label>
                  <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} placeholder="e.g. Premium Executive Leather Backpack | Bagify" maxLength={70} style={inputStyle} />
                  <span style={hintStyle}>The blue title link shown in Google search results. Recommended length: 50-60 characters.</span>
               </div>
               <div>
                  <label style={labelStyle}>SEO Meta Description (Google Search Summary)</label>
                  <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} placeholder="e.g. Handcrafted full-grain leather backpack featuring dedicated 16-inch laptop protection and ergonomic travel straps." maxLength={160} style={{ ...inputStyle, height: '80px' }} />
                  <span style={hintStyle}>A compelling 1-2 sentence description shown below the search title. Recommended length: 150-160 characters.</span>
               </div>
               <div>
                  <label style={labelStyle}>SEO Meta Keywords (Search Indexing Words)</label>
                  <input type="text" name="metaKeywords" value={formData.metaKeywords} onChange={handleChange} placeholder="leather backpack, laptop bag, luxury luggage, travel pack" style={inputStyle} />
                  <span style={hintStyle}>Enter words separated by commas that customers might search for to find this bag.</span>
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
const hintStyle = { display: 'block', fontSize: '0.75rem', color: '#888', marginTop: '0.4rem' };

export default AdminProductForm;

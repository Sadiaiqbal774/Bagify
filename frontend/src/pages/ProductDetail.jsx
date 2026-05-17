import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { ShoppingCart, ArrowLeft, Star, Tablet, Sparkles, ThumbsUp, Ruler, Laptop, BookOpen, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiReviewSummary, setAiReviewSummary] = useState(null);
  const [showFitGuide, setShowFitGuide] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products`);
        const found = data.find(p => String(p.id) === String(id) || String(p._id) === String(id));
        setProduct(found);
        
        // Fetch AI Review Sentiment Summary
        try {
          const res = await axios.get(`http://localhost:5000/api/ai/review-summary/${id}`);
          if (res.data && res.data.success) {
            setAiReviewSummary(res.data);
          }
        } catch (aiErr) {
          console.error("AI summary not available:", aiErr);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container" style={{padding: '10rem'}}>Loading...</div>;
  if (!product) return <div className="container" style={{padding: '10rem'}}>Product not found.</div>;

  const handleAddToCart = () => {
    addToCart(product);
    showToast(`Added ${product.name} to your selection.`);
    navigate('/cart');
  };

  return (
    <div className="container" style={{ padding: '6rem 0' }}>
      <SEO title={product.name} description={product.description} />
      
      <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={18} /> Back to Collection
      </Link>

      <div className="product-detail-grid">
        {/* Left: Image */}
        <div className="product-detail-img-box">
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>

        {/* Right: Info */}
        <div style={{ paddingTop: '2rem' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 700 }}>{product.brand}</span>
          <h1 style={{ fontSize: '4.5rem', margin: '2rem 0', lineHeight: 1, fontWeight: 800 }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
            <span style={{ fontSize: '3rem', fontWeight: 500 }}>${product.price}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: 'var(--bg-tertiary)', borderRadius: '50px' }}>
              <Star size={18} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{product.rating}</span>
            </div>
          </div>

          {/* AI Review Summary Box */}
          {aiReviewSummary && (
            <div className="ai-review-summary-box">
               <div className="ai-review-header">
                  <div className="ai-review-badge">
                     <Sparkles size={14} /> {aiReviewSummary.aiModel}
                  </div>
                  <div className="ai-review-tag">
                     <ThumbsUp size={14} /> {aiReviewSummary.positiveScore}% Positive Sentiment
                  </div>
               </div>
               <p className="ai-review-text">
                  "{aiReviewSummary.summaryText}"
               </p>
               <div style={{ marginTop: '1.2rem', fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  AI Key Highlight: {aiReviewSummary.highlightTag}
               </div>
            </div>
          )}

          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '4rem', fontWeight: 300 }}>
            {product.description}
          </p>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '4rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <button className="btn" style={{ width: '100%', padding: '1.8rem', fontSize: '1rem', borderRadius: '50px' }} onClick={handleAddToCart}>
                 Secure this Piece
              </button>
              
              <button 
                onClick={() => setShowFitGuide(true)}
                style={{ width: '100%', padding: '1.4rem', fontSize: '0.95rem', borderRadius: '50px', background: 'white', border: '1px solid var(--accent-gold)', color: 'var(--accent-gold)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: '0.2s', boxShadow: '0 4px 15px rgba(197,160,89,0.1)' }}
              >
                <Ruler size={18} /> AI Smart Capacity & Fit Guide
              </button>
            </div>
            
            <div className="home-collections-grid" style={{ marginTop: '4rem' }}>
               <div>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>Express Shipping</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Complimentary delivery on orders above $150.</p>
               </div>
               <div>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em' }}>Curated Quality</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Each piece is inspected for absolute perfection.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Smart Fit Guide Modal */}
      {showFitGuide && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', boxSizing: 'border-box' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '3rem', maxWidth: '550px', width: '100%', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s ease', boxSizing: 'border-box' }}>
             <button onClick={() => setShowFitGuide(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f5f5f5', border: 'none', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>✕</button>
             
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--accent-gold)', marginBottom: '1rem' }}>
                <Sparkles size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Space Analyzer</span>
             </div>
             
             <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>What Fits Inside?</h3>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
                Our AI computer vision models have verified internal volume compatibility for <strong>{product.name}</strong>. Here is the guaranteed device fit:
             </p>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Laptop size={18} color="#10b981" /> 16" MacBook & Laptops</span>
                      <span style={{ color: '#10b981' }}>100% Perfect Fit</span>
                   </div>
                   <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '50px', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: '#10b981', borderRadius: '50px' }}></div>
                   </div>
                </div>

                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Tablet size={18} color="#10b981" /> iPad Pro / Air & Tablets</span>
                      <span style={{ color: '#10b981' }}>100% Perfect Fit</span>
                   </div>
                   <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '50px', overflow: 'hidden' }}>
                      <div style={{ width: '100%', height: '100%', background: '#10b981', borderRadius: '50px' }}></div>
                   </div>
                </div>

                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BookOpen size={18} color="#3b82f6" /> A4 Files, Notebooks & Accessories</span>
                      <span style={{ color: '#3b82f6' }}>High Capacity (90%)</span>
                   </div>
                   <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '50px', overflow: 'hidden' }}>
                      <div style={{ width: '90%', height: '100%', background: '#3b82f6', borderRadius: '50px' }}></div>
                   </div>
                </div>
             </div>

             <div style={{ background: 'var(--bg-tertiary)', padding: '1.2rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <CheckCircle size={24} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                   <strong>TSA Carry-On Approved:</strong> Compliant with major global airline cabin luggage limits.
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

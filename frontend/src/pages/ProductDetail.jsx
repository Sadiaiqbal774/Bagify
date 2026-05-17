import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { ShoppingCart, ArrowLeft, Star, Tablet } from 'lucide-react';
import SEO from '../components/SEO';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products`);
        const found = data.find(p => String(p.id) === String(id) || String(p._id) === String(id));
        setProduct(found);
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem', alignItems: 'start' }}>
        {/* Left: Image */}
        <div style={{ background: '#fcfcfc', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', height: '800px' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>

        {/* Right: Info */}
        <div style={{ paddingTop: '2rem' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 700 }}>{product.brand}</span>
          <h1 style={{ fontSize: '4.5rem', margin: '2rem 0', lineHeight: 1, fontWeight: 800 }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
            <span style={{ fontSize: '3rem', fontWeight: 500 }}>${product.price}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: 'var(--bg-tertiary)', borderRadius: '50px' }}>
              <Star size={18} fill="var(--accent-gold)" color="var(--accent-gold)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{product.rating}</span>
            </div>
          </div>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '5rem', fontWeight: 300 }}>
            {product.description}
          </p>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '4rem' }}>
            <button className="btn" style={{ width: '100%', padding: '1.8rem', fontSize: '1rem', borderRadius: '50px' }} onClick={handleAddToCart}>
               Secure this Piece
            </button>
            
            <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
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
    </div>
  );
};

export default ProductDetail;

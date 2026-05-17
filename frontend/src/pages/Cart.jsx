import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const Cart = () => {
  const { cartItems, removeFromCart, setCartItems } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  const handleCheckout = async () => {
    if (!user) {
      showToast('Please login to complete your purchase', 'error');
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    try {
      await axios.post('/api/orders', {
        orderItems: cartItems,
        totalPrice: Number(total)
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      showToast('Payment successful! Redirecting to confirmation...');
      setCartItems([]);
      navigate('/checkout-success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Checkout failed', 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '4rem auto' }}>
      <SEO title="Shopping Cart" />
      <h1 style={{ marginBottom: '4rem', fontSize: '2.5rem' }}>Your Selections</h1>
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem' }}>
          <h3 style={{ marginBottom: '2rem' }}>Experience our collection first.</h3>
          <Link to="/products" className="btn">Shop Now</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {cartItems.map(item => (
              <div key={item.id || item._id} style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', alignItems: 'center', gap: '2rem' }}>
                <div style={{ width: '120px', height: '140px', background: '#f5f5f5', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>${item.price} • Qty: {item.qty}</p>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>${(item.price * item.qty).toFixed(2)}</div>
                <button 
                  onClick={() => { removeFromCart(item.id || item._id); showToast('Removed from cart'); }} 
                  style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', transition: '0.3s' }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#ccc'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', padding: '2.5rem', border: '1px solid var(--border-color)', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '2rem' }}>Order Summary</h3>
            <div style={{ margin: '1.5rem 0', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', padding: '1.5rem 0', borderTop: '1px solid var(--border-color)' }}>
              <span>Total Amount</span>
              <span style={{ fontWeight: 800 }}>${total}</span>
            </div>
            <button 
              disabled={isProcessing}
              onClick={handleCheckout} 
              className="btn" 
              style={{ width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: isProcessing ? 0.5 : 1 }}
            >
              {isProcessing ? 'Processing Payment...' : (
                <>Complete Purchase <ArrowRight size={18} /></>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Trash2, ArrowRight, CreditCard, Truck, Lock, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const Cart = () => {
  const { cartItems, removeFromCart, setCartItems } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit / Debit Card');
  const [cardDetails, setCardDetails] = useState({
    number: '', name: '', expiry: '', cvv: ''
  });

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  const handleCheckout = async () => {
    if (!user) {
      showToast('Please login to complete your purchase', 'error');
      navigate('/login');
      return;
    }

    if (paymentMethod === 'Credit / Debit Card') {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        showToast('Please complete all credit/debit card details', 'error');
        return;
      }
      if (cardDetails.number.replace(/\D/g, '').length < 15) {
        showToast('Please enter a valid 16-digit card number', 'error');
        return;
      }
    }

    setIsProcessing(true);
    try {
      await axios.post('/api/orders', {
        orderItems: cartItems,
        totalPrice: Number(total),
        paymentMethod
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      showToast(`Payment via ${paymentMethod} successful! Redirecting...`);
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
        <div className="cart-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {cartItems.map(item => (
              <div key={item.id || item._id} style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', alignItems: 'center', gap: '2rem' }}>
                <div style={{ width: '120px', height: '140px', background: '#f5f5f5', overflow: 'hidden', borderRadius: '8px', flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', fontWeight: 700 }}>{item.name}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>${item.price} • Qty: {item.qty}</p>
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

          <div style={{ background: '#fff', padding: '2.5rem', border: '1px solid var(--border-color)', height: 'fit-content', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Order Summary</span>
              <ShieldCheck size={20} color="var(--accent-gold)" />
            </h3>
            
            {/* Payment Method Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Select Payment Method</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label className={`payment-method-label ${paymentMethod === 'Credit / Debit Card' ? 'active' : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'Credit / Debit Card'} onChange={() => setPaymentMethod('Credit / Debit Card')} style={{ cursor: 'pointer' }} />
                  <CreditCard size={18} color="var(--accent-gold)" /> <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Credit / Debit Card</span>
                </label>
                <label className={`payment-method-label ${paymentMethod === 'Cash on Delivery' ? 'active' : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'Cash on Delivery'} onChange={() => setPaymentMethod('Cash on Delivery')} style={{ cursor: 'pointer' }} />
                  <Truck size={18} color="var(--accent-gold)" /> <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>

            {/* Credit / Debit Card Details Form */}
            {paymentMethod === 'Credit / Debit Card' && (
              <div style={{ background: '#fbfbfb', border: '1px solid #eaeaea', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', color: 'var(--text-secondary)' }}>
                   <Lock size={14} color="#10b981" />
                   <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981' }}>256-Bit SSL Encrypted</span>
                </div>
                
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Card Number</label>
                  <input 
                    type="text" 
                    placeholder="•••• •••• •••• ••••" 
                    maxLength={19}
                    value={cardDetails.number}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                      setCardDetails({...cardDetails, number: formatted});
                    }}
                    style={{ width: '100%', padding: '0.8rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none', fontFamily: 'monospace' }} 
                  />
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Cardholder Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ALEX MORGAN" 
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value.toUpperCase()})}
                    style={{ width: '100%', padding: '0.8rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', textTransform: 'uppercase' }} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM / YY" 
                      maxLength={5}
                      value={cardDetails.expiry}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 2) val = val.slice(0,2) + ' / ' + val.slice(2,4);
                        setCardDetails({...cardDetails, expiry: val});
                      }}
                      style={{ width: '100%', padding: '0.8rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', textAlign: 'center', outline: 'none' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>CVV / CVC</label>
                    <input 
                      type="password" 
                      placeholder="•••" 
                      maxLength={4}
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                      style={{ width: '100%', padding: '0.8rem 1rem', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', textAlign: 'center', outline: 'none', letterSpacing: '0.2em' }} 
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', padding: '1.5rem 0', borderTop: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <span>Total Amount</span>
              <span style={{ fontWeight: 800 }}>${total}</span>
            </div>
            <button 
              disabled={isProcessing}
              onClick={handleCheckout} 
              className="btn" 
              style={{ width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: isProcessing ? 0.5 : 1, borderRadius: '50px' }}
            >
              {isProcessing ? 'Processing Order...' : (
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

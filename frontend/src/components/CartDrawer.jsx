import React, { useContext } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cartItems, isCartOpen, toggleCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  if (!isCartOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={() => toggleCart(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ShoppingBag size={20} />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Your Bag ({cartItems.length})</h3>
          </div>
          <button onClick={() => toggleCart(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-drawer-content">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: '2rem' }}>Your bag is currently empty.</p>
              <button className="btn" onClick={() => toggleCart(false)} style={{ padding: '1rem 2rem', fontSize: '0.8rem' }}>Start Shopping</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {cartItems.map((item) => (
                <div key={item.id || item._id} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '100px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: 600 }}>{item.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{item.qty} × ${item.price}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id || item._id)} 
                    style={{ background: 'none', border: 'none', color: '#eee', cursor: 'pointer', transition: '0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#eee'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.1rem', fontWeight: 700 }}>
              <span>Subtotal</span>
              <span>${total}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '2rem' }}>Shipping and taxes calculated at checkout.</p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button 
                className="btn" 
                style={{ width: '100%', padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => { toggleCart(false); navigate('/cart'); }}
              >
                Checkout <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => toggleCart(false)}
                style={{ background: 'none', border: 'none', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, cursor: 'pointer' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;

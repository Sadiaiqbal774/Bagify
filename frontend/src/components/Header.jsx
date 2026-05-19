import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Search, Menu, X, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, toggleCart } = useContext(CartContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await axios.get('/api/products');
      setAllProducts(data);
    };
    if (isSearchOpen) fetchAll();
  }, [isSearchOpen]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions(allProducts.slice(0, 3)); // Trending
    } else {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    }
  }, [searchQuery, allProducts]);
  

  return (
    <header className="main-header">
      <div className="header-top-bar">
        Free worldwide shipping on luxury orders over $150
      </div>
      
      <div className="header-content container">
        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand */}
        <Link to="/" className="header-brand">
          Bagify<span>.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Collection</Link>
          <Link to="/about" className="nav-link">Our Story</Link>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          <button className="action-btn" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search size={20} />
          </button>
          
          <Link to="/profile" className="action-btn">
            <UserIcon size={20} />
          </Link>

          <button className="action-btn cart-btn" onClick={() => toggleCart(true)}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {user && user.role === 'admin' && (
            <Link to="/dashboard" className="admin-link-pill">Admin</Link>
          )}
        </div>
      </div>

      {/* Modern Search Overlay */}
      {isSearchOpen && (
        <div className="search-overlay">
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="search-box">
              <Search size={24} />
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus 
              />
              <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}><X size={24} /></button>
            </div>

            <div className="search-results-area" style={{ marginTop: '4rem' }}>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-tertiary)', marginBottom: '2rem' }}>
                {searchQuery ? 'Search Results' : 'Trending Now'}
              </h4>
              <div style={{ display: 'grid', gap: '2rem' }}>
                {suggestions.map(p => (
                  <Link 
                    key={p.id || p._id} 
                    to={`/product/${p.id || p._id}`} 
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '2rem', textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{ width: '60px', height: '70px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h5 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{p.name}</h5>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{p.category} — ${p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
           <button 
             onClick={() => setIsMobileMenuOpen(false)}
             style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
           >
             <X size={32} />
           </button>
           <nav className="mobile-nav">
             <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
             <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Collection</Link>
             <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
             <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Account</Link>
             <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>Bag ({cartCount})</Link>
             {user && user.role === 'admin' && (
               <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
             )}
           </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

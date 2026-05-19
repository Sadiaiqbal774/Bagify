import React, { useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Search, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, toggleCart } = useContext(CartContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSearchError('');
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      setIsSearchLoading(true);
      setSearchError('');
      try {
        const { data } = await axios.get('/api/products');
        setAllProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        setAllProducts([]);
        setSearchError('Search is unavailable right now. Please try again shortly.');
      } finally {
        setIsSearchLoading(false);
      }
    };
    if (isSearchOpen) fetchAll();
  }, [isSearchOpen]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery === '') {
      setSuggestions(allProducts.slice(0, 3)); // Trending
    } else {
      const normalizedQuery = debouncedSearchQuery.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.name?.toLowerCase().includes(normalizedQuery) ||
        p.category?.toLowerCase().includes(normalizedQuery)
      );
      setSuggestions(filtered.slice(0, 5));
    }
  }, [debouncedSearchQuery, allProducts]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeSearch();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen, closeSearch]);


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
              <button onClick={closeSearch}><X size={24} /></button>
            </div>

            <div className="search-results-area" style={{ marginTop: '4rem' }}>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-tertiary)', marginBottom: '2rem' }}>
                {debouncedSearchQuery ? 'Search Results' : 'Trending Now'}
              </h4>
              {isSearchLoading ? (
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>Curating matches...</p>
              ) : searchError ? (
                <p style={{ color: '#ef4444', fontSize: '0.95rem' }}>{searchError}</p>
              ) : debouncedSearchQuery && suggestions.length === 0 ? (
                <div style={{ padding: '2rem 0', borderTop: '1px solid var(--border-light)' }}>
                  <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem', textTransform: 'none', letterSpacing: 0 }}>No matching pieces found.</h5>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Try a category like backpacks or handbags.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '2rem' }}>
                  {suggestions.map(p => (
                  <Link 
                    key={p.id || p._id} 
                    to={`/product/${p.id || p._id}`} 
                    onClick={closeSearch}
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
              )}
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

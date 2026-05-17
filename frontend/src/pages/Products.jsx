import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Filter, ArrowUpDown, Grid, LayoutGrid, Square } from 'lucide-react';
import SEO from '../components/SEO';
import { SkeletonCard } from '../components/Skeleton';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [gridMode, setGridMode] = useState('responsive');
  
  const { addToCart, toggleWishlist, wishlist, isCartOpen } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const revealRefs = useRef([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 800); 
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    if (sortBy === 'price-low') result.sort((a,b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a,b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a,b) => b.rating - a.rating);
    setFilteredProducts(result);
  }, [category, sortBy, products]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    revealRefs.current.forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [filteredProducts, loading]);

  const handleAddToCart = (p) => {
    addToCart(p);
    showToast(`Added ${p.name} to your selection.`);
  };

  return (
    <div className="container" style={{ padding: '8rem 0' }}>
      <SEO title="Collection" description="Browse our premium selection of handcrafted bags." />
      
      <div style={{ marginBottom: '6rem', textAlign: 'center' }} className="reveal">
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 700 }}>Our Artifacts</span>
        <h1 style={{ marginTop: '1.5rem', fontSize: '4.5rem' }}>The Collection</h1>
      </div>

      <div className="filter-bar reveal">
        <div className="filter-group">
          {['All', 'Backpacks', 'Handbags'].map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={16} />
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* View Switcher Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button onClick={() => setGridMode('col-1')} className={`view-btn ${gridMode === 'col-1' ? 'active' : ''}`} title="1 Column View">
              <Square size={16} />
            </button>
            <button onClick={() => setGridMode('col-2')} className={`view-btn ${gridMode === 'col-2' ? 'active' : ''}`} title="2 Column View">
              <Grid size={16} />
            </button>
            <button onClick={() => setGridMode('responsive')} className={`view-btn ${gridMode === 'responsive' ? 'active' : ''}`} title="Responsive Grid">
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className={`products-grid-container ${gridMode !== 'responsive' ? gridMode : ''}`}>
        {loading ? (
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filteredProducts.map((p, index) => (
            <div 
              key={p.id || p._id} 
              className="product-card-premium reveal"
              ref={el => revealRefs.current[index] = el}
            >
              <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                 <Link to={`/product/${p.id || p._id}`}>
                   <div className="product-card-img-wrapper">
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div className="quick-look-overlay">
                         <span className="quick-look-btn">Quick View</span>
                      </div>
                   </div>
                 </Link>
                 <button 
                    onClick={() => { toggleWishlist(p); showToast(wishlist.find(x => String(x.id || x._id) === String(p.id || p._id)) ? 'Removed from wishlist' : 'Added to wishlist'); }}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'white', border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
                 >
                   <Heart size={20} fill={wishlist.find(x => String(x.id || x._id) === String(p.id || p._id)) ? "#ef4444" : "none"} color={wishlist.find(x => String(x.id || x._id) === String(p.id || p._id)) ? "#ef4444" : "#000"} />
                 </button>
              </div>

              <div style={{ padding: '0 0.5rem' }}>
                <Link to={`/product/${p.id || p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 500 }}>{p.name}</h3>
                    <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>${p.price}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>{p.category}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-gold)' }}>
                      <Star size={14} fill="var(--accent-gold)" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.rating}</span>
                    </div>
                  </div>
                </Link>
                
                <button 
                  className="btn" 
                  style={{ width: '100%', marginTop: '2.5rem', padding: '1.2rem', borderRadius: '40px', fontSize: '0.8rem' }}
                  onClick={() => handleAddToCart(p)}
                >
                  Add to Bag
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;

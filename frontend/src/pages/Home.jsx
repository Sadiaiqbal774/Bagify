import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Star } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const revealRefs = useRef([]);

 useEffect(() => {
  const fetchFeatured = async () => {
    try {
      const { data } = await axios.get('/api/products');

      const productsArray = Array.isArray(data)
        ? data
        : data.products || [];

      setFeaturedProducts(productsArray.slice(0, 3));
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
    }
  };

  fetchFeatured();
}, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    revealRefs.current.forEach(ref => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [featuredProducts]);

  const handleAddToCart = (p) => {
    addToCart(p);
    showToast(`Added ${p.name} to your selection.`);
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      <SEO title="Home" description="Premium Bags for Modern Life." />

      <section className="home-hero-video">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="hero-bg-video"
          poster="https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=2000"
        >
          <source src="https://player.vimeo.com/external/494200424.hd.mp4?s=3401c107f9c87895f36e89a4254f15d97f2e146c&profile_id=175" type="video/mp4" />
        </video>
        <div className="hero-video-overlay"></div>
        <div className="hero-content">
          <span className="reveal" ref={el => revealRefs.current[4] = el} style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)' }}>Art of the Artifact</span>
          <h1 className="reveal" ref={el => revealRefs.current[5] = el} style={{ fontSize: '7rem', fontWeight: 300, lineHeight: 1, margin: '2.5rem 0' }}>Absolute Luxury<span>.</span></h1>
          <div className="reveal" ref={el => revealRefs.current[6] = el}>
            <Link to="/products" className="btn-modern-cta">Enter the Collection</Link>
          </div>
        </div>
      </section>

      {/* Modern Scrolling Marquee */}
      <section className="marquee-section">
        <div className="marquee">
          <div className="marquee-content">
            <span>BAGIFY ELITE</span>
            <span>MAISON LUXE</span>
            <span>CRAFTED IN ITALY</span>
            <span>FULL GRAIN LEATHER</span>
            <span>BAGIFY ELITE</span>
            <span>MAISON LUXE</span>
            <span>CRAFTED IN ITALY</span>
            <span>FULL GRAIN LEATHER</span>
          </div>
        </div>
      </section>

      {/* AI Concierge Section */}
      <section className="ai-concierge-section reveal" ref={el => revealRefs.current[7] = el}>
        <div className="container ai-grid">
           <div className="ai-visual">
             <div className="ai-glow-orb"></div>
             <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1000" alt="Consulting" />
           </div>
           <div className="ai-copy">
             <span className="ai-label">Next-Gen Shopping</span>
             <h2>Your Personal Stylist, <br/>Powered by AI.</h2>
             <p>Need the perfect match for your tailored suit? Or a rugged companion for a weekend in the Alps? Our AI Concierge understands your lifestyle.</p>
             <button 
               className="btn-ai-trigger"
               onClick={() => window.toggleBagifyChat(true)}
             >
               Consult our Stylist
             </button>
           </div>
        </div>
      </section>

      <section style={{ padding: '8rem 4rem' }} className="reveal" ref={el => revealRefs.current[1] = el}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '2.5rem' }}>The Collections</h2>
          <div style={{ width: '60px', height: '2px', background: 'var(--accent-gold)', margin: '1.5rem auto' }}></div>
        </div>

        <div className="home-collections-grid">
          <div className="product-card-premium" style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
             <img src="/images/backpack.png" alt="Backpacks" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white' }}>
               <h3 style={{ fontSize: '2rem' }}>Urban Backpacks</h3>
               <Link to="/products" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', textDecoration: 'none' }}>
                 Shop Now <ArrowRight size={18} />
               </Link>
             </div>
          </div>
          <div className="product-card-premium" style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
             <img src="/images/handbag.png" alt="Handbags" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white' }}>
               <h3 style={{ fontSize: '2rem' }}>Luxury Handbags</h3>
               <Link to="/products" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', textDecoration: 'none' }}>
                 Shop Now <ArrowRight size={18} />
               </Link>
             </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '8rem 4rem', backgroundColor: 'var(--bg-secondary)' }} className="reveal" ref={el => revealRefs.current[2] = el}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem' }}>
            <div>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Selected for you</span>
              <h2 style={{ fontSize: '3rem', marginTop: '1rem' }}>Trending Now</h2>
            </div>
            <Link to="/products" className="nav-link" style={{ fontSize: '0.9rem' }}>View Entire Collection →</Link>
          </div>

          <div className="home-trending-grid">
            {featuredProducts.map((p, idx) => (
              <div key={p.id || p._id} className="product-card-premium">
                <Link to={`/product/${p.id || p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-card-img-wrapper" style={{ marginBottom: '2rem' }}>
                     <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '0 0.5rem' }}>
                    <h3 style={{ fontSize: '1.3rem', margin: '0.5rem 0', fontWeight: 500 }}>{p.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>${p.price}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-gold)' }}>
                        <Star size={14} fill="var(--accent-gold)" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                <button onClick={() => handleAddToCart(p)} className="btn" style={{ marginTop: '1.5rem', width: '100%', padding: '1rem', background: 'none', border: '1px solid var(--border-color)', borderRadius: '40px', color: 'var(--text-primary)', fontSize: '0.8rem' }}>
                  Add to Bag
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '8rem 4rem', textAlign: 'center' }} className="reveal" ref={el => revealRefs.current[3] = el}>
        <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Ready to Find Your Match?</h2>
        <Link to="/products" className="btn" style={{ padding: '1.5rem 4rem' }}>View All Products</Link>
      </section>

    </div>
  );
};

export default Home;

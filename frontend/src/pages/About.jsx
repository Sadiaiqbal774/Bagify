import React, { useEffect, useRef } from 'react';
import SEO from '../components/SEO';
import { Award, ShieldCheck, Zap, Heart } from 'lucide-react';

const About = () => {
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    revealRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      <SEO title="Our Story" description="Discover the heritage and craftsmanship behind Bagify." />
      
      {/* Cinematic Hero */}
      <section className="about-hero" style={{ height: '80vh', position: 'relative', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=2000" 
          alt="Leather Crafting" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))' }}></div>
        <div className="hero-content container" style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', color: 'white' }}>
          <span className="reveal" ref={el => revealRefs.current[0] = el} style={{ textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)' }}>Our Heritage</span>
          <h1 className="reveal" ref={el => revealRefs.current[1] = el} style={{ fontSize: '5rem', marginTop: '1rem', fontWeight: 300 }}>Artistry in Motion<span>.</span></h1>
        </div>
      </section>

      {/* Philosophy Section */}
      <section style={{ padding: '10rem 0' }}>
        <div className="container">
          <div className="about-philosophy-grid">
            <div className="reveal" ref={el => revealRefs.current[2] = el}>
              <h2 style={{ fontSize: '3rem', marginBottom: '2.5rem' }}>Born from a Passion for Perfection</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Founded in 2024, Bagify was born out of a simple realization: the tools of our daily commute should be as inspiring as the journeys themselves. We didn't just want to create another bag; we wanted to create a companion for the modern soul.
              </p>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-tertiary)', lineHeight: 1.8 }}>
                Every stitch, every fold, and every choice of material is deliberate. We source only the finest full-grain leathers and sustainable textiles, ensuring that each piece doesn't just age—it develops a story unique to you.
              </p>
            </div>
            <div className="reveal" ref={el => revealRefs.current[3] = el}>
              <div style={{ position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?auto=format&fit=crop&q=80&w=1000" alt="Process" style={{ width: '100%', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-xl)' }} />
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', background: 'var(--accent-gold)', color: '#000', padding: '2rem', borderRadius: '50%', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem', textAlign: 'center', textTransform: 'uppercase' }}>
                  Ethically Sourced
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section style={{ padding: '10rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '8rem' }} className="reveal" ref={el => revealRefs.current[4] = el}>
            <h2 style={{ fontSize: '3.5rem' }}>The Four Pillars</h2>
            <div style={{ width: '80px', height: '2px', background: 'var(--accent-gold)', margin: '2rem auto' }}></div>
          </div>

          <div className="about-pillars-grid">
            {[
              { icon: <Award size={40} />, title: "Exquisite Craft", desc: "Meticulously stitched by master artisans with decades of experience." },
              { icon: <ShieldCheck size={40} />, title: "Lifetime Promise", desc: "Designed to endure. We stand by the longevity of every artifact we create." },
              { icon: <Zap size={40} />, title: "Modern Utility", desc: "Thoughtful compartments for the technology and tools of the 21st century." },
              { icon: <Heart size={40} />, title: "Conscious Luxury", desc: "Committed to low-impact production and fair wages across our supply chain." }
            ].map((v, i) => (
              <div key={i} className="reveal text-center" ref={el => revealRefs.current[5 + i] = el} style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-gold)', marginBottom: '2rem', display: 'inline-block' }}>{v.icon}</div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 600 }}>{v.title}</h3>
                <p style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section style={{ padding: '12rem 0', textAlign: 'center' }} className="reveal" ref={el => revealRefs.current[9] = el}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '3rem' }}>Be Part of the Journey.</h2>
          <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', marginBottom: '4rem' }}>
            Stay updated with our latest releases and behind-the-scenes stories of our workshop.
          </p>
          <div className="newsletter-box" style={{ background: 'white', padding: '1rem', borderRadius: '60px', display: 'flex', boxShadow: 'var(--shadow-lg)' }}>
            <input type="email" placeholder="Your email address" style={{ flex: 1, border: 'none', padding: '0 2rem', fontSize: '1rem', outline: 'none' }} />
            <button className="btn" style={{ padding: '1.2rem 3rem', borderRadius: '50px' }}>Join the Guild</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

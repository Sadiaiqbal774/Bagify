import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Globe, ShieldCheck, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-premium">
      <div className="container">
        <div className="footer-top">
          <div className="footer-col-brand">
            <Link to="/" className="footer-logo">Bagify<span>.</span></Link>
            <p className="footer-signature">
              Curated Artifacts for the Modern Individual. Handcrafted heritage meeting twenty-first-century utility.
            </p>
            <div className="footer-social-minimal">
              <a href="#"><Instagram size={18} /></a>
              <a href="#"><Twitter size={18} /></a>
              <a href="#"><Facebook size={18} /></a>
            </div>
          </div>

          <div className="footer-col-links">
            <div className="footer-link-group">
              <h5 className="footer-heading">Maison</h5>
              <Link to="/products">Collections</Link>
              <Link to="/about">Our Story</Link>
              <Link to="/profile">Journal</Link>
            </div>
            <div className="footer-link-group">
              <h5 className="footer-heading">Support</h5>
              <a href="#">Shipping</a>
              <a href="#">Returns</a>
              <a href="#">Concierge</a>
            </div>
          </div>

          <div className="footer-col-newsletter">
             <h5 className="footer-heading">Signatory</h5>
             <p style={{fontSize: '0.8rem', opacity: 0.6, marginBottom: '1.5rem'}}>Join the guild for exclusive releases.</p>
             <div className="newsletter-minimal">
               <input type="email" placeholder="Email Address" />
               <button><ArrowRight size={18} /></button>
             </div>
          </div>
        </div>

        <div className="footer-bottom-refinement">
          <div style={{display: 'flex', gap: '2rem', fontSize: '0.7rem', opacity: 0.4, letterSpacing: '0.1em'}}>
            <span>&copy; {new Date().getFullYear()} BAGIFY INTERNATIONAL</span>
            <span>PRIVACY</span>
            <span>TERMS</span>
          </div>
          <div className="footer-badges-minimal">
             <ShieldCheck size={14} /> <span>SSL ENCRYPTED</span>
             <Globe size={14} /> <span>GLOBAL LOGISTICS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

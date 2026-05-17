import React from 'react';

export const SkeletonCard = () => (
  <div className="product-card-premium">
    <div className="skeleton" style={{ height: '480px', borderRadius: 'var(--border-radius-md)', marginBottom: '2.5rem' }}></div>
    <div style={{ padding: '0 0.5rem' }}>
      <div className="skeleton" style={{ height: '1.5rem', width: '70%', marginBottom: '1rem' }}></div>
      <div className="skeleton" style={{ height: '1rem', width: '40%', marginBottom: '2rem' }}></div>
      <div className="skeleton" style={{ height: '3rem', width: '100%', borderRadius: '40px' }}></div>
    </div>
  </div>
);

export const SkeletonDetail = () => (
  <div className="container" style={{ padding: '8rem 0' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8rem' }}>
      <div className="skeleton" style={{ height: '800px', borderRadius: 'var(--border-radius-lg)' }}></div>
      <div style={{ paddingTop: '2rem' }}>
        <div className="skeleton" style={{ height: '1rem', width: '20%', marginBottom: '2rem' }}></div>
        <div className="skeleton" style={{ height: '4rem', width: '80%', marginBottom: '2rem' }}></div>
        <div className="skeleton" style={{ height: '3rem', width: '30%', marginBottom: '4rem' }}></div>
        <div className="skeleton" style={{ height: '10rem', width: '100%', marginBottom: '4rem' }}></div>
        <div className="skeleton" style={{ height: '4rem', width: '100%', borderRadius: '50px' }}></div>
      </div>
    </div>
  </div>
);

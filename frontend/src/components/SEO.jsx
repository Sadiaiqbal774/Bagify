import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | Bagify` : 'Bagify | Modern E-Commerce'}</title>
      <meta name="description" content={description || 'Premium bags and accessories for modern living.'} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Open Graph Tags for better social media sharing */}
      <meta property="og:title" content={title ? `${title} | Bagify` : 'Bagify'} />
      <meta property="og:description" content={description || 'Premium bags and accessories.'} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEO;

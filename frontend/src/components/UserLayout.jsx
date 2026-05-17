import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Chatbot from './Chatbot';
import CartDrawer from './CartDrawer';
import CustomCursor from './CustomCursor';

const UserLayout = () => {
  return (
    <div className="app-container">
      <CustomCursor />
      <Header />
      <CartDrawer />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default UserLayout;

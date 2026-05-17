import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Layouts
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';

// Public/User Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import About from './pages/About';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import ProductDetail from './pages/ProductDetail';
import AdminProductForm from './pages/AdminProductForm';
import CheckoutSuccess from './pages/CheckoutSuccess';

import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* User Facing Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="about" element={<About />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout-success" element={<CheckoutSuccess />} />
          <Route path="login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        </Route>

        {/* Admin Dashboard Routes */}
        {user && user.role === 'admin' && (
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/create" element={<AdminProductForm />} />
            <Route path="products/edit/:id" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        )}

        {/* Catch-all/404 handling can go here */}
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;

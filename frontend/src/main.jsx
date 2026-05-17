import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import axios from 'axios'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import App from './App.jsx'
import './index.css'


axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
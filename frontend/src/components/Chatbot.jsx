import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your Bagify Personal Shopper. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
     if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    window.toggleBagifyChat = (state) => {
      setIsOpen(state !== undefined ? state : !isOpen);
    };
    return () => delete window.toggleBagifyChat;
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const { data } = await axios.post('/api/ai/chat', { 
        message: input, 
        cartItems 
      });
      
      if (data.action === 'ADD_TO_CART' && data.actionProduct) {
        addToCart(data.actionProduct);
      } else if (data.action === 'REMOVE_FROM_CART' && data.actionProduct) {
        removeFromCart(data.actionProduct.id || data.actionProduct._id);
      }

      setMessages(prev => [...prev, { 
        text: data.reply, 
        sender: 'ai',
        products: data.products,
        action: data.action
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Sorry, my brain is offline. Please try again later.", sender: 'ai' }]);
    }
  };

  const handleQuickAction = async (cmd) => {
    const userMsg = { text: cmd, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    try {
      const { data } = await axios.post('/api/ai/chat', { message: cmd, cartItems });
      setMessages(prev => [...prev, { text: data.reply, sender: 'ai', products: data.products, action: data.action }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error executing command.", sender: 'ai' }]);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button className="chatbot-launcher-modern" onClick={() => setIsOpen(true)}>
          <img src="/images/hero.png" style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white'}} />
          <span>Chat with AI</span>
        </button>
      ) : (
        <div className="chatbot-window-modern">
          <div className="chatbot-header-modern">
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
               <div className="ai-status-dot"></div>
               <div>
                 <h4 style={{margin: 0, textTransform: 'none', letterSpacing: '0'}}>Bagify Agent</h4>
                 <span style={{fontSize: '0.7rem', opacity: 0.8}}>Active Now</span>
               </div>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>

          <div className="chatbot-messages-modern">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`chat-bubble-modern ${msg.sender === 'ai' ? 'ai-bubble-modern' : 'user-bubble-modern'}`}>
                  {msg.text}
                </div>
                
                {msg.action === 'OPEN_ANALYTICS' && (
                  <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.5rem' }}>
                    <Link to="/dashboard/analytics" style={{ background: 'var(--accent-gold)', color: '#000', padding: '0.6rem 1.2rem', fontSize: '0.8rem', fontWeight: 800, borderRadius: '50px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 15px rgba(197,160,89,0.3)' }} onClick={() => setIsOpen(false)}>
                      📊 Open AI Analytics Dashboard
                    </Link>
                  </div>
                )}

                {msg.action === 'VIEW_PRICING_SUGGESTION' && (
                  <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleQuickAction("Apply price drop for Parisienne to 215")} 
                      style={{ background: 'var(--accent-gold)', color: '#000', padding: '0.6rem 1.2rem', fontSize: '0.8rem', fontWeight: 800, borderRadius: '50px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 15px rgba(197,160,89,0.3)' }}
                    >
                      ⚡ Execute $215 Price Drop Now
                    </button>
                  </div>
                )}

                {msg.products && msg.products.length > 0 && (
                  <div className="chat-products-container" style={{ marginTop: '0.5rem' }}>
                    {msg.products.map(p => (
                      <Link key={p.id || p._id} to={`/product/${p.id || p._id}`} className="chat-product-card" onClick={() => setIsOpen(false)}>
                        <div className="chat-product-img">
                          <img src={p.image} alt={p.name} />
                        </div>
                        <div className="chat-product-info">
                          <h5>{p.name}</h5>
                          <span>${p.price}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chatbot-input-modern">
            <input 
              placeholder="Ask me anything..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
            />
            <button type="submit"><Send size={18} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

import React, { useState, useEffect, useRef, useContext } from 'react';
import { X, Send, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const USER_GREETING =
  'Hello! I am your Bagify Personal Shopper. How can I help you today?';

const ADMIN_GREETING =
  'Welcome back, Admin. I can run live inventory analytics — out of stock, low stock, pricing optimizations, and apply price changes. What would you like to check?';

const ADMIN_QUICK_ACTIONS = [
  { label: 'Store Overview', cmd: 'Show store analytics overview' },
  { label: 'Out of Stock', cmd: 'Show out of stock items' },
  { label: 'Low Stock', cmd: 'Show low stock and reorder alerts' },
  { label: 'Pricing AI', cmd: 'Show pricing optimization suggestions' },
  { label: 'Full Report', cmd: 'Give me the full inventory report' },
];

const formatBubbleText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

const AdminStockPanel = ({ outOfStock = [], stockRisks = [] }) => {
  const rows = [...outOfStock, ...stockRisks];
  if (!rows.length) return null;
  return (
    <div className="chat-admin-panel">
      {rows.slice(0, 6).map((item) => (
        <div key={item.id} className="chat-admin-stock-row">
          {item.image && <img src={item.image} alt="" className="chat-admin-thumb" />}
          <div className="chat-admin-stock-meta">
            <strong>{item.name}</strong>
            <span>
              {item.stock} units · {item.riskLevel}
              {item.estDaysLeft > 0 ? ` · ~${item.estDaysLeft}d left` : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminPricingPanel = ({ items = [], onApply }) => {
  if (!items.length) return null;
  return (
    <div className="chat-admin-panel">
      {items.slice(0, 5).map((p) => (
        <div key={p.id} className="chat-admin-price-row">
          <div>
            <strong>{p.name}</strong>
            <span>
              ${p.currentPrice} → ${p.suggestedPrice} · {p.urgency}
            </span>
          </div>
          <button type="button" className="chat-admin-apply-btn" onClick={() => onApply(p)}>
            Apply ${p.suggestedPrice}
          </button>
        </div>
      ))}
    </div>
  );
};

const Chatbot = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: USER_GREETING, sender: 'ai' }]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    setMessages([{ text: isAdmin ? ADMIN_GREETING : USER_GREETING, sender: 'ai' }]);
  }, [isAdmin]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { text, sender: 'user' }]);

    try {
      const { data } = await axios.post('/api/ai/chat', {
        message: text,
        cartItems,
        isAdmin,
      });

      if (data.action === 'ADD_TO_CART' && data.actionProduct) {
        addToCart(data.actionProduct);
      } else if (data.action === 'REMOVE_FROM_CART' && data.actionProduct) {
        removeFromCart(data.actionProduct.id || data.actionProduct._id);
      }

      setMessages((prev) => [
        ...prev,
        {
          text: data.reply,
          sender: 'ai',
          products: data.products,
          action: data.action,
          adminPanel: data.adminPanel,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, my brain is offline. Please try again later.', sender: 'ai' },
      ]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  const handleQuickAction = (cmd) => sendMessage(cmd);

  const handleApplyPrice = (item) => {
    handleQuickAction(`Apply price drop for ${item.name} to ${item.suggestedPrice}`);
  };

  const showProductCards = (msg) => {
    if (!msg.products?.length) return false;
    if (!msg.adminPanel) return true;
    const t = msg.adminPanel.type;
    return t !== 'stock' && t !== 'outOfStock' && t !== 'inventory' && t !== 'full';
  };

  return (
    <div className={`chatbot-container ${isAdmin ? 'chatbot-admin-mode' : ''}`}>
      {!isOpen ? (
        <button type="button" className="chatbot-launcher-modern" onClick={() => setIsOpen(true)}>
          <img
            src="/images/hero.png"
            alt=""
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid white',
            }}
          />
          <span>{isAdmin ? 'Admin AI' : 'Chat with AI'}</span>
        </button>
      ) : (
        <div className="chatbot-window-modern">
          <div className="chatbot-header-modern">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="ai-status-dot" />
              <div>
                <h4 style={{ margin: 0, textTransform: 'none', letterSpacing: 0 }}>
                  {isAdmin ? 'Bagify Admin Agent' : 'Bagify Agent'}
                </h4>
                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                  {isAdmin ? 'Inventory & Analytics' : 'Active Now'}
                </span>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages-modern">
            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  className={`chat-bubble-modern ${msg.sender === 'ai' ? 'ai-bubble-modern' : 'user-bubble-modern'}`}
                >
                  {formatBubbleText(msg.text)}
                </div>

                {msg.action === 'OPEN_ANALYTICS' && isAdmin && (
                  <div className="chat-action-row">
                    <Link
                      to="/dashboard/analytics"
                      className="chat-action-link"
                      onClick={() => setIsOpen(false)}
                    >
                      <BarChart3 size={14} /> Open AI Analytics Dashboard
                    </Link>
                  </div>
                )}

                {msg.adminPanel &&
                  ['stock', 'outOfStock', 'inventory', 'full'].includes(msg.adminPanel.type) && (
                    <AdminStockPanel
                      outOfStock={msg.adminPanel.outOfStock}
                      stockRisks={msg.adminPanel.stockRisks}
                    />
                  )}

                {msg.adminPanel &&
                  ['pricing', 'full'].includes(msg.adminPanel.type) && (
                    <AdminPricingPanel
                      items={msg.adminPanel.pricingSuggestions}
                      onApply={handleApplyPrice}
                    />
                  )}

                {showProductCards(msg) && (
                  <div className="chat-products-container" style={{ marginTop: '0.5rem' }}>
                    {msg.products.map((p) => (
                      <Link
                        key={p.id || p._id}
                        to={`/product/${p.id || p._id}`}
                        className="chat-product-card"
                        onClick={() => setIsOpen(false)}
                      >
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

          {isAdmin && (
            <div className="chat-admin-quick-actions">
              {ADMIN_QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa.label}
                  type="button"
                  className="chat-quick-chip"
                  onClick={() => handleQuickAction(qa.cmd)}
                >
                  {qa.label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="chatbot-input-modern">
            <input
              placeholder={
                isAdmin ? 'e.g. low stock, out of stock, pricing...' : 'Ask me anything...'
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" aria-label="Send">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

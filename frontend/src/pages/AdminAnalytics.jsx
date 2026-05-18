import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SEO from '../components/SEO';
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  CheckCircle2, 
  BarChart3, 
  Zap, 
  RefreshCw, 
  ArrowDownRight, 
  PackageX,
  ArrowUpRight,
  ShieldCheck,
  TrendingDown,
  PieChart,
  Activity,
  ShoppingBag
} from 'lucide-react';

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adjustingId, setAdjustingId] = useState(null);
  const [successToast, setSuccessToast] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'stock', 'pricing'

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/api/ai/inventory-analytics');
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Unable to load AI analytics models. Please ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPriceDrop = async (productId, suggestedPrice) => {
    setAdjustingId(productId);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/apply-price-adjustment', {
        productId,
        newPrice: suggestedPrice
      });
      
      setSuccessToast(res.data.message);
      setTimeout(() => setSuccessToast(null), 4000);

      // Re-fetch data to reflect updated pricing and AI models
      await fetchAnalytics();
    } catch (err) {
      console.error('Failed to apply price drop:', err);
      alert('Error applying price drop. Please try again.');
    } finally {
      setAdjustingId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-analytics-loading">
        <div className="ai-pulse-spinner">
          <Brain size={48} className="ai-icon-spin" />
        </div>
        <h3 style={{ marginTop: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Initializing Gemini AI Analytics Engine...
        </h3>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Running predictive models on sales velocity & stock exhaustion vectors.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-analytics-error">
        <AlertTriangle size={48} style={{ color: '#ef4444' }} />
        <h3 style={{ marginTop: '1rem', fontWeight: 700 }}>AI Engine Disconnected</h3>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{error}</p>
        <button onClick={fetchAnalytics} className="admin-btn-primary" style={{ marginTop: '1.5rem' }}>
          <RefreshCw size={16} /> Retry Connection
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { summary, stockRisks, pricingSuggestions, graphicalData } = data;

  return (
    <>
      <SEO title="AI Inventory & Analytics | Bagify Admin" description="Gemini AI powered inventory forecasting and price optimization" />

      {successToast && (
        <div className="ai-toast-notification">
          <CheckCircle2 size={20} style={{ color: '#10b981' }} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="admin-page-header">
        <div className="header-title-wrapper">
          <div className="ai-badge-pill">
            <Sparkles size={14} /> Gemini 3.5 AI Embedded
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.5rem' }}>
            AI Inventory Control & Analytics
          </h1>
          <p style={{ color: 'var(--text-tertiary)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
            Real-time demand forecasting, out-of-stock risk assessment, and autonomous price optimization.
          </p>
        </div>
        <button onClick={fetchAnalytics} className="admin-icon-btn tooltip-parent" title="Refresh AI Predictions">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* AI Summary Banner */}
      <div className="ai-insights-hero-banner">
        <div className="ai-banner-content">
          <div className="ai-banner-icon">
            <Brain size={28} />
          </div>
          <div>
            <h3 className="ai-banner-title">Upcoming Top Performing Category: {summary.upcomingTopCategory.name}</h3>
            <p className="ai-banner-desc">
              {summary.upcomingTopCategory.reason}
            </p>
          </div>
        </div>
        <div className="ai-banner-stats">
          <div className="ai-banner-stat-box">
            <span className="stat-label">Stockout Risks</span>
            <span className="stat-num alert">{summary.stockoutRiskCount} Critical</span>
          </div>
          <div className="ai-banner-stat-box">
            <span className="stat-label">Price Anomalies</span>
            <span className="stat-num warn">{summary.priceOptimizationCount} Detected</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs-bar">
        <button 
          className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 size={18} /> Analytics Overview
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          <PackageX size={18} /> Out-of-Stock Forecast ({stockRisks.length})
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          <DollarSign size={18} /> Price Optimization ({pricingSuggestions.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & EMBEDDED GRAPHICAL REPRESENTATIONS */}
      {activeTab === 'overview' && (
        <div className="analytics-tab-content">
          {/* Quick Cards Grid */}
          <div className="ai-cards-grid">
            <div className="ai-insight-card">
              <div className="card-top">
                <span className="ai-card-tag success">High Sales Velocity</span>
                <TrendingUp size={20} style={{ color: '#10b981' }} />
              </div>
              <h4 className="ai-card-title">Handbags Collection</h4>
              <p className="ai-card-val">+28.4% Growth</p>
              <div className="ai-progress-bar">
                <div className="ai-progress-fill" style={{ width: '88%', background: '#10b981' }}></div>
              </div>
              <p className="ai-card-subtext">88/100 AI Momentum Score</p>
            </div>

            <div className="ai-insight-card">
              <div className="card-top">
                <span className="ai-card-tag warning">Stockout Warning</span>
                <AlertTriangle size={20} style={{ color: '#ef4444' }} />
              </div>
              <h4 className="ai-card-title">Arctic Voyager Backpack</h4>
              <p className="ai-card-val">7 Units Left</p>
              <div className="ai-progress-bar">
                <div className="ai-progress-fill" style={{ width: '25%', background: '#ef4444' }}></div>
              </div>
              <p className="ai-card-subtext">Estimated 3 days until complete stockout</p>
            </div>

            <div className="ai-insight-card">
              <div className="card-top">
                <span className="ai-card-tag gold">Price Opportunity</span>
                <DollarSign size={20} style={{ color: 'var(--accent-gold)' }} />
              </div>
              <h4 className="ai-card-title">Parisienne Burgundy</h4>
              <p className="ai-card-val">Current $240</p>
              <div className="ai-progress-bar">
                <div className="ai-progress-fill" style={{ width: '65%', background: 'var(--accent-gold)' }}></div>
              </div>
              <p className="ai-card-subtext">Drop to $215 suggested (+38% velocity boost)</p>
            </div>
          </div>

          {/* Graphical Multi-Grid */}
          <div className="analytics-multi-grid">
            {/* Chart 1: 7-Day Projected Category Demand Forecast */}
            <div className="admin-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-card-title">7-Day Demand Forecast</h3>
                  <p className="chart-card-subtitle">AI simulation based on user search velocity & seasonal vectors</p>
                </div>
                <div className="chart-legend">
                  <span className="legend-item"><span className="legend-dot" style={{ background: '#c5a059' }}></span>Handbags</span>
                  <span className="legend-item"><span className="legend-dot" style={{ background: '#6366f1' }}></span>Backpacks</span>
                </div>
              </div>

              <div className="svg-chart-container">
                <svg viewBox="0 0 800 320" className="animated-trend-chart">
                  <defs>
                    <linearGradient id="handbags-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c5a059" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#c5a059" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="backpacks-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="60" y1="40" x2="760" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  <line x1="60" y1="110" x2="760" y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  <line x1="60" y1="180" x2="760" y2="180" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  <line x1="60" y1="250" x2="760" y2="250" stroke="rgba(255,255,255,0.1)" />

                  <text x="45" y="45" fill="var(--text-tertiary)" fontSize="11" textAnchor="end">60 units</text>
                  <text x="45" y="115" fill="var(--text-tertiary)" fontSize="11" textAnchor="end">40 units</text>
                  <text x="45" y="185" fill="var(--text-tertiary)" fontSize="11" textAnchor="end">20 units</text>
                  <text x="45" y="255" fill="var(--text-tertiary)" fontSize="11" textAnchor="end">0</text>

                  {graphicalData.demandTrends.map((d, idx) => {
                    const x = 100 + idx * 105;
                    return (
                      <g key={d.day}>
                        <text x={x} y="275" fill="var(--text-secondary)" fontSize="12" fontWeight="600" textAnchor="middle">{d.day}</text>
                      </g>
                    );
                  })}

                  <path d="M100,210 L205,190 L310,170 L415,130 L520,80 L625,35 L730,15 L730,250 L100,250 Z" fill="url(#handbags-grad)" />
                  <path d="M100,210 L205,190 L310,170 L415,130 L520,80 L625,35 L730,15" fill="none" stroke="#c5a059" strokeWidth="3.5" strokeLinecap="round" className="chart-line-anim" />

                  <path d="M100,230 L205,215 L310,195 L415,200 L520,150 L625,115 L730,85 L730,250 L100,250 Z" fill="url(#backpacks-grad)" />
                  <path d="M100,230 L205,215 L310,195 L415,200 L520,150 L625,115 L730,85" fill="none" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" className="chart-line-anim-2" />

                  <circle cx="730" cy="15" r="6" fill="#c5a059" stroke="#121216" strokeWidth="3" />
                  <circle cx="730" cy="85" r="6" fill="#6366f1" stroke="#121216" strokeWidth="3" />
                </svg>
              </div>
              
              <div className="chart-footer-insight">
                <Sparkles size={16} className="accent-gold" />
                <span>Handbag sales modeled to spike <strong>+28.4%</strong> toward weekend due to Parisienne campaign.</span>
              </div>
            </div>

            {/* Chart 2: Category Share & Revenue Distribution */}
            <div className="admin-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-card-title">Category Revenue Share</h3>
                  <p className="chart-card-subtitle">Real-time revenue distribution & product momentum</p>
                </div>
                <PieChart size={24} style={{ color: 'var(--accent-gold)' }} />
              </div>

              <div className="donut-chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '1.5rem 0', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ position: 'relative', width: '220px', height: '220px' }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="rgba(0,0,0,0.05)" strokeWidth="14" />
                    {/* Handbags: 55% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#c5a059" strokeWidth="14" strokeDasharray={`${55 * 2.387} 238.7`} strokeDashoffset="0" strokeLinecap="round" style={{ transition: 'all 1s ease' }} />
                    {/* Backpacks: 30% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#6366f1" strokeWidth="14" strokeDasharray={`${30 * 2.387} 238.7`} strokeDashoffset={`-${55 * 2.387}`} strokeLinecap="round" style={{ transition: 'all 1s ease' }} />
                    {/* Urban & Tech: 15% */}
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="14" strokeDasharray={`${15 * 2.387} 238.7`} strokeDashoffset={`-${85 * 2.387}`} strokeLinecap="round" style={{ transition: 'all 1s ease' }} />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>$48.2K</span>
                    <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>Total Monthly</span>
                  </div>
                </div>

                <div className="share-breakdown-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', minWidth: '180px', flex: 1 }}>
                  {graphicalData.categoryShare.map(c => (
                    <div key={c.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: c.color }}></span>
                          {c.name}
                        </span>
                        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{c.share}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div style={{ width: `${c.share}%`, height: '100%', background: c.color, borderRadius: '100px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-footer-insight">
                <Sparkles size={16} className="accent-gold" />
                <span>Handbags represent <strong>55%</strong> of gross merchandise value. Strong brand loyalty observed.</span>
              </div>
            </div>

            {/* Chart 3: Price Elasticity & Revenue Optimization Curve */}
            <div className="admin-chart-card">
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-card-title">Price Elasticity Curve</h3>
                  <p className="chart-card-subtitle">Optimal conversion vs. price escalation modeling</p>
                </div>
                <Activity size={24} style={{ color: '#10b981' }} />
              </div>

              <div className="svg-chart-container" style={{ position: 'relative' }}>
                <svg viewBox="0 0 800 320" className="animated-trend-chart">
                  <defs>
                    <linearGradient id="revenue-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="60" y1="40" x2="760" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  <line x1="60" y1="110" x2="760" y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  <line x1="60" y1="180" x2="760" y2="180" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  <line x1="60" y1="250" x2="760" y2="250" stroke="rgba(255,255,255,0.1)" />

                  <text x="45" y="45" fill="var(--text-tertiary)" fontSize="11" textAnchor="end">$20K</text>
                  <text x="45" y="115" fill="var(--text-tertiary)" fontSize="11" textAnchor="end">$18K</text>
                  <text x="45" y="185" fill="var(--text-tertiary)" fontSize="11" textAnchor="end">$16K</text>
                  <text x="45" y="255" fill="var(--text-tertiary)" fontSize="11" textAnchor="end">$14K</text>

                  {graphicalData.priceElasticityCurve.map((p, idx) => {
                    const x = 120 + idx * 140;
                    return (
                      <g key={p.pricePoint}>
                        <text x={x} y="275" fill={p.pricePoint.includes('Optimal') ? '#10b981' : 'var(--text-secondary)'} fontSize="12" fontWeight={p.pricePoint.includes('Optimal') ? '800' : '600'} textAnchor="middle">{p.pricePoint}</text>
                      </g>
                    );
                  })}

                  {/* Highlight Sweet Spot Line */}
                  <line x1="540" y1="30" x2="540" y2="250" stroke="#10b981" strokeWidth="2" strokeDasharray="6,4" />
                  <rect x="480" y="8" width="120" height="26" rx="13" fill="#10b981" />
                  <text x="540" y="25" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">AI SWEET SPOT</text>

                  {/* Revenue Curve */}
                  <path d="M120,75 L260,85 L400,115 L540,105 L680,240 L680,250 L120,250 Z" fill="url(#revenue-grad)" />
                  <path d="M120,75 L260,85 L400,115 L540,105 L680,240" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" className="chart-line-anim" />

                  {/* Points */}
                  <circle cx="120" cy="75" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="260" cy="85" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="400" cy="115" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="540" cy="105" r="8" fill="#10b981" stroke="#121216" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
                  <circle cx="680" cy="240" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                </svg>
              </div>

              <div className="chart-footer-insight">
                <Sparkles size={16} className="accent-gold" />
                <span>Lowering price from $240 to <strong>$215</strong> restores optimal elasticity, capturing <strong>+$3,875/week</strong>.</span>
              </div>
            </div>

            {/* Chart 4: Real-Time Inventory Exhaustion Velocity */}
            <div className="admin-chart-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="chart-card-header">
                  <div>
                    <h3 className="chart-card-title">Stock Exhaustion Velocity</h3>
                    <p className="chart-card-subtitle">Estimated days remaining until complete stockout</p>
                  </div>
                  <ShoppingBag size={24} style={{ color: '#ef4444' }} />
                </div>

                <div className="stock-exhaustion-bars" style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', margin: '1.5rem 0' }}>
                  {stockRisks.slice(0, 5).map(item => (
                    <div key={item.id} className="stock-risk-bar-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: item.badgeColor, background: `${item.badgeColor}18`, padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                          {item.estDaysLeft} Days Left ({item.stock} in stock)
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '10px', background: 'var(--bg-tertiary)', borderRadius: '100px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${Math.min((item.stock / 25) * 100, 100)}%`, 
                            height: '100%', 
                            background: item.badgeColor, 
                            borderRadius: '100px',
                            boxShadow: `0 0 10px ${item.badgeColor}60`,
                            transition: 'width 1s ease'
                          }}
                        ></div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Sales Velocity: {item.velocity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-footer-insight" style={{ borderColor: '#ef4444', background: 'rgba(239,68,68,0.06)' }}>
                <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                <span style={{ color: 'var(--text-secondary)' }}><strong>Critical Action:</strong> {stockRisks.filter(r => r.riskLevel === 'Critical').length} items require immediate purchase order dispatch.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OUT OF STOCK FORECAST */}
      {activeTab === 'stock' && (
        <div className="analytics-tab-content">
          <div className="admin-table-card">
            <div className="admin-table-header">
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Inventory Exhaustion Predictions</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
                  AI calculated stockout timelines based on 30-day moving average sales velocity.
                </p>
              </div>
            </div>

            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Sales Velocity</th>
                    <th>Est. Days Left</th>
                    <th>AI Risk Level</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {stockRisks.map((item) => (
                    <tr key={item.id} className={item.riskLevel === 'Critical' ? 'row-critical' : ''}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.category}</td>
                      <td>
                        <span className="stock-count-badge" style={{ color: item.stock <= 8 ? '#ef4444' : 'inherit', fontWeight: 700 }}>
                          {item.stock} units
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{item.velocity}</td>
                      <td style={{ fontWeight: 700, color: item.badgeColor }}>
                        {item.estDaysLeft} days
                      </td>
                      <td>
                        <span className="ai-risk-badge" style={{ background: `${item.badgeColor}18`, color: item.badgeColor }}>
                          {item.riskLevel}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                        {item.aiRecommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRICE OPTIMIZATION */}
      {activeTab === 'pricing' && (
        <div className="analytics-tab-content">
          <div className="ai-price-header-info">
            <Zap size={22} style={{ color: 'var(--accent-gold)' }} />
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Autonomous Price Elasticity Suggestions</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
                AI constantly monitors conversion vs price escalation. Click "Apply Suggested Drop" to instantly optimize pricing.
              </p>
            </div>
          </div>

          <div className="ai-pricing-grid">
            {pricingSuggestions.map((item) => (
              <div key={item.id} className={`ai-pricing-card ${item.urgency === 'Critical' ? 'critical-border' : ''}`}>
                <div className="card-header">
                  <div>
                    <span className={`urgency-pill ${item.urgency.toLowerCase()}`}>
                      {item.urgency} Urgency
                    </span>
                    <h4 className="prod-name">{item.name}</h4>
                  </div>
                </div>

                <div className="price-compare-box">
                  <div className="price-col">
                    <span className="price-label">Current Price</span>
                    <span className="price-val current">${item.currentPrice}</span>
                    <span className="price-trend escalation">
                      <TrendingUp size={14} /> {item.priceChange}
                    </span>
                  </div>
                  <div className="price-arrow">→</div>
                  <div className="price-col">
                    <span className="price-label">AI Suggested</span>
                    <span className="price-val optimal">${item.suggestedPrice}</span>
                    <span className="price-trend drop">
                      <TrendingDown size={14} /> Optimal
                    </span>
                  </div>
                </div>

                <div className="ai-rationale-box">
                  <Sparkles size={16} className="ai-gold-icon" />
                  <p>{item.rationale}</p>
                </div>

                <div className="card-actions">
                  <button 
                    className="ai-apply-btn"
                    onClick={() => handleApplyPriceDrop(item.id, item.suggestedPrice)}
                    disabled={adjustingId === item.id || item.currentPrice === item.suggestedPrice}
                  >
                    {adjustingId === item.id ? (
                      <span><RefreshCw size={14} className="spin" /> Applying...</span>
                    ) : item.currentPrice === item.suggestedPrice ? (
                      <span><ShieldCheck size={14} /> Already Optimized</span>
                    ) : (
                      <span><Zap size={14} /> Apply Suggested Drop (${item.suggestedPrice})</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminAnalytics;

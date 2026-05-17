const dbService = require('../services/dbService');

// Helper for finding products based on natural language
const searchProducts = (message, allProducts) => {
  let filtered = [...allProducts];
  let priceVal = null;
  let filterApplied = false;
  
  const priceRegex = /(?:under|below|less than|for|at|around|\$)\s*(\d+)/i;
  const priceRegexTrailing = /(\d+)\s*(?:\$|dollar|buck|usd)/i;
  const priceMatch = message.match(priceRegex) || message.match(priceRegexTrailing);
  
  if (priceMatch) {
    priceVal = parseInt(priceMatch[1]);
  } else {
    const plainNumberMatch = message.match(/\b(\d{2,4})\b/);
    if (plainNumberMatch) priceVal = parseInt(plainNumberMatch[1]);
  }
  
  if (priceVal) {
    filterApplied = true;
    const isUnder = /under|below|less than/i.test(message);
    if (isUnder) {
      filtered = filtered.filter(p => p.price <= priceVal);
    } else {
      let exactMatches = filtered.filter(p => p.price === priceVal);
      if (exactMatches.length > 0) {
        filtered = exactMatches;
      } else {
        filtered = [];
      }
    }
  }

  const categories = {
    backpack: 'Backpacks',
    travel: 'Backpacks',
    handbag: 'Handbags',
    tote: 'Handbags',
    purse: 'Handbags',
    bag: 'Handbags'
  };

  for (const [key, val] of Object.entries(categories)) {
    if (message.toLowerCase().includes(key)) {
      let catMatched = filtered.filter(p => p.category === val);
      if (catMatched.length > 0) {
        filtered = catMatched;
        filterApplied = true;
        break;
      }
    }
  }

  // Generic keyword fallback search
  if (!filterApplied || filtered.length > 0) {
     const words = message.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
     const commonStopWords = ['show', 'me', 'a', 'in', 'cart', 'under', 'for', 'at', 'add', 'remove', 'the', 'to', 'delete', 'drop', 'put', 'suggest', 'recommend', 'from'];
     const importantWords = words.filter(w => !commonStopWords.includes(w) && w.length > 2 && !parseInt(w));
     
     if (importantWords.length > 0) {
         let tempFiltered = filtered.filter(p => {
             const searchString = `${p.name} ${p.category} ${p.description || ''}`.toLowerCase();
             return importantWords.some(w => new RegExp(`\\b${w}\\b`).test(searchString));
         });
         
         if (tempFiltered.length > 0 && tempFiltered.length < filtered.length) {
             filtered = tempFiltered;
             filterApplied = true;
         } else if (tempFiltered.length === filtered.length && tempFiltered.length > 0) {
             // they matched all currently filtered items, we still say we applied a filter
             filterApplied = true;
         }
     }
  }

  return { filtered, priceVal, filterApplied };
};

/**
 * Advanced Intent Recognition & Extraction
 */
const detectIntent = (text) => {
  const msg = text.toLowerCase();
  
  if (msg.includes('shipping') || msg.includes('return') || msg.includes('payment')) return 'faq';
  if (msg.includes('track') || msg.includes('order') || msg.match(/bg-\d+/)) return 'track';
  
  // Add/Remove from cart detection
  if ((msg.includes('add') || msg.includes('put') || msg.includes('show') || msg.includes('suggest') || msg.includes('place')) && msg.includes('cart')) return 'cart_add';
  const isRemove = msg.includes('remove') || msg.includes('delete') || msg.includes('del') || msg.includes('drop');
  const isCart = msg.includes('cart') || msg.includes('card');
  if (isRemove && isCart) return 'cart_remove';
  
  if (msg.includes('coupon')) return 'cart_help';

  // Only pure "trending" goes to recommend, suggest flows to search
  if (msg.includes('trending')) return 'recommend';
  
  return 'search'; // Default to discovery
};

const handleChatRequest = async (req, res) => {
  try {
    const { message, cartItems = [] } = req.body;
    const intent = detectIntent(message);
    let products = [];
    let reply = '';
    let action = null;
    let actionProduct = null;

    switch (intent) {
      case 'faq':
        const faqs = dbService.find('faqs')[0] || {
          shipping: "Standard shipping takes 3-7 days.",
          returns: "30-day return policy.",
          payments: "We accept cards and PayPal."
        };
        if (message.includes('shipping')) reply = faqs.shipping;
        else if (message.includes('return')) reply = faqs.returns;
        else reply = faqs.payments;
        break;

      case 'track':
        const orderIdMatch = message.toUpperCase().match(/BG-\d+/);
        if (orderIdMatch) {
          const order = dbService.findOne('orders', { id: orderIdMatch[0] });
          if (order) {
            reply = `Found your order **${order.id}**! \n\n**Status**: ${order.status}\n**Update**: ${order.lastUpdate}\n**Timeline**: ${order.timeline.join(' → ')}`;
          } else {
            reply = "I couldn't find an order with that ID. Please double check your order number (it starts with BG-).";
          }
        } else {
          reply = "I can certainly track your order! Please provide your Order Number (e.g., BG-12345).";
        }
        break;

      case 'recommend':
        const trendingProducts = dbService.find('products').sort((a,b) => b.rating - a.rating);
        const trending = trendingProducts[0];
        reply = `Our current trending item is the **${trending.name}** (${trending.brand}). It has a ${trending.rating} star rating!`;
        products = [trending];
        break;

      case 'cart_help':
        reply = "I'm your assistant, I can help! To add items, just click the 'Add to Cart' button. Use code **WELCOME10** for 10% off!";
        break;

      case 'cart_add': {
        const allProds = dbService.find('products');
        const { filtered: addFiltered, filterApplied, priceVal } = searchProducts(message, allProds);
        
        if (filterApplied && addFiltered.length > 0) {
          actionProduct = addFiltered[0];
          reply = `I have added the **${actionProduct.name}** to your cart!`;
          action = 'ADD_TO_CART';
          products = [actionProduct];
        } else if (filterApplied && priceVal) {
          reply = `I couldn't find any items at the $${priceVal} price point to add to your cart.`;
        } else if (filterApplied) {
          reply = `I couldn't find an item matching that description to add to your cart.`;
        } else {
          reply = `Please specify which item you want to add to your cart (e.g., "add handbag to cart").`;
        }
        break;
      }

      case 'cart_remove': {
        if (!cartItems || cartItems.length === 0) {
            reply = "Your cart is already empty!";
            break;
        }

        const { filtered: removeFiltered, filterApplied } = searchProducts(message, cartItems);

        if (filterApplied && removeFiltered.length > 0) {
          actionProduct = removeFiltered[0];
          reply = `I have removed the **${actionProduct.name}** from your cart.`;
          action = 'REMOVE_FROM_CART';
        } else if (cartItems.length === 1) {
          actionProduct = cartItems[0];
          reply = `I have removed the **${actionProduct.name}** from your cart.`;
          action = 'REMOVE_FROM_CART';
        } else {
          reply = `Please specify which item you want to remove (e.g., "remove ${cartItems[0].name}").`;
        }
        break;
      }

      case 'search':
      default:
        const allProducts = dbService.find('products');
        const { filtered, priceVal } = searchProducts(message, allProducts);
        
        if (priceVal) {
          const isUnder = /under|below|less than/i.test(message);
          if (isUnder) {
            if (filtered.length > 0) {
              reply = `I've curated a selection of pieces under $${priceVal} for you:`;
            } else {
              reply = `We currently don't have any pieces under $${priceVal} in stock.`;
            }
          } else {
            if (filtered.length > 0) {
              reply = `Here are the beautiful pieces exactly at the $${priceVal} price point:`;
            } else {
              reply = `We do not have any bags exactly priced at $${priceVal} right now.`;
            }
          }
        } else {
          if (filtered.length > 0 && filtered.length < allProducts.length) {
              reply = `Here are the pieces matching your request:`;
          } else {
              reply = `I've selected some of our most sought-after pieces for you:`;
          }
        }
        
        // Finalize Response
        if (priceVal && filtered.length === 0) {
          products = [];
          // reply is already set to "We do not have any bags exactly priced at..."
        } else if (filtered.length > 0) {
          products = filtered.slice(0, 5);
        } else {
          reply = `I couldn't find an exact match for that specific request, but here are some of our latest arrivals:`;
          products = allProducts.slice(0, 3);
        }
        break;
    }

    res.status(200).json({ reply, action, actionProduct, products });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ reply: "I'm having trouble thinking right now. Please try again soon!" });
  }
};

const generateSEO = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required for SEO generation." });
    }

    // 1. Generate Meta Title
    // E.g. "Luxury Leather Tote - Handbags Collection | Bagify"
    const metaTitle = `${name} ${category ? '- ' + category : ''} | Premium Collection`.substring(0, 60);

    // 2. Generate Meta Description
    // Clean description, remove extra spaces, take first ~150 chars
    let cleanDesc = description.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
    let metaDescription = cleanDesc.length > 155 ? cleanDesc.substring(0, 155) + '...' : cleanDesc;

    // 3. Generate Meta Keywords (Heuristic NLP)
    const stopWords = ['a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'what', 'which', 'this', 'that', 'these', 'those', 'then', 'so', 'than', 'such', 'both', 'through', 'about', 'for', 'is', 'of', 'while', 'during', 'to', 'with', 'in', 'on', 'at', 'by'];
    
    const words = `${name} ${category || ''} ${description}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/);
      
    const keywordCounts = {};
    words.forEach(word => {
      if (word.length > 2 && !stopWords.includes(word)) {
        keywordCounts[word] = (keywordCounts[word] || 0) + 1;
      }
    });

    // Sort by frequency, then take top 6
    const sortedKeywords = Object.keys(keywordCounts).sort((a, b) => keywordCounts[b] - keywordCounts[a]);
    const metaKeywords = sortedKeywords.slice(0, 6).join(', ');

    res.status(200).json({
      metaTitle,
      metaDescription,
      metaKeywords
    });

  } catch (error) {
    console.error('SEO Gen Error:', error);
    res.status(500).json({ message: "Failed to generate SEO" });
  }
};

module.exports = { handleChatRequest, generateSEO };

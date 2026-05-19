import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = (open) => {
    setIsCartOpen(open !== undefined ? open : !isCartOpen);
  };

  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find((x) => String(x.id || x._id) === String(product.id || product._id));
    if (existItem) {
      setCartItems(cartItems.map((x) => (String(x.id || x._id) === String(product.id || product._id) ? { ...existItem, qty: existItem.qty + qty } : x)));
    } else {
      setCartItems([...cartItems, { ...product, qty }]);
    }
    // Automatically open the cart drawer when an item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => String(x.id || x._id) !== String(id)));
  };

  const updateCartQty = (id, qty) => {
    const nextQty = Math.max(1, Number(qty) || 1);
    setCartItems((items) =>
      items.map((item) => {
        if (String(item.id || item._id) !== String(id)) return item;
        const maxQty = Number(item.stock) > 0 ? Number(item.stock) : nextQty;
        return { ...item, qty: Math.min(nextQty, maxQty) };
      })
    );
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.find(x => String(x.id || x._id) === String(product.id || product._id));
    if (exists) {
      setWishlist(wishlist.filter(x => String(x.id || x._id) !== String(product.id || product._id)));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, wishlist, isCartOpen, 
      addToCart, removeFromCart, updateCartQty, toggleWishlist, 
      setCartItems, toggleCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

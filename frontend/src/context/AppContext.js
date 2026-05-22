'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export function AppProvider({ children }) {
  // Auth state
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // E-commerce state
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Localization / Traditions
  const [region, setRegion] = useState('all'); // 'all', 'telugu', 'tamil', 'hindi', 'kannada', 'malayalam'
  
  // Theme state
  const [theme, setTheme] = useState('light');

  // UI state
  const [alerts, setAlerts] = useState([]);

  // Load state on mount
  useEffect(() => {
    // Load Token & User
    const storedToken = localStorage.getItem('pooja_token');
    const storedUser = localStorage.getItem('pooja_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setAuthLoading(false);

    // Load Cart
    const storedCart = localStorage.getItem('pooja_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error(e);
      }
    }

    // Load Region
    const storedRegion = localStorage.getItem('pooja_region');
    if (storedRegion) {
      setRegion(storedRegion);
    }

    // Load Theme
    const storedTheme = localStorage.getItem('pooja_theme') || 'light';
    setTheme(storedTheme);
    if (storedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  // Save Cart to local storage when modified
  useEffect(() => {
    localStorage.setItem('pooja_cart', JSON.stringify(cart));
  }, [cart]);

  // Alert Alert helper
  const addAlert = (message, type = 'success') => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 4000);
  };

  // Toggle Theme
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('pooja_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  // Change Region
  const changeRegion = (newRegion) => {
    setRegion(newRegion);
    localStorage.setItem('pooja_region', newRegion);
    addAlert(`Traditions updated to ${newRegion.toUpperCase()} variant!`, 'info');
  };

  // Auth Operations
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('pooja_token', data.token);
      localStorage.setItem('pooja_user', JSON.stringify(data.user));
      addAlert(`Welcome back, ${data.user.name}!`, 'success');
      return { success: true };
    } catch (err) {
      addAlert(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, role = 'customer') => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('pooja_token', data.token);
      localStorage.setItem('pooja_user', JSON.stringify(data.user));
      addAlert('Account created successfully!', 'success');
      return { success: true };
    } catch (err) {
      addAlert(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pooja_token');
    localStorage.removeItem('pooja_user');
    setCart([]);
    addAlert('Signed out successfully', 'info');
  };

  const addAddress = async (address) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/address`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(address)
      });
      if (res.ok) {
        const addresses = await res.json();
        const updatedUser = { ...user, addresses };
        setUser(updatedUser);
        localStorage.setItem('pooja_user', JSON.stringify(updatedUser));
        addAlert('Address saved successfully', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cart Operations
  const addToCart = (product, quantity = 1, customItems = null) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === product._id);
      
      // If it's a custom-built kit
      if (customItems) {
        addAlert(`${product.name} Custom Combo added to Cart!`);
        return [
          ...prevCart.filter((item) => item.productId !== product._id),
          {
            productId: product._id,
            name: `${product.name} (Customized)`,
            price: product.price,
            quantity: quantity,
            customItems: customItems
          }
        ];
      }

      if (existing) {
        addAlert(`Increased ${product.name} quantity in Cart.`);
        return prevCart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      addAlert(`${product.name} added to Cart!`);
      return [
        ...prevCart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images?.[0]
        }
      ];
    });
  };

  const updateCartQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + amount;
            return { ...item, quantity: Math.max(1, newQty) };
          }
          return item;
        })
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    addAlert('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart totals
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        authLoading,
        login,
        register,
        logout,
        addAddress,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        region,
        changeRegion,
        theme,
        toggleTheme,
        alerts,
        addAlert,
        API_BASE
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

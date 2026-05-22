'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { ShoppingCart, User, Globe, Moon, Sun, Search, LogOut, LayoutDashboard, KeyRound } from 'lucide-react';

export default function Header() {
  const { 
    user, 
    logout, 
    cart, 
    getCartItemsCount, 
    region, 
    changeRegion, 
    theme, 
    toggleTheme,
    login,
    register,
    API_BASE
  } = useApp();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [headerPages, setHeaderPages] = useState([]);

  React.useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch(`${API_BASE}/pages`);
        if (res.ok) {
          const data = await res.json();
          setHeaderPages(data);
        } else {
          throw new Error('Offline fallback');
        }
      } catch (err) {
        // Fallback to local storage
        const stored = localStorage.getItem('dynamic_pages');
        if (stored) {
          try {
            setHeaderPages(JSON.parse(stored));
          } catch(e) {}
        } else {
          setHeaderPages([
            { title: "About Gita Divine", slug: "about-us" },
            { title: "Vedic Temples & Devotion Guide", slug: "temple-guide" }
          ]);
        }
      }
    }
    fetchPages();
    
    // Add event listener to refresh links when dynamic pages update
    const handleStorageChange = () => {
      const stored = localStorage.getItem('dynamic_pages');
      if (stored) {
        try {
          setHeaderPages(JSON.parse(stored));
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dynamic_pages_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dynamic_pages_updated', handleStorageChange);
    };
  }, [API_BASE]);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer');
  const [searchVal, setSearchVal] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      const res = await register(name, email, password, role);
      if (res.success) setShowAuthModal(false);
    } else {
      const res = await login(email, password);
      if (res.success) setShowAuthModal(false);
    }
  };

  const regionsList = [
    { code: 'all', label: 'All India' },
    { code: 'telugu', label: 'Telugu (AP/TG)' },
    { code: 'tamil', label: 'Tamil Traditions' },
    { code: 'kannada', label: 'Kannada Traditions' },
    { code: 'hindi', label: 'North Indian/Hindi' },
    { code: 'malayalam', label: 'Kerala/Malayalam' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-darkslate/90 backdrop-blur-md border-b border-gold/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex flex-col">
                <span className="font-serif text-2xl md:text-3xl font-bold text-spiritual-gradient dark:text-spiritual-gradient-dark tracking-wider">
                  GITA
                </span>
                <span className="text-[10px] tracking-[0.25em] font-medium text-crimson dark:text-gold uppercase -mt-1">
                  Divine Essentials
                </span>
              </Link>
            </div>

            {/* Navigation links (Large Screens) */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
              <Link href="/" className="hover:text-amber duration-200">Home</Link>
              <Link href="/categories" className="hover:text-amber duration-200">Categories</Link>
              <Link href="/#catalog" className="hover:text-amber duration-200">Catalog</Link>
              
              {/* Dynamic Pages Dropdown */}
              {headerPages.length > 0 && (
                <div className="relative group">
                  <button className="hover:text-amber duration-200 flex items-center gap-1">
                    Spiritual Guides
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-darkslate border border-gold/30 rounded-lg shadow-xl hidden group-hover:block overflow-hidden z-50 text-xs">
                    {headerPages.map((pg) => (
                      <Link
                        key={pg.slug}
                        href={`/pages/${pg.slug}`}
                        className="block w-full text-left px-4 py-3 hover:bg-gold/10 text-slate-800 dark:text-cream border-b border-gold/5 last:border-b-0"
                      >
                        {pg.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              <Link href="/dashboard" className="hover:text-amber duration-200">Dashboard</Link>
            </nav>

            {/* Search, Region, DarkMode & Auth Control */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Region Selector */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-xs sm:text-sm font-medium border border-gold/40 px-2 sm:px-3 py-1.5 rounded-full hover:bg-gold/10 duration-200">
                  <Globe className="h-4 w-4 text-amber" />
                  <span className="hidden sm:inline">
                    {regionsList.find(r => r.code === region)?.label || 'Region'}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-darkslate border border-gold/30 rounded-lg shadow-xl hidden group-hover:block overflow-hidden z-50">
                  {regionsList.map((r) => (
                    <button
                      key={r.code}
                      onClick={() => changeRegion(r.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gold/10 duration-200 ${
                        region === r.code ? 'bg-gold/20 font-semibold text-crimson dark:text-gold' : ''
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gold/10 text-darkslate dark:text-cream transition-colors duration-200"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-amber" />}
              </button>

              {/* Shopping Cart Button */}
              <Link href="/cart" className="relative p-2 rounded-full hover:bg-gold/10 duration-200">
                <ShoppingCart className="h-5 w-5 text-crimson dark:text-gold" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute top-0 right-0 bg-amber text-white font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center border border-white divine-glow-amber animate-pulse-subtle">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>

              {/* User Authentication Display */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 border border-gold/40 px-3 py-1.5 rounded-full hover:bg-gold/10 duration-200">
                    <User className="h-4 w-4 text-crimson dark:text-gold" />
                    <span className="hidden lg:inline text-sm font-semibold max-w-[100px] truncate">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-darkslate border border-gold/30 rounded-lg shadow-xl hidden group-hover:block overflow-hidden z-50">
                    <div className="px-4 py-2 border-b border-gold/10 text-xs text-slate-500 font-bold uppercase tracking-wider">
                      Role: {user.role}
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gold/10 duration-200">
                      <LayoutDashboard className="h-4 w-4 text-amber" /> Dashboard
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 duration-200"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setIsRegister(false); setShowAuthModal(true); }}
                  className="bg-gradient-to-r from-crimson to-amber hover:from-crimson-dark hover:to-amber-dark text-white font-bold text-sm px-4 py-2 rounded-full shadow-md divine-glow-amber duration-200"
                >
                  Login
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* Modal Popup Authentication Form */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-darkslate max-w-md w-full rounded-2xl border border-gold divine-glow overflow-hidden shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xl font-bold"
            >
              &times;
            </button>
            
            <div className="text-center mb-6">
              <KeyRound className="h-10 w-10 text-amber mx-auto mb-2" />
              <h3 className="font-serif text-2xl font-bold text-spiritual-gradient dark:text-spiritual-gradient-dark">
                {isRegister ? 'Join Gita Devotion' : 'Welcome to Gita'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRegister ? 'Create an account to track orders & rituals' : 'Access your customized puja items and dashboard'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gold/40 bg-cream/30 dark:bg-black/20 focus:outline-none focus:border-amber"
                    placeholder="E.g., Arjun Prasad"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gold/40 bg-cream/30 dark:bg-black/20 focus:outline-none focus:border-amber"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gold/40 bg-cream/30 dark:bg-black/20 focus:outline-none focus:border-amber"
                  placeholder="••••••••"
                />
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Register As</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gold/40 bg-cream/30 dark:bg-black/20 focus:outline-none focus:border-amber text-sm font-semibold"
                  >
                    <option value="customer">Devotee (Customer)</option>
                    <option value="vendor">Local Vendor</option>
                    <option value="admin">Platform Admin (For Demo)</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-crimson to-amber text-white font-bold py-3 rounded-lg hover:shadow-lg divine-glow-amber transition-all duration-200 mt-2"
              >
                {isRegister ? 'Register Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs">
              <span className="text-slate-500">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
              </span>{' '}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-crimson dark:text-gold font-bold hover:underline"
              >
                {isRegister ? 'Sign In here' : 'Sign Up here'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

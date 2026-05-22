'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, Package, Calendar, ClipboardList, Store, 
  PlusCircle, RefreshCw, CheckCircle2, ChevronRight, BarChart3, AlertCircle,
  FileText, Trash2, Image as ImageIcon
} from 'lucide-react';

const COLORS = ['#800020', '#FF9900', '#D4AF37', '#241C15'];

export default function DashboardPage() {
  const { token, user, addAlert, API_BASE } = useApp();
  
  const [activeTab, setActiveTab] = useState('analytics');

  // Analytics Metrics State
  const [metrics, setMetrics] = useState({
    summary: { totalRevenue: 184500, totalOrders: 104, vendorCount: 14, activeProducts: 24 },
    salesTrend: [
      { name: 'Jan', sales: 24000, orders: 12 },
      { name: 'Feb', sales: 32000, orders: 18 },
      { name: 'Mar', sales: 45000, orders: 25 },
      { name: 'Apr', sales: 58000, orders: 31 },
      { name: 'May', sales: 84500, orders: 48 }
    ],
    categoryDistribution: [
      { name: 'Combo Kits', value: 120000 },
      { name: 'Pooja Items', value: 37000 },
      { name: 'Home Decor', value: 18500 },
      { name: 'Prasad & Utensils', value: 9000 }
    ]
  });

  // Database lists
  const [products, setProducts] = useState([]);
  const [rituals, setRituals] = useState([]);
  const [orders, setOrders] = useState([]);

  // Forms states
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('pooja-item');
  const [newProdInventory, setNewProdInventory] = useState('50');
  const [newProdRegion, setNewProdRegion] = useState('all');

  const [newRitName, setNewRitName] = useState('');
  const [newRitKey, setNewRitKey] = useState('');
  const [newRitCategory, setNewRitCategory] = useState('festival');
  const [newRitDate, setNewRitDate] = useState('2026-10-10');
  const [newRitBudget, setNewRitBudget] = useState('1000');

  // Vendor Register Form
  const [vendorName, setVendorName] = useState('');
  const [vendorGst, setVendorGst] = useState('');
  const [vendorSubmitted, setVendorSubmitted] = useState(false);

  // Dynamic Pages State
  const [pages, setPages] = useState([]);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageContent, setNewPageContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]); // Array for presets
  const [customImageUrls, setCustomImageUrls] = useState(['', '', '']); // Array for custom inputs

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        // Fetch Analytics
        const analyticsRes = await fetch(`${API_BASE}/orders/analytics`, { headers });
        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setMetrics(data);
        }

        // Fetch Products
        const prodRes = await fetch(`${API_BASE}/products`);
        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(data);
        }

        // Fetch Rituals
        const ritRes = await fetch(`${API_BASE}/rituals`);
        if (ritRes.ok) {
          const data = await ritRes.json();
          setRituals(data);
        }

        // Fetch Orders
        const ordRes = await fetch(`${API_BASE}/orders/customer`, { headers });
        if (ordRes.ok) {
          const data = await ordRes.json();
          setOrders(data);
        }

        // Fetch Custom Pages
        const pagRes = await fetch(`${API_BASE}/pages`);
        if (pagRes.ok) {
          const data = await pagRes.json();
          setPages(data);
        }
      } catch (err) {
        console.log("Offline mode: utilizing mock dataset in dashboard widgets.");
        // Seed mock inventories
        setProducts([
          { _id: '1', name: 'Diwali Lakshmi Pooja Kit', price: 1499, inventory: 150, category: 'kit-combo', region: 'all' },
          { _id: '2', name: 'Satyanarayana Vratham Kit', price: 2499, inventory: 85, category: 'kit-combo', region: 'all' },
          { _id: '3', name: 'Clay Ganesha Idol', price: 600, inventory: 200, category: 'pooja-item', region: 'all' }
        ]);
        setRituals([
          { key: 'diwali-lakshmi-pooja', name: 'Diwali Lakshmi Pooja', category: 'festival', upcomingDate: '2026-11-08', baseBudget: 1500 },
          { key: 'satyanarayana-vratham', name: 'Satyanarayana Vratham', category: 'vratham', upcomingDate: '2026-06-29', baseBudget: 2800 }
        ]);
        setOrders([
          { _id: 'o1', invoiceNumber: 'INV-48293', totalAmount: 3892, paymentStatus: 'paid', orderStatus: 'shipped', createdAt: '2026-05-18' }
        ]);

        // Load custom pages from localStorage
        const stored = localStorage.getItem('dynamic_pages');
        if (stored) {
          try {
            setPages(JSON.parse(stored));
          } catch(e) {
            console.error(e);
          }
        } else {
          const defaults = [
            { title: "About Gita Divine", slug: "about-us", content: "<h2>About Gita Divine Essentials</h2><p>Welcome to Gita Divine, your trusted bridge to authentic Vedic traditions. We are committed to sourcing pure, organic, and scripturally approved pooja items and kits for devotees across India.</p><h3>Our Mission</h3><p>We work closely with local Vedic scholars and rural artisans to curate ritual checklists, traditional brassware, organic kumkum, and clay idols. By choosing Gita Divine, you support local potters and weavers while ensuring absolute purity in your prayers.</p>", images: ["/pooja.png", "/pooja2.png"] },
            { title: "Vedic Temples & Devotion Guide", slug: "temple-guide", content: "<h2>Guide to Temple Worship & Devotion</h2><p>In Hinduism, temple worship is a powerful means of communion with the divine. This guide offers insights on simple protocols for visiting and offering prayers at sacred shrines.</p><h3>Key Offerings</h3><ul><li><strong>Archana Kit:</strong> Coconut, flowers, betel leaves, camphor, and incense.</li><li><strong>Prasadam:</strong> Hand-made sweets offered to the deity and distributed to all.</li></ul>", images: ["/pooja3.png", "/ganesh.png"] }
          ];
          setPages(defaults);
          localStorage.setItem('dynamic_pages', JSON.stringify(defaults));
        }
      }
    }
    fetchDashboardData();
  }, [token, API_BASE]);

  // Form handlers
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const bodyObj = {
      name: newProdName,
      price: Number(newProdPrice),
      category: newProdCategory,
      inventory: Number(newProdInventory),
      region: newProdRegion
    };

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyObj)
      });
      if (res.ok) {
        const added = await res.json();
        setProducts(prev => [...prev, added]);
        addAlert('Product added to catalog successfully!');
      } else {
        throw new Error('Unauthorised');
      }
    } catch (e) {
      // Local fallback
      const mockAdded = {
        _id: 'mock_' + Date.now(),
        ...bodyObj
      };
      setProducts(prev => [...prev, mockAdded]);
      addAlert('Simulated Product added (Local State updated).');
    }

    setNewProdName('');
    setNewProdPrice('');
  };

  const handleAddRitualSubmit = async (e) => {
    e.preventDefault();
    if (!newRitName || !newRitKey) return;

    const bodyObj = {
      name: newRitName,
      key: newRitKey,
      category: newRitCategory,
      upcomingDate: newRitDate,
      baseBudget: Number(newRitBudget),
      description: `Sacred guide for ${newRitName}.`,
      checklist: [{ name: 'Kumkum & Haldi Set', baseQuantity: '1 Pack', estimatedPrice: 40 }]
    };

    try {
      const res = await fetch(`${API_BASE}/rituals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyObj)
      });
      if (res.ok) {
        const added = await res.json();
        setRituals(prev => [...prev, added]);
        addAlert('Ritual added to registry successfully!');
      } else {
        throw new Error('Forbidden');
      }
    } catch (e) {
      // Local fallback
      setRituals(prev => [...prev, bodyObj]);
      addAlert('Simulated Ritual added (Local State updated).');
    }

    setNewRitName('');
    setNewRitKey('');
  };

  const handleUpdateInventory = async (id, amount) => {
    const target = products.find(p => p._id === id);
    if (!target) return;
    const nextQty = Math.max(0, target.inventory + amount);

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ inventory: nextQty })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p._id === id ? { ...p, inventory: nextQty } : p));
        addAlert('Inventory updated.');
      } else {
        throw new Error('Forbidden');
      }
    } catch (e) {
      setProducts(prev => prev.map(p => p._id === id ? { ...p, inventory: nextQty } : p));
      addAlert('Simulated inventory update complete.');
    }
  };

  const handleVendorRegister = (e) => {
    e.preventDefault();
    if (!vendorName || !vendorGst) return;
    setVendorSubmitted(true);
    addAlert('Vendor registration submitted. Verification is pending approval.', 'info');
  };

  const handleAddPageSubmit = async (e) => {
    e.preventDefault();
    if (!newPageTitle || !newPageSlug || !newPageContent) return;

    // Combine preset images selection and custom URLs input, limit to 3 images
    const imagesToSave = [
      ...selectedImages,
      ...customImageUrls.filter(url => url && url.trim() !== '')
    ].slice(0, 3);

    const bodyObj = {
      title: newPageTitle,
      slug: newPageSlug.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      content: newPageContent,
      images: imagesToSave
    };

    try {
      const res = await fetch(`${API_BASE}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyObj)
      });
      if (res.ok) {
        const added = await res.json();
        setPages(prev => [...prev, added]);
        
        // Also sync local storage
        const currentLocal = localStorage.getItem('dynamic_pages');
        const list = currentLocal ? JSON.parse(currentLocal) : [];
        // Prevent duplicate slug additions
        const nextList = [...list.filter(p => p.slug !== added.slug), added];
        localStorage.setItem('dynamic_pages', JSON.stringify(nextList));
        addAlert('Custom page published successfully!');
        window.dispatchEvent(new Event('dynamic_pages_updated'));
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Forbidden');
      }
    } catch (e) {
      // Local fallback
      const mockAdded = {
        _id: 'mock_page_' + Date.now(),
        ...bodyObj,
        createdAt: new Date().toISOString()
      };
      setPages(prev => [...prev, mockAdded]);
      const currentLocal = localStorage.getItem('dynamic_pages');
      const list = currentLocal ? JSON.parse(currentLocal) : [];
      const nextList = [...list.filter(p => p.slug !== mockAdded.slug), mockAdded];
      localStorage.setItem('dynamic_pages', JSON.stringify(nextList));
      addAlert('Simulated Page created (Local Storage sync updated).');
      window.dispatchEvent(new Event('dynamic_pages_updated'));
    }

    setNewPageTitle('');
    setNewPageSlug('');
    setNewPageContent('');
    setSelectedImages([]);
    setCustomImageUrls(['', '', '']);
  };

  const handleDeletePage = async (slugToDelete) => {
    try {
      const res = await fetch(`${API_BASE}/pages/${slugToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setPages(prev => prev.filter(p => p.slug !== slugToDelete));
        // Sync local storage
        const currentLocal = localStorage.getItem('dynamic_pages');
        if (currentLocal) {
          const list = JSON.parse(currentLocal);
          localStorage.setItem('dynamic_pages', JSON.stringify(list.filter(p => p.slug !== slugToDelete)));
        }
        addAlert('Page deleted successfully.');
        window.dispatchEvent(new Event('dynamic_pages_updated'));
      } else {
        throw new Error('Forbidden');
      }
    } catch (e) {
      // Local fallback
      setPages(prev => prev.filter(p => p.slug !== slugToDelete));
      const currentLocal = localStorage.getItem('dynamic_pages');
      if (currentLocal) {
        const list = JSON.parse(currentLocal);
        localStorage.setItem('dynamic_pages', JSON.stringify(list.filter(p => p.slug !== slugToDelete)));
      }
      addAlert('Simulated Page deletion (Local Storage synced).');
      window.dispatchEvent(new Event('dynamic_pages_updated'));
    }
  };

  // If user is not logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 bg-white dark:bg-darkslate border border-gold/20 rounded-3xl mt-12 p-8 shadow-lg">
        <AlertCircle className="h-12 w-12 text-amber mx-auto" />
        <h3 className="font-serif text-xl font-bold">Access Restricted</h3>
        <p className="text-xs text-slate-500">
          Please log in or register an account using the top-right header button to view your dashboard.
        </p>
      </div>
    );
  }

  const isAuthorisedPartner = user.role === 'admin' || user.role === 'vendor';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* User greeting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/20 pb-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber tracking-wider">Welcome Back</span>
          <h1 className="font-serif text-3xl font-bold text-slate-800 dark:text-cream">{user.name}</h1>
          <p className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Role level: {user.role}</p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-2 bg-gold/10 p-1.5 rounded-full border border-gold/20 text-xs font-bold uppercase">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-full transition ${activeTab === 'analytics' ? 'bg-crimson text-white divine-glow' : 'hover:bg-gold/10'}`}
          >
            <TrendingUp className="h-3.5 w-3.5 inline mr-1" /> Analytics
          </button>
          
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-full transition ${activeTab === 'inventory' ? 'bg-crimson text-white divine-glow' : 'hover:bg-gold/10'}`}
          >
            <Package className="h-3.5 w-3.5 inline mr-1" /> Inventory
          </button>

          <button
            onClick={() => setActiveTab('rituals')}
            className={`px-4 py-2 rounded-full transition ${activeTab === 'rituals' ? 'bg-crimson text-white divine-glow' : 'hover:bg-gold/10'}`}
          >
            <Calendar className="h-3.5 w-3.5 inline mr-1" /> Rituals
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-full transition ${activeTab === 'orders' ? 'bg-crimson text-white divine-glow' : 'hover:bg-gold/10'}`}
          >
            <ClipboardList className="h-3.5 w-3.5 inline mr-1" /> Orders
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => setActiveTab('pages')}
              className={`px-4 py-2 rounded-full transition ${activeTab === 'pages' ? 'bg-crimson text-white divine-glow' : 'hover:bg-gold/10'}`}
            >
              <FileText className="h-3.5 w-3.5 inline mr-1" /> Pages
            </button>
          )}
        </div>
      </div>

      {/* --- TAB: ANALYTICS OVERVIEW --- */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-fade-in">
          {/* Key counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-darkslate border border-gold/25 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Revenue (INR)</span>
              <span className="text-2xl font-black text-crimson dark:text-gold">₹{metrics.summary.totalRevenue}</span>
            </div>
            <div className="bg-white dark:bg-darkslate border border-gold/25 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Orders</span>
              <span className="text-2xl font-black text-slate-800 dark:text-cream">{metrics.summary.totalOrders}</span>
            </div>
            <div className="bg-white dark:bg-darkslate border border-gold/25 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Vendors</span>
              <span className="text-2xl font-black text-slate-800 dark:text-cream">{metrics.summary.vendorCount}</span>
            </div>
            <div className="bg-white dark:bg-darkslate border border-gold/25 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Listed Products</span>
              <span className="text-2xl font-black text-slate-800 dark:text-cream">{metrics.summary.activeProducts}</span>
            </div>
          </div>

          {/* Charts container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sales Trends Chart */}
            <div className="lg:col-span-8 bg-white dark:bg-darkslate border border-gold/20 p-6 rounded-3xl shadow shadow-gold/5 space-y-4">
              <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-cream flex items-center gap-1.5">
                <BarChart3 className="h-5 w-5 text-amber" /> Monthly Sales & Orders Growth
              </h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" stroke="#D4AF37" fontSize={11} />
                    <YAxis stroke="#D4AF37" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#241C15', color: '#FAF6F0', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="sales" stroke="#800020" strokeWidth={3} name="Revenue (₹)" />
                    <Line type="monotone" dataKey="orders" stroke="#FF9900" strokeWidth={2} name="Order Count" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="lg:col-span-4 bg-white dark:bg-darkslate border border-gold/20 p-6 rounded-3xl shadow shadow-gold/5 flex flex-col justify-between">
              <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-cream mb-4">Category Share</h3>
              <div className="h-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {metrics.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 uppercase mt-4">
                {metrics.categoryDistribution.map((entry, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="truncate">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: INVENTORY --- */}
      {activeTab === 'inventory' && (
        <div className="space-y-8 animate-fade-in">
          {isAuthorisedPartner ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Product list */}
              <div className="lg:col-span-8 bg-white dark:bg-darkslate border border-gold/20 rounded-3xl p-6 shadow-md space-y-4">
                <h3 className="font-serif text-lg font-bold text-crimson dark:text-gold border-b border-gold/15 pb-2">
                  My Active Inventory Listings
                </h3>
                <div className="space-y-3">
                  {products.map(prod => (
                    <div key={prod._id} className="flex justify-between items-center p-3 rounded-xl border border-gold/10 bg-gold/5">
                      <div>
                        <span className="text-xs font-bold block">{prod.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{prod.category} • {prod.region}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-extrabold text-crimson dark:text-gold">₹{prod.price}</span>
                        
                        {/* Add inventory buttons */}
                        <div className="flex items-center border border-gold/20 rounded bg-white dark:bg-black/20 text-xs font-bold">
                          <button onClick={() => handleUpdateInventory(prod._id, -5)} className="px-2 py-1 bg-slate-100 hover:bg-gold/10">-5</button>
                          <span className="px-2">{prod.inventory} qty</span>
                          <button onClick={() => handleUpdateInventory(prod._id, 5)} className="px-2 py-1 bg-slate-100 hover:bg-gold/10">+5</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Product Form */}
              <div className="lg:col-span-4 bg-white dark:bg-darkslate border-2 border-gold rounded-3xl p-6 shadow-lg space-y-4">
                <h3 className="font-serif text-lg font-bold text-spiritual-gradient flex items-center gap-1">
                  <PlusCircle className="h-5 w-5 text-amber" /> Add New Pooja Product
                </h3>
                <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={e => setNewProdName(e.target.value)}
                      placeholder="e.g. Copper Diya Stand"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={newProdPrice}
                        onChange={e => setNewProdPrice(e.target.value)}
                        placeholder="299"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Initial Stock</label>
                      <input
                        type="number"
                        value={newProdInventory}
                        onChange={e => setNewProdInventory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={e => setNewProdCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber text-xs font-bold"
                    >
                      <option value="pooja-item">Essential Pooja Item</option>
                      <option value="kit-combo">Combo Pack / Kit</option>
                      <option value="decor">Decor Item</option>
                      <option value="prasad">Prasad Item</option>
                      <option value="utensil">Sacred Utensils</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Regional Customization Tag</label>
                    <select
                      value={newProdRegion}
                      onChange={e => setNewProdRegion(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber text-xs font-bold"
                    >
                      <option value="all">All India (Common)</option>
                      <option value="telugu">Telugu traditions</option>
                      <option value="tamil">Tamil traditions</option>
                      <option value="kannada">Kannada traditions</option>
                      <option value="hindi">North Indian / Hindi</option>
                      <option value="malayalam">Malayalam / Kerala</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-crimson to-amber text-white font-bold py-3 rounded-lg shadow duration-200 mt-2"
                  >
                    Add Product to Portal
                  </button>
                </form>
              </div>

            </div>
          ) : (
            /* Vendor Registration Portal */
            <div className="bg-white dark:bg-darkslate border border-gold/25 max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="text-center space-y-2">
                <Store className="h-12 w-12 text-amber mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-spiritual-gradient">Local Vendor Marketplace</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Are you a local flower merchant, organic spice vendor, clay potter, or pooja booklet printer? Register as a supplier to upload kits and receive bulk seasonal orders.
                </p>
              </div>

              {vendorSubmitted ? (
                <div className="bg-green-500/10 border border-green-500/20 text-green-700 text-xs p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5" />
                  <div>
                    <strong>Application Received!</strong> We are reviewing your PAN/GST registration. A Divine Partner Representative will reach out to you within 24 hours.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVendorRegister} className="space-y-4 text-xs font-medium">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Business Name</label>
                      <input
                        type="text"
                        required
                        value={vendorName}
                        onChange={e => setVendorName(e.target.value)}
                        placeholder="e.g. Hyderabad Clay Potters Society"
                        className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">GSTIN / PAN Card Number</label>
                      <input
                        type="text"
                        required
                        value={vendorGst}
                        onChange={e => setVendorGst(e.target.value)}
                        placeholder="e.g. 36AAAAA1111A1Z1"
                        className="w-full px-3 py-2 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-crimson to-amber text-white font-bold py-3.5 rounded-lg shadow hover:shadow-lg transition duration-200"
                  >
                    Onboard Vendor Store
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- TAB: RITUALS --- */}
      {activeTab === 'rituals' && (
        <div className="space-y-8 animate-fade-in">
          {isAuthorisedPartner ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* List of current rituals */}
              <div className="lg:col-span-8 bg-white dark:bg-darkslate border border-gold/20 rounded-3xl p-6 shadow-md space-y-4">
                <h3 className="font-serif text-lg font-bold text-crimson dark:text-gold border-b border-gold/15 pb-2">
                  Registered Festivals & Auspicious Ceremonies
                </h3>
                <div className="space-y-3">
                  {rituals.map(rit => (
                    <div key={rit.key} className="flex justify-between items-center p-3 rounded-xl border border-gold/10 bg-gold/5 text-xs">
                      <div>
                        <strong className="block text-sm text-slate-800 dark:text-cream">{rit.name}</strong>
                        <span className="text-slate-400 font-bold uppercase text-[9px]">{rit.category} • Budget: ₹{rit.baseBudget}</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-amber">{rit.upcomingDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Ritual Form (Admin only, vendor fallback) */}
              <div className="lg:col-span-4 bg-white dark:bg-darkslate border-2 border-gold rounded-3xl p-6 shadow-lg space-y-4">
                <h3 className="font-serif text-lg font-bold text-spiritual-gradient flex items-center gap-1">
                  <PlusCircle className="h-5 w-5 text-amber" /> Create Pooja Registry
                </h3>
                <form onSubmit={handleAddRitualSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Ritual Name</label>
                    <input
                      type="text"
                      required
                      value={newRitName}
                      onChange={e => setNewRitName(e.target.value)}
                      placeholder="e.g. Varalakshmi Vratham"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">URL Identifier Key (unique)</label>
                    <input
                      type="text"
                      required
                      value={newRitKey}
                      onChange={e => setNewRitKey(e.target.value)}
                      placeholder="e.g. varalakshmi-vratham"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Estimated Budget (₹)</label>
                      <input
                        type="number"
                        required
                        value={newRitBudget}
                        onChange={e => setNewRitBudget(e.target.value)}
                        placeholder="1800"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Upcoming Date</label>
                      <input
                        type="date"
                        value={newRitDate}
                        onChange={e => setNewRitDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber text-slate-700 font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Category</label>
                    <select
                      value={newRitCategory}
                      onChange={e => setNewRitCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber text-xs font-bold"
                    >
                      <option value="festival">Festival</option>
                      <option value="vratham">Vratham (Vow)</option>
                      <option value="ceremony">Ceremony (Lifecycle)</option>
                      <option value="temple">Temple Offerings</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-crimson to-amber text-white font-bold py-3 rounded-lg shadow duration-200 mt-2"
                  >
                    Add Ritual to Portal
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-darkslate border border-gold/25 p-8 rounded-3xl max-w-lg mx-auto text-center space-y-4 shadow">
              <Calendar className="h-10 w-10 text-amber mx-auto" />
              <h3 className="font-serif text-lg font-bold">Registry Restrained</h3>
              <p className="text-xs text-slate-500">
                You must have an **Admin** profile role to manage the central Hindu ritual directories and timelines. Feel free to register as an Admin in the Login popup for evaluation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- TAB: ORDERS --- */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-darkslate border border-gold/20 rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="font-serif text-lg font-bold text-crimson dark:text-gold border-b border-gold/15 pb-2">
              Orders Log
            </h3>
            
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 py-10 text-center">No orders registered on your account yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map(ord => (
                  <div key={ord._id} className="p-4 rounded-xl border border-gold/15 bg-gold/5 flex flex-col sm:flex-row justify-between gap-4 text-xs font-medium">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-cream">Invoice: {ord.invoiceNumber}</span>
                        <span className="bg-green-500/10 text-green-600 border border-green-500/20 px-2 py-0.5 rounded font-extrabold uppercase text-[8px] tracking-wider">
                          {ord.paymentStatus}
                        </span>
                      </div>
                      <p className="text-slate-400">Placed on: {new Date(ord.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Grand Total</span>
                        <span className="font-extrabold text-sm text-crimson dark:text-gold">₹{ord.totalAmount}</span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Delivery Status</span>
                        <span className="bg-amber/15 text-amber border border-amber/30 px-2.5 py-1 rounded font-bold uppercase text-[9px]">
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB: PAGES MANAGER (Admin only) --- */}
      {activeTab === 'pages' && user.role === 'admin' && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* List of current dynamic pages */}
            <div className="lg:col-span-7 bg-white dark:bg-darkslate border border-gold/20 rounded-3xl p-6 shadow-md space-y-4">
              <h3 className="font-serif text-lg font-bold text-crimson dark:text-gold border-b border-gold/15 pb-2">
                Active Custom Pages
              </h3>
              
              {pages.length === 0 ? (
                <p className="text-xs text-slate-400 py-10 text-center">No dynamic pages published yet.</p>
              ) : (
                <div className="space-y-4">
                  {pages.map(pg => (
                    <div key={pg.slug} className="p-4 rounded-xl border border-gold/10 bg-gold/5 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <strong className="block text-sm text-slate-800 dark:text-cream">{pg.title}</strong>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Slug: <span className="text-crimson dark:text-gold">/pages/{pg.slug}</span></span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/pages/${pg.slug}`} 
                            target="_blank"
                            className="text-xs font-bold text-amber hover:underline px-2.5 py-1 bg-amber/10 rounded-md border border-amber/20"
                          >
                            View Page
                          </Link>
                          
                          <button 
                            onClick={() => handleDeletePage(pg.slug)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-md border border-red-500/20 transition"
                            title="Delete custom page"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Display attached images */}
                      {pg.images && pg.images.filter(img => img).length > 0 && (
                        <div className="flex gap-2 pt-2 border-t border-gold/5 items-center">
                          <span className="text-[9px] uppercase font-bold text-slate-400">Images:</span>
                          <div className="flex gap-1.5">
                            {pg.images.filter(img => img).map((imgUrl, i) => (
                              <div key={i} className="h-8 w-12 rounded overflow-hidden border border-gold/25 relative group bg-black/10">
                                <img src={imgUrl} alt="Page clip" className="h-full w-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create Custom Page Form */}
            <div className="lg:col-span-5 bg-white dark:bg-darkslate border-2 border-gold rounded-3xl p-6 shadow-lg space-y-4">
              <h3 className="font-serif text-lg font-bold text-spiritual-gradient flex items-center gap-1.5">
                <PlusCircle className="h-5 w-5 text-amber" /> Create Dynamic Page
              </h3>
              
              <form onSubmit={handleAddPageSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Page Title</label>
                  <input
                    type="text"
                    required
                    value={newPageTitle}
                    onChange={e => setNewPageTitle(e.target.value)}
                    placeholder="e.g. Spiritual Significance of Kumkum"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-500 font-bold mb-1">URL Identifier (Slug)</label>
                  <input
                    type="text"
                    required
                    value={newPageSlug}
                    onChange={e => setNewPageSlug(e.target.value)}
                    placeholder="e.g. significance-of-kumkum"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Page Content (HTML supported)</label>
                  <textarea
                    required
                    rows="6"
                    value={newPageContent}
                    onChange={e => setNewPageContent(e.target.value)}
                    placeholder="<h2>Header</h2><p>Vedic explanations go here...</p><ul><li>List items</li></ul>"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gold/30 bg-transparent focus:outline-none focus:border-amber font-mono"
                  ></textarea>
                </div>

                {/* Images selection */}
                <div className="space-y-3">
                  <label className="block text-slate-500 font-bold">Select Page Gallery Images (Choose up to 3)</label>
                  
                  {/* Preset thumbnails */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { path: '/pooja.png', label: 'Diwali' },
                      { path: '/pooja2.png', label: 'Vratham' },
                      { path: '/pooja3.png', label: 'Rangoli' },
                      { path: '/ganesh.png', label: 'Ganesha' }
                    ].map(img => {
                      const isSelected = selectedImages.includes(img.path);
                      return (
                        <button
                          type="button"
                          key={img.path}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedImages(prev => prev.filter(i => i !== img.path));
                            } else {
                              if (selectedImages.length >= 3) {
                                addAlert('You can only select up to 3 images total.', 'info');
                                return;
                              }
                              setSelectedImages(prev => [...prev, img.path]);
                            }
                          }}
                          className={`relative rounded-lg overflow-hidden border-2 aspect-video transition-all duration-200 ${isSelected ? 'border-amber ring-2 ring-amber/35' : 'border-gold/20 opacity-70 hover:opacity-100'}`}
                        >
                          <img src={img.path} alt={img.label} className="h-full w-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white p-0.5 font-bold truncate text-center">
                            {img.label}
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-amber text-white text-[8px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom URLs */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Or add custom URLs:</span>
                    {[0, 1, 2].map(idx => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`Custom URL #${idx + 1} (e.g., https://site.com/image.jpg)`}
                        value={customImageUrls[idx] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomImageUrls(prev => {
                            const copy = [...prev];
                            copy[idx] = val;
                            return copy;
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-gold/30 bg-transparent text-xs focus:outline-none focus:border-amber"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-crimson to-amber text-white font-bold py-3 rounded-lg shadow duration-200 mt-2"
                >
                  Publish Custom Page
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

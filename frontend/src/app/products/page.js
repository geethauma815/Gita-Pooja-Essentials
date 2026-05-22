'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Star, MapPin, Sparkles, AlertCircle, ShoppingBag, Filter } from 'lucide-react';

const localMockProducts = [
  {
    _id: "p1",
    name: "Complete Diwali Lakshmi Pooja Kit",
    price: 1499,
    description: "All-in-one sacred kit containing 11 clay diyas, pure mustard oil, cotton wicks, haldi-kumkum, ganga jal, premium agarbatti, camphor, fresh marigold garlands, mango leaves, and a red altar cloth.",
    images: ["/pooja.png"],
    category: "kit-combo",
    inventory: 150,
    region: "all",
    rating: 4.8
  },
  {
    _id: "p2",
    name: "Satyanarayana Vratham Premium Combo Kit",
    price: 2499,
    description: "Premium Vedic kit containing a wooden Peetham backdrop, copper Kalash, whole husked coconut, betel leaves, mixed garlands, cow ghee, Tulsi leaves, and pre-mixed Rava Prasad ingredients.",
    images: ["/pooja2.png"],
    category: "kit-combo",
    inventory: 85,
    region: "all",
    rating: 4.9
  },
  {
    _id: "p3",
    name: "Eco-Friendly Ganesh Chaturthi Idol & Pooja Kit",
    price: 1799,
    description: "A 9-inch eco-friendly clay Ganesha idol that dissolves in water. The kit includes 21 blades of Durva grass, red Hibiscus flowers, a box of 11 fresh modaks, sandalwood paste, and a sacred janeu thread.",
    images: ["/ganesh.png"],
    category: "kit-combo",
    inventory: 200,
    region: "all",
    rating: 4.7
  },
  {
    _id: "p4",
    name: "Traditional Rangoli Colors (10 Vibrant Shades)",
    price: 349,
    description: "Skin-friendly, organic rangoli powder set derived from corn starch and natural flower extracts. Leaves no permanent stains.",
    images: ["/pooja3.png"],
    category: "decor",
    inventory: 300,
    region: "all",
    rating: 4.5
  }
];

const regionalHighlights = {
  telugu: "Highlights: Ugadi Pachadi ready-mix, organic mango leaves torans, and traditional raw turmeric roots.",
  tamil: "Highlights: Karthigai terracotta deepams, specialty temple kungumam, and banana leaf packs.",
  kannada: "Highlights: Karaga jasmine garlands, specialty dry prasadam mixes, and brass diyas.",
  hindi: "Highlights: Premium ganga jal boxes, clay idols from Kumartuli, and havan saamagri boxes.",
  malayalam: "Highlights: Aranmula mirror shapes, golden kasavu altar borders, and dry coconut halves."
};

const regionsList = [
  { code: 'all', label: 'All India' },
  { code: 'telugu', label: 'Telugu (AP/TG)' },
  { code: 'tamil', label: 'Tamil Traditions' },
  { code: 'kannada', label: 'Kannada Traditions' },
  { code: 'hindi', label: 'North Indian/Hindi' },
  { code: 'malayalam', label: 'Kerala/Malayalam' }
];

const categoryLabels = {
  all: 'All Categories',
  'pooja-item': 'Essential Items',
  'kit-combo': 'Combo Kits',
  'decor': 'Spiritual Decor',
  'prasad': 'Sacred Prasad',
  'utensil': 'Sacred Utensils'
};

export default function ProductsPage() {
  const { region, changeRegion, addToCart, API_BASE } = useApp();
  
  const [products, setProducts] = useState(localMockProducts);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setProducts(data);
        }
      } catch (err) {
        console.log("Could not reach API backend, operating in offline products fallback mode.", err.message);
      }
    }
    fetchProducts();
  }, [API_BASE]);

  // Filter products by region and active category
  const filteredProducts = products.filter((p) => {
    const matchesRegion = region === 'all' || p.region === 'all' || p.region === region;
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesRegion && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-16 animate-fade-in">
      
      {/* Banner Header */}
      <section className="relative bg-black text-white py-16 px-4 overflow-hidden border-b border-gold/30">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{ 
            backgroundImage: `url('/pooja3.png')`,
            filter: 'brightness(0.4) contrast(1.1)' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-crimson-dark/95 via-black/80 to-amber-dark/80 pointer-events-none" />

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 border border-gold/10 rounded-full animate-spin-slow opacity-25 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-dashed border-gold/15 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-1 bg-white/10 w-fit mx-auto px-4 py-1.5 rounded-full border border-gold/30 backdrop-blur-md text-xs font-bold text-gold">
            <ShoppingBag className="h-3.5 w-3.5 text-amber" />
            Sacred Altar Shop
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide divine-glow-text">
            Divine Pooja Items & Sacred Kits
          </h1>
          
          <p className="text-xs sm:text-sm max-w-xl mx-auto text-cream/70 font-medium">
            100% pure organic ingredients, scripturally approved vessels, and eco-friendly idols prepared and packaged with complete devotion.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Region and Category Selectors Bar */}
        <div className="bg-white dark:bg-darkslate border border-gold/25 p-6 rounded-3xl shadow-lg space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Region select tag */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Filter by Tradition Region</span>
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                {regionsList.map((r) => (
                  <button
                    key={r.code}
                    onClick={() => changeRegion(r.code)}
                    className={`flex items-center gap-1 border px-3 py-1.5 rounded-full text-xs font-semibold transition duration-200 ${
                      region === r.code 
                        ? 'bg-amber text-darkslate border-amber font-bold shadow-sm' 
                        : 'border-gold/30 hover:bg-gold/10'
                    }`}
                  >
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category select tags */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Select Category</span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                {Object.keys(categoryLabels).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition duration-200 ${
                      activeCategory === cat
                        ? 'bg-crimson text-white divine-glow border border-crimson'
                        : 'bg-gold/5 hover:bg-gold/15 border border-gold/25'
                    }`}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>
            </div>

          </div>
          
          {/* Regional Highlights text banner */}
          {region !== 'all' && (
            <div className="bg-gold/10 border border-gold/35 rounded-2xl p-4 flex items-center gap-3 text-xs sm:text-sm font-medium">
              <MapPin className="h-5 w-5 text-crimson shrink-0" />
              <div>
                <span className="font-bold text-crimson uppercase">{region} traditions loaded:</span>{' '}
                <span className="text-slate-700 dark:text-slate-300">{regionalHighlights[region]}</span>
              </div>
              <button 
                onClick={() => changeRegion('all')}
                className="ml-auto text-xs font-bold text-crimson hover:underline shrink-0"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod._id}
                className="bg-white dark:bg-darkslate border border-gold/20 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-amber/40 group transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image panel */}
                <div className="relative aspect-square bg-cream overflow-hidden border-b border-gold/10">
                  <img
                    src={prod.images?.[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 duration-300"
                  />
                  {prod.category === 'kit-combo' && (
                    <span className="absolute top-3 left-3 bg-crimson text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded shadow divine-glow">
                      Combo Kit
                    </span>
                  )}
                  {prod.region && prod.region !== 'all' && (
                    <span className="absolute top-3 right-3 bg-darkslate/80 text-gold border border-gold/30 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded">
                      {prod.region}
                    </span>
                  )}
                </div>

                {/* Details panel */}
                <div className="p-4 flex-grow flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-bold uppercase">{prod.category}</span>
                      <div className="flex items-center gap-1 font-bold text-amber">
                        <Star className="h-3 w-3 fill-current" /> {prod.rating}
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-slate-800 dark:text-cream line-clamp-2">
                      {prod.name}
                    </h3>

                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gold/10">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Price</span>
                      <span className="font-extrabold text-base text-crimson dark:text-gold">
                        ₹{prod.price}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="flex items-center gap-1.5 bg-amber hover:bg-amber-dark text-darkslate font-bold text-xs px-3.5 py-2 rounded-lg duration-200 shadow"
                    >
                      <Package className="h-3.5 w-3.5" /> Buy Kit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-darkslate border border-gold/20 rounded-3xl max-w-xl mx-auto space-y-4">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto animate-pulse" />
            <h3 className="font-serif text-lg font-bold text-slate-700 dark:text-cream">No Products Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No products found matching the selected tradition region ({region}) and category filter ({activeCategory}). Change filters or reset region to view all products.
            </p>
          </div>
        )}

      </section>
    </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { 
  ArrowLeft, Search, Star, Package, Sparkles, MapPin, 
  ChevronRight, ArrowUpDown, SlidersHorizontal 
} from 'lucide-react';

const categoryMeta = {
  'kit-combo': {
    name: 'Pooja & Festival Combo Kits',
    description: 'Vedic-standard all-in-one worship assemblies curated for major Indian festivals and auspicious family events.',
    bg: 'from-amber to-gold'
  },
  'pooja-item': {
    name: 'Pooja Samagri & Essentials',
    description: 'Pure, organic individual prayer items sourced ethically from holy centers in India.',
    bg: 'from-crimson to-amber'
  },
  'decor': {
    name: 'Divine Festive Decor',
    description: 'Traditional altar backdrops, natural leaf torans, and vibrant organic rangoli colors to beautify your home altar.',
    bg: 'from-gold to-amber'
  },
  'utensil': {
    name: 'Sacred Utensils & Brassware',
    description: 'Handcrafted premium metal ware designed for lifetime devotional use.',
    bg: 'from-yellow-600 to-yellow-400'
  },
  'prasad': {
    name: 'Prasadam & Divine Offerings',
    description: 'Pure edible offerings prepared with traditional hygienic standards for sacred Naivedyam.',
    bg: 'from-orange-500 to-amber'
  }
};

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
  },
  {
    _id: "p5",
    name: "Authentic Ganga Jal & Bhimseni Camphor Pack",
    price: 199,
    description: "100% pure Gangotri Ganga Jal (200ml) paired with 100g of original non-synthetic Bhimseni Camphor tablets.",
    images: ["https://images.unsplash.com/photo-1609137144813-979401bf26e7?w=800&auto=format&fit=crop&q=60"],
    category: "pooja-item",
    inventory: 500,
    region: "all",
    rating: 4.6
  },
  {
    _id: "p6",
    name: "Handcrafted Brass Pooja Thali Set (5-Piece)",
    price: 899,
    description: "Beautifully carved solid brass plate featuring a small diya holder, incense stand, bell, and haldi-kumkum containers.",
    images: ["https://images.unsplash.com/photo-1608976451634-118e9a263152?w=800&auto=format&fit=crop&q=60"],
    category: "utensil",
    inventory: 120,
    region: "all",
    rating: 4.9
  },
  {
    _id: "p7",
    name: "Telugu Tradition Ugadi Pachadi Ready-mix",
    price: 149,
    description: "Authentic mix containing raw mango bits, neem flowers, tamarind pulp, jaggery, black pepper, and salt.",
    images: ["https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=800&auto=format&fit=crop&q=60"],
    category: "prasad",
    inventory: 400,
    region: "telugu",
    rating: 4.8
  },
  {
    _id: "p8",
    name: "Tamil Tradition Karthigai Deepam Terracotta Lamps",
    price: 249,
    description: "Set of 9 traditionally baked terracotta clay oil lamps, custom crafted by local potters in Tamil Nadu.",
    images: ["/pooja.png"],
    category: "pooja-item",
    inventory: 180,
    region: "tamil",
    rating: 4.7
  }
];

const kitToRitualKey = {
  "Complete Diwali Lakshmi Pooja Kit": "diwali-lakshmi-pooja",
  "Satyanarayana Vratham Premium Combo Kit": "satyanarayana-vratham",
  "Eco-Friendly Ganesh Chaturthi Idol & Pooja Kit": "ganesh-chaturthi-pooja"
};

export default function CategoryProductsPage({ params }) {
  const { slug } = params;
  const meta = categoryMeta[slug] || {
    name: 'Divine Catalog',
    description: 'Explore our collections of auspicious puja items and festival accessories.',
    bg: 'from-crimson to-amber'
  };

  const { addToCart, region, changeRegion, API_BASE } = useApp();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('all');
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'price-low', 'price-high'

  // Sync contextual region
  useEffect(() => {
    if (region) {
      setActiveRegion(region);
    }
  }, [region]);

  // Fetch Products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/products?category=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setProducts(data);
            return;
          }
        }
      } catch (err) {
        console.log("Could not reach API server, loading category database fallback.");
      }
      
      // Filter mock products
      const filteredMock = localMockProducts.filter(p => p.category === slug);
      setProducts(filteredMock);
    }
    fetchProducts();
  }, [slug, API_BASE]);

  // Handle local region filter click and sync with app context
  const handleRegionClick = (reg) => {
    setActiveRegion(reg);
    changeRegion(reg);
  };

  // Filter and Sort products
  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = activeRegion === 'all' || p.region === 'all' || p.region === activeRegion;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return b.rating - a.rating; // Default sort by rating
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/categories" className="hover:text-crimson flex items-center gap-1 duration-200">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Categories
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-crimson dark:text-gold uppercase tracking-wider">{slug}</span>
      </div>

      {/* Category Banner */}
      <div className={`relative py-12 px-6 sm:px-12 text-white bg-gradient-to-r ${meta.bg} rounded-3xl overflow-hidden shadow-lg border border-gold/20`}>
        {/* Floating Mandala BG */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 border border-white/10 rounded-full animate-spin-slow opacity-20"></div>
        <div className="relative z-10 space-y-3 max-w-2xl">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide">
            {meta.name}
          </h1>
          <p className="text-sm text-cream/90 leading-relaxed">
            {meta.description}
          </p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-darkslate border border-gold/15 rounded-2xl p-4 sm:p-6 shadow-md grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search items in this category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gold/20 bg-transparent text-xs font-bold focus:outline-none focus:border-amber"
          />
        </div>

        {/* Region Selection */}
        <div className="md:col-span-5 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase shrink-0">Region:</span>
          {['all', 'telugu', 'tamil', 'hindi', 'kannada', 'malayalam'].map((reg) => (
            <button
              key={reg}
              onClick={() => handleRegionClick(reg)}
              className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase duration-200 border shrink-0 ${
                activeRegion === reg 
                  ? 'bg-crimson text-white border-crimson'
                  : 'bg-gold/5 border-gold/20 text-slate-500 hover:bg-gold/10'
              }`}
            >
              {reg === 'all' ? 'All India' : reg}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="md:col-span-3 flex items-center justify-end gap-2">
          <ArrowUpDown className="h-4 w-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gold/20 bg-transparent text-xs font-bold text-slate-700 dark:text-cream focus:outline-none focus:border-amber"
          >
            <option value="rating">Sort by Rating</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-darkslate border border-gold/10 rounded-3xl p-8 space-y-4">
          <Package className="h-16 w-16 text-gold/40 mx-auto" />
          <h3 className="font-serif text-xl font-bold">No Items Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We couldn't find any products matching your search query or regional selection in this category.
          </p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveRegion('all'); }}
            className="bg-gradient-to-r from-crimson to-amber text-white font-bold text-xs px-6 py-2.5 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const ritualKey = kitToRitualKey[prod.name];
            return (
              <div
                key={prod._id}
                className="bg-white dark:bg-darkslate border border-gold/20 rounded-2xl overflow-hidden hover:shadow-xl hover:border-amber/50 group transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-square bg-cream overflow-hidden">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=800'}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 duration-300"
                    />
                    {prod.region !== 'all' && (
                      <span className="absolute top-2 left-2 bg-crimson text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <MapPin className="h-2 w-2" /> {prod.region}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>{prod.category}</span>
                      <div className="flex items-center gap-0.5 text-amber">
                        <Star className="h-3 w-3 fill-current" /> {prod.rating}
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-slate-800 dark:text-cream line-clamp-2">
                      {prod.name}
                    </h3>
                    
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>
                </div>

                {/* Footer and Actions */}
                <div className="p-4 border-t border-gold/10 bg-gold/5 space-y-3 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Price</span>
                    <span className="font-extrabold text-base text-crimson dark:text-gold">
                      ₹{prod.price}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {/* If it's a kit combo with a ritual builder mapping */}
                    {prod.category === 'kit-combo' && ritualKey && (
                      <Link
                        href={`/rituals/${ritualKey}`}
                        className="w-full text-center bg-transparent border border-gold text-darkslate dark:text-cream hover:bg-gold/10 font-bold text-xs py-2 rounded-lg duration-200 flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-amber" /> Configure Custom Kit
                      </Link>
                    )}

                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="w-full bg-gradient-to-r from-amber to-gold hover:shadow-md text-darkslate font-extrabold text-xs py-2 rounded-lg duration-200 flex items-center justify-center gap-1.5"
                    >
                      <Package className="h-3.5 w-3.5" /> Quick Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

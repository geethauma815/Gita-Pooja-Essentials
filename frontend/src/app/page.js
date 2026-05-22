'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { Search, Calendar, ChevronRight, Sparkles, MapPin, CheckCircle, Flame, Star, Package } from 'lucide-react';

// Local Mock Data in case backend connection is absent on first build
const localMockRituals = [
  {
    name: "Diwali Lakshmi Pooja",
    key: "diwali-lakshmi-pooja",
    category: "festival",
    description: "Diwali is the festival of lights, and performing Lakshmi Pooja on this night invokes prosperity, health, and wealth.",
    significance: "Worshipping Goddess Lakshmi (wealth) and Ganesha celebrates the victory of light over darkness.",
    upcomingDate: "2026-11-08",
    timings: "Pradosh Kaal: 5:42 PM to 7:21 PM",
    baseBudget: 1500
  },
  {
    name: "Satyanarayana Vratham",
    key: "satyanarayana-vratham",
    category: "vratham",
    description: "A highly sacred ritual dedicated to Lord Satyanarayana (an avatar of Vishnu) for health, prosperity, and peace.",
    significance: "Reminds devotees of the importance of truth, charity, and sharing prasad with the community.",
    upcomingDate: "2026-06-29",
    timings: "Morning Muhurtham: 9:00 AM to 12:30 PM",
    baseBudget: 2800
  },
  {
    name: "Ganesh Chaturthi Pooja",
    key: "ganesh-chaturthi-pooja",
    category: "festival",
    description: "Celebrates the birth of Lord Ganesha, the lord of wisdom, prosperity, and obstacle removal.",
    significance: "Invoking Lord Ganesha at home clears all hurdles from your career, business, and personal relationships.",
    upcomingDate: "2026-09-14",
    timings: "Puja Muhurtham: 11:03 AM to 1:32 PM",
    baseBudget: 1800
  }
];

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

export default function HomePage() {
  const { region, changeRegion, addToCart, API_BASE } = useApp();

  const [rituals, setRituals] = useState(localMockRituals);
  const [products, setProducts] = useState(localMockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, eventName: '' });

  // Dynamic Hero Section States
  const heroImagesList = ['/pooja.png', '/pooja2.png', '/pooja3.png', '/ganesh.png'];
  const [heroBg, setHeroBg] = useState('/pooja.png');
  const [heroIndex, setHeroIndex] = useState(0);

  // Set background based on upcoming event or cycle
  useEffect(() => {
    if (countdown.eventName) {
      const name = countdown.eventName.toLowerCase();
      if (name.includes('ganesh')) {
        setHeroBg('/ganesh.png');
        return;
      } else if (name.includes('diwali') || name.includes('lakshmi')) {
        setHeroBg('/pooja.png');
        return;
      } else if (name.includes('satyanarayana')) {
        setHeroBg('/pooja2.png');
        return;
      }
    }

    // Default: slideshow
    const interval = setInterval(() => {
      setHeroIndex((prev) => {
        const next = (prev + 1) % heroImagesList.length;
        setHeroBg(heroImagesList[next]);
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [countdown.eventName]);

  // Fetch Rituals and Products from API on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const ritualsRes = await fetch(`${API_BASE}/rituals`);
        if (ritualsRes.ok) {
          const ritualsData = await ritualsRes.json();
          if (ritualsData.length > 0) setRituals(ritualsData);
        }

        const productsRes = await fetch(`${API_BASE}/products`);
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          if (productsData.length > 0) setProducts(productsData);
        }
      } catch (err) {
        console.log("Could not reach API backend, operating in offline mode with mock catalogs.", err.message);
      }
    }
    fetchData();
  }, [API_BASE]);

  // Handle active countdown calculation
  useEffect(() => {
    // Find the next upcoming ritual (soonest upcomingDate)
    const sortedUpcoming = [...rituals]
      .map(r => ({ ...r, parsedDate: new Date(r.upcomingDate) }))
      .filter(r => r.parsedDate > new Date())
      .sort((a, b) => a.parsedDate - b.parsedDate);

    const nextEvent = sortedUpcoming[0];
    if (!nextEvent) return;

    const timer = setInterval(() => {
      const distance = nextEvent.parsedDate.getTime() - new Date().getTime();
      
      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds, eventName: nextEvent.name });
    }, 1000);

    return () => clearInterval(timer);
  }, [rituals]);

  // Filtering Logic
  const filteredRituals = rituals.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredProducts = products.filter((p) => {
    const matchesRegion = region === 'all' || p.region === 'all' || p.region === region;
    return matchesRegion;
  });

  const regionalHighlights = {
    telugu: "Highlights: Ugadi Pachadi ready-mix, organic mango leaves torans, and traditional raw turmeric roots.",
    tamil: "Highlights: Karthigai terracotta deepams, specialty temple kungumam, and banana leaf packs.",
    kannada: "Highlights: Karaga jasmine garlands, specialty dry prasadam mixes, and brass diyas.",
    hindi: "Highlights: Premium ganga jal boxes, clay idols from Kumartuli, and havan saamagri boxes.",
    malayalam: "Highlights: Aranmula mirror shapes, golden kasavu altar borders, and dry coconut halves."
  };

  return (
    <div className="space-y-12">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[480px] flex items-center justify-center text-white overflow-hidden py-24 px-4 bg-black">
        {/* Dynamic Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105"
          style={{ 
            backgroundImage: `url(${heroBg})`,
            filter: 'brightness(0.35) contrast(1.1)' 
          }}
        />

        {/* Traditional Sacred Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-crimson-dark/80 via-black/40 to-amber-dark/60 pointer-events-none" />

        {/* Rotating Sacred Mandala Background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 border border-gold/15 rounded-full animate-spin-slow opacity-20 flex items-center justify-center pointer-events-none">
          <div className="w-80 h-80 border-2 border-dashed border-gold/25 rounded-full flex items-center justify-center">
            <div className="w-64 h-64 border border-gold/30 rounded-full"></div>
          </div>
        </div>

        {/* Indicators for Slider */}
        {!countdown.eventName && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroImagesList.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => { setHeroBg(img); setHeroIndex(idx); }}
                className={`w-3.5 h-1.5 rounded-full transition-all duration-300 ${heroBg === img ? 'bg-gold w-6' : 'bg-white/40 hover:bg-white/70'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 space-y-6">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-gold/30 backdrop-blur-md text-xs md:text-sm font-bold text-gold animate-bounce">
            <Sparkles className="h-4 w-4" />
            Pooja, Festivals, & Vratams Made Easy
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide leading-tight max-w-4xl divine-glow-text">
            Bring Divine Blessings Home With Customized <span className="text-gold">Pooja Essentials</span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg max-w-2xl text-cream/80 font-medium">
            Select a festival or ritual, read its significance, configure your custom items list in our Smart Builder, and get everything shipped directly to your home.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-2xl bg-white/95 dark:bg-darkslate/95 p-2 rounded-full border border-gold divine-glow shadow-2xl flex items-center">
            <div className="flex items-center pl-3 flex-grow gap-2">
              <Search className="h-5 w-5 text-amber" />
              <input
                type="text"
                placeholder="Search poojas, vrathams, ceremonies (e.g., Satyanarayana, Diwali)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-slate-800 dark:text-white bg-transparent focus:outline-none placeholder-slate-400 font-medium text-sm sm:text-base"
              />
            </div>
            <button className="bg-gradient-to-r from-amber to-gold text-darkslate font-bold px-6 py-2.5 sm:py-3 rounded-full hover:shadow-md hover:scale-105 duration-200 transition-all">
              Find Pooja
            </button>
          </div>
        </div>
      </section>

      {/* 2. REGIONAL HIGHLIGHT BANNER */}
      {region !== 'all' && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-gold/10 border-2 border-gold/30 rounded-2xl p-4 flex items-center gap-3 text-sm font-medium">
            <MapPin className="h-5 w-5 text-crimson shrink-0" />
            <div>
              <span className="font-bold text-crimson uppercase">{region} Traditions Active:</span>{' '}
              <span className="text-slate-700 dark:text-slate-300">{regionalHighlights[region]}</span>
            </div>
            <button 
              onClick={() => changeRegion('all')}
              className="ml-auto text-xs font-bold text-crimson hover:underline"
            >
              Reset to All India
            </button>
          </div>
        </section>
      )}

      {/* 3. DYNAMIC COUNTDOWN SECTION */}
      {countdown.days > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-white dark:bg-darkslate border border-gold/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-crimson to-amber"></div>
            
            <div className="flex items-center gap-4">
              <div className="bg-amber/10 p-3 rounded-full text-amber">
                <Calendar className="h-8 w-8" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-amber tracking-wider">Next Auspicious Occasion</span>
                <h2 className="font-serif text-2xl font-bold">{countdown.eventName}</h2>
              </div>
            </div>

            {/* Countdown Clocks */}
            <div className="flex items-center gap-3 sm:gap-4 font-mono">
              <div className="flex flex-col items-center">
                <span className="bg-amber/10 text-amber dark:text-gold border border-gold/20 text-2xl sm:text-3xl font-extrabold w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center rounded-lg shadow-inner">
                  {countdown.days}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mt-1">Days</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-amber/10 text-amber dark:text-gold border border-gold/20 text-2xl sm:text-3xl font-extrabold w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center rounded-lg shadow-inner">
                  {countdown.hours}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mt-1">Hrs</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-amber/10 text-amber dark:text-gold border border-gold/20 text-2xl sm:text-3xl font-extrabold w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center rounded-lg shadow-inner">
                  {countdown.minutes}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mt-1">Mins</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-amber/10 text-amber dark:text-gold border border-gold/20 text-2xl sm:text-3xl font-extrabold w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center rounded-lg shadow-inner">
                  {countdown.seconds}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mt-1">Secs</span>
              </div>
            </div>

            <Link 
              href={`/rituals/${countdown.eventName.toLowerCase().replace(/ /g, '-')}`}
              className="flex items-center gap-2 bg-gradient-to-r from-crimson to-amber text-white font-bold px-6 py-3 rounded-lg hover:shadow-lg duration-200 shrink-0"
            >
              Order Ritual Essentials <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* 4. FESTIVAL & POOJA CATALOG */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 space-y-6 scroll-mt-24">
        <div className="text-center md:text-left flex flex-col md:flex-row md:items-end justify-between border-b border-gold/20 pb-4">
          <div>
            <h2 className="font-serif text-3xl font-bold text-spiritual-gradient dark:text-spiritual-gradient-dark">
              Rituals & Festivals Catalog
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your specific ritual to view complete checklist, significance, and procedures
            </p>
          </div>

          {/* Catalog Categories Selection Buttons */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 mt-4 md:mt-0 scrollbar-none">
            {['all', 'festival', 'vratham', 'ceremony', 'temple'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-crimson text-white divine-glow'
                    : 'bg-gold/10 hover:bg-gold/20 border border-gold/20'
                }`}
              >
                {cat}s
              </button>
            ))}
          </div>
        </div>

        {/* Ritual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRituals.map((ritual) => (
            <div
              key={ritual.key}
              className="bg-white dark:bg-darkslate border border-gold/20 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-gold group transition-all duration-300 flex flex-col"
            >
              <div className="bg-gradient-to-br from-gold/20 to-amber/10 p-6 flex flex-col gap-3 flex-grow">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-amber/20 text-amber dark:text-gold border border-gold/30 px-2 py-0.5 rounded">
                    {ritual.category}
                  </span>
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {ritual.upcomingDate}
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold group-hover:text-amber transition-colors duration-200">
                  {ritual.name}
                </h3>
                
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                  {ritual.description}
                </p>

                <ul className="text-xs space-y-1 mt-auto pt-3 border-t border-gold/10 text-slate-500">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    Customizable Smart Kit checklist
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-amber" />
                    Step-by-step procedure & aarti
                  </li>
                </ul>
              </div>

              <div className="p-4 border-t border-gold/10 flex items-center justify-between bg-gold/5">
                <span className="text-xs text-slate-500 font-semibold">
                  Budget: <span className="font-bold text-sm text-darkslate dark:text-cream">₹{ritual.baseBudget}</span>
                </span>
                <Link
                  href={`/rituals/${ritual.key}`}
                  className="bg-gradient-to-r from-crimson to-amber hover:shadow text-white text-xs font-bold px-4 py-2 rounded-lg duration-200"
                >
                  Configure Kit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS & COMBO KITS */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-spiritual-gradient dark:text-spiritual-gradient-dark">
            Featured Puja Kits & Sacred Items
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Carefully sourced, 100% pure organic ingredients assembled by local Indian vendors
          </p>
        </div>

        {/* Products Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod._id}
              className="bg-white dark:bg-darkslate border border-gold/20 rounded-2xl overflow-hidden hover:shadow-xl hover:border-amber/50 group transition-all duration-300 flex flex-col"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-cream overflow-hidden">
                <img
                  src={prod.images?.[0]}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 duration-300"
                />
                {prod.category === 'kit-combo' && (
                  <span className="absolute top-2 left-2 bg-crimson text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                    Combo Kit
                  </span>
                )}
              </div>

              <div className="p-4 flex-grow flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">{prod.category}</span>
                  <div className="flex items-center gap-1 font-bold text-amber">
                    <Star className="h-3.5 w-3.5 fill-current" /> {prod.rating}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-800 dark:text-cream line-clamp-2">
                  {prod.name}
                </h3>

                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {prod.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gold/10">
                  <span className="font-extrabold text-base text-crimson dark:text-gold">
                    ₹{prod.price}
                  </span>
                  <button
                    onClick={() => addToCart(prod, 1)}
                    className="flex items-center gap-1 bg-amber hover:bg-amber-dark text-darkslate font-bold text-xs px-3 py-1.5 rounded-lg duration-200 shadow"
                  >
                    <Package className="h-3.5 w-3.5" /> Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

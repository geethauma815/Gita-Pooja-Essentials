'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { Search, Calendar, ChevronRight, Sparkles, CheckCircle, Flame, HelpCircle } from 'lucide-react';

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

export default function CatalogPage() {
  const { API_BASE } = useApp();
  const [rituals, setRituals] = useState(localMockRituals);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('q');
      if (query) {
        setSearchQuery(query);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchRituals() {
      try {
        const res = await fetch(`${API_BASE}/rituals`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setRituals(data);
        }
      } catch (err) {
        console.log("Could not reach API backend, operating in offline catalog fallback mode.", err.message);
      }
    }
    fetchRituals();
  }, [API_BASE]);

  const filteredRituals = rituals.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 pb-16 animate-fade-in">
      
      {/* Banner / Header Section */}
      <section className="relative bg-black text-white py-16 px-4 overflow-hidden border-b border-gold/30">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105"
          style={{ 
            backgroundImage: `url('/pooja2.png')`,
            filter: 'brightness(0.4) contrast(1.1)' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-crimson-dark/95 via-black/80 to-amber-dark/80 pointer-events-none" />

        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 border border-gold/10 rounded-full animate-spin-slow opacity-25 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-dashed border-gold/15 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="flex items-center justify-center gap-1 bg-white/10 w-fit mx-auto px-4 py-1.5 rounded-full border border-gold/30 backdrop-blur-md text-xs font-bold text-gold">
            <Sparkles className="h-3.5 w-3.5 text-amber" />
            Vedic Altar Catalog
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide divine-glow-text">
            Sacred Rituals & Festive Directories
          </h1>
          
          <p className="text-xs sm:text-sm max-w-xl mx-auto text-cream/70 font-medium">
            Explore authentic pooja checklists, auspicious dates, timings, and procedures. Hand-selected for your family's spiritual milestones.
          </p>
        </div>
      </section>

      {/* Main Catalog Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search and Filters Header */}
        <div className="bg-white dark:bg-darkslate border border-gold/25 p-6 rounded-3xl shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="flex-grow max-w-xl bg-gold/5 dark:bg-black/20 p-1.5 rounded-full border border-gold/30 flex items-center">
              <div className="flex items-center pl-3 flex-grow gap-2">
                <Search className="h-4 w-4 text-amber" />
                <input
                  type="text"
                  placeholder="Search rituals, festivals, vrathams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm text-slate-800 dark:text-white bg-transparent focus:outline-none placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {['all', 'festival', 'vratham', 'ceremony', 'temple'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase transition duration-200 shrink-0 ${
                    activeCategory === cat
                      ? 'bg-crimson text-white divine-glow border border-crimson'
                      : 'bg-gold/5 hover:bg-gold/15 border border-gold/20'
                  }`}
                >
                  {cat}s
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Catalog Grid */}
        {filteredRituals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRituals.map((ritual) => (
              <div
                key={ritual.key}
                className="bg-white dark:bg-darkslate border border-gold/20 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-amber/40 group transition-all duration-300 flex flex-col justify-between"
              >
                <div className="bg-gradient-to-br from-gold/10 to-amber/5 p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold uppercase bg-amber/15 text-amber dark:text-gold border border-gold/20 px-2 py-0.5 rounded">
                        {ritual.category}
                      </span>
                      <div className="text-[10px] text-slate-400 font-bold font-mono flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-amber" /> {ritual.upcomingDate}
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold group-hover:text-amber transition-colors duration-200">
                      {ritual.name}
                    </h3>
                    
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {ritual.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-gold/10">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      <span>Customizable item checklist</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Flame className="h-4 w-4 text-amber shrink-0" />
                      <span>Auspicious Muhurthams listed</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gold/15 flex items-center justify-between bg-gold/5">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Estimated Budget</span>
                    <span className="font-extrabold text-sm text-slate-800 dark:text-cream">₹{ritual.baseBudget}</span>
                  </div>
                  
                  <Link
                    href={`/rituals/${ritual.key}`}
                    className="bg-gradient-to-r from-crimson to-amber hover:shadow-md text-white text-xs font-bold px-4 py-2 rounded-lg duration-200"
                  >
                    Configure Kit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-darkslate border border-gold/20 rounded-3xl max-w-xl mx-auto space-y-4">
            <HelpCircle className="h-12 w-12 text-slate-400 mx-auto animate-pulse" />
            <h3 className="font-serif text-lg font-bold text-slate-700 dark:text-cream">No Rituals Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No auspicious matches were found in our spiritual registry for "{searchQuery}". Try searching for 'Diwali' or 'Satyanarayana'.
            </p>
          </div>
        )}

      </section>
    </div>
  );
}

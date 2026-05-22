'use client';
import React from 'react';
import Link from 'next/link';
import { Sparkles, Flame, Package, Star, Calendar, ArrowRight, Hammer } from 'lucide-react';

const categoriesList = [
  {
    slug: 'kit-combo',
    name: 'Pooja & Festival Combo Kits',
    description: 'Complete, hand-curated prayer kits containing everything required for major Vedic rituals, vratams, and festivals.',
    count: '3 Kits Available',
    icon: Sparkles,
    color: 'from-amber to-gold',
    badge: 'Best Seller',
    tagline: 'Vedic-standard assemblies by local Pandits'
  },
  {
    slug: 'pooja-item',
    name: 'Pooja Samagri & Essentials',
    description: '100% pure, organic individual prayer ingredients including Gangotri Ganga Jal, Bhimseni camphor, kumkum, and incense.',
    count: '2 Essentials Available',
    icon: Flame,
    color: 'from-crimson to-amber',
    badge: 'Pure & Organic',
    tagline: 'Sourced directly from sacred origins'
  },
  {
    slug: 'decor',
    name: 'Divine Festive Decor',
    description: 'Enhance your altar with rangoli colors, organic marigold garlands, hand-carved terracotta diyas, and mango leaf torans.',
    count: '1 Decor Available',
    icon: Star,
    color: 'from-gold to-amber',
    badge: 'Eco-Friendly',
    tagline: 'Handmade by traditional artisans'
  },
  {
    slug: 'utensil',
    name: 'Sacred Utensils & Brassware',
    description: 'Timeless, handcrafted solid brass pooja thalis, kalash, panchapatra, incense stands, and bell sets.',
    count: '1 Utensil Available',
    icon: Hammer,
    color: 'from-yellow-600 to-yellow-400',
    badge: 'Lifetime Metal',
    tagline: 'Traditional heavy-gauge brass'
  },
  {
    slug: 'prasad',
    name: 'Prasadam & Offerings',
    description: 'Pure Naivedyam offerings including ready-mix Rava Prasad, dry fruits, organic honey, and rock candies.',
    count: '1 Offering Available',
    icon: Package,
    color: 'from-orange-500 to-amber',
    badge: 'Naivedyam Pure',
    tagline: 'Prepared in highly clean home hearths'
  }
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center relative py-8 overflow-hidden rounded-3xl bg-gradient-to-r from-crimson-dark via-crimson to-amber p-8 text-white shadow-xl border border-gold/30">
        {/* Abstract Mandala Background */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber via-crimson to-black bg-mandala animate-spin-slow"></div>
        <div className="relative z-10 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold bg-white/10 px-3 py-1 rounded-full border border-gold/20">
            Sacred Offerings Directory
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide">
            Explore Holy Categories
          </h1>
          <p className="text-sm max-w-xl mx-auto text-cream/80">
            Select a specialized category to browse organic essentials, copper utensils, and ready-made custom kits assembled for your devotion.
          </p>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoriesList.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col bg-white dark:bg-darkslate border border-gold/20 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-amber transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Header Gradient Strip with Icon */}
              <div className={`bg-gradient-to-r ${cat.color} p-6 flex justify-between items-start text-darkslate relative overflow-hidden`}>
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
                  <IconComponent className="h-32 w-32" />
                </div>
                <div className="bg-white/90 p-3 rounded-2xl shadow-md z-10">
                  <IconComponent className="h-6 w-6 text-crimson" />
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-darkslate text-white px-2.5 py-1 rounded-full shadow-sm z-10">
                  {cat.badge}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-slate-800 dark:text-cream group-hover:text-amber duration-200">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gold/10 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Available</span>
                    <span className="text-xs font-bold text-crimson dark:text-gold">{cat.count}</span>
                  </div>
                  
                  <span className="flex items-center gap-1 text-xs font-bold text-amber group-hover:text-crimson dark:group-hover:text-gold transition-colors">
                    Explore Items <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 duration-200" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Custom Ritual Guide Redirect Card */}
        <Link
          href="/#catalog"
          className="group flex flex-col bg-gradient-to-b from-crimson-dark to-crimson text-white border border-gold/30 rounded-3xl p-6 justify-between hover:shadow-2xl hover:border-gold duration-300 transform hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-5">
            <Calendar className="h-48 w-48" />
          </div>
          <div className="space-y-4">
            <div className="bg-white/10 w-fit p-3 rounded-2xl border border-white/20">
              <Calendar className="h-6 w-6 text-gold" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-gold">Rituals & Muhurthams</span>
              <h3 className="font-serif text-xl font-bold text-gold">Festivals & Vratams</h3>
              <p className="text-xs text-cream/70 leading-relaxed">
                Need details for specific celebrations? Browse step-by-step procedures, timing details, and customizable checklists for Satyanarayana, Diwali, and Ganesh Chaturthi.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-gold">
            <span className="text-xs font-bold text-white">View Calendar & Guides</span>
            <span className="flex items-center gap-1 text-xs font-bold bg-white text-darkslate px-4 py-2 rounded-xl group-hover:bg-gold duration-200 shadow-md">
              Browse Guides <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

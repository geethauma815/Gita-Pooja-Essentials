'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { API_BASE } = useApp();
  const [footerPages, setFooterPages] = useState([]);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch(`${API_BASE}/pages`);
        if (res.ok) {
          const data = await res.json();
          setFooterPages(data);
        } else {
          throw new Error('Offline fallback');
        }
      } catch (err) {
        // Fallback to local storage
        const stored = localStorage.getItem('dynamic_pages');
        if (stored) {
          try {
            setFooterPages(JSON.parse(stored));
          } catch(e) {}
        } else {
          setFooterPages([
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
          setFooterPages(JSON.parse(stored));
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

  return (
    <footer className="bg-darkslate text-cream border-t border-gold/40 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* About Section */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-spiritual-gradient-dark tracking-wider">
            GITA DIVINE
          </h3>
          <p className="text-xs text-cream/70 leading-relaxed">
            Bridging age-old Vedic traditions with modern convenience. We deliver organic, high-quality, and custom-curated pooja, festival, and wedding ritual kits directly to your doorstep across India.
          </p>
        </div>

        {/* Catalog Categories */}
        <div>
          <h4 className="text-sm font-bold uppercase text-gold tracking-widest mb-4">Ritual Categories</h4>
          <ul className="space-y-2 text-xs text-cream/80">
            <li><Link href="/#catalog" className="hover:text-amber duration-200">Major Festivals</Link></li>
            <li><Link href="/#catalog" className="hover:text-amber duration-200">Vedic Vrathams</Link></li>
            <li><Link href="/#catalog" className="hover:text-amber duration-200">Housewarming Ceremony</Link></li>
            <li><Link href="/#catalog" className="hover:text-amber duration-200">Temple Offerings</Link></li>
            <li><Link href="/#catalog" className="hover:text-amber duration-200">Wedding Essentials</Link></li>
          </ul>
        </div>

        {/* Traditions Support */}
        <div>
          <h4 className="text-sm font-bold uppercase text-gold tracking-widest mb-4">Regional Traditions</h4>
          <ul className="space-y-2 text-xs text-cream/80 font-medium">
            <li>Telugu / Sampradayam</li>
            <li>Tamil / Puja Murai</li>
            <li>Kannada / Paddhati</li>
            <li>Kerala / Malayalam</li>
            <li>North Indian / Sanatan</li>
          </ul>
        </div>

        {/* Spiritual Guides (Dynamic Pages) */}
        <div>
          <h4 className="text-sm font-bold uppercase text-gold tracking-widest mb-4">Spiritual Guides</h4>
          <ul className="space-y-2 text-xs text-cream/80">
            {footerPages.length > 0 ? (
              footerPages.map((pg) => (
                <li key={pg.slug}>
                  <Link href={`/pages/${pg.slug}`} className="hover:text-amber duration-200 block truncate">
                    {pg.title}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-cream/50 italic">No custom guides published yet</li>
            )}
          </ul>
        </div>

        {/* Trust Badges / Newsletter */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase text-gold tracking-widest mb-4">Platform Assurances</h4>
          <ul className="space-y-1.5 text-[11px] text-cream/70">
            <li>🌿 100% Biodegradable & Clay Idols</li>
            <li>🐄 Pure Desi Cow Ghee & Organic Haldi</li>
            <li>🤝 Empowering 1000+ Rural Local Potters</li>
            <li>📦 Safe Tamper-proof Sacred Packaging</li>
          </ul>
          <div className="pt-2 border-t border-gold/10">
            <p className="text-[10px] text-cream/50">
              © {new Date().getFullYear()} Gita Divine Studios Private Limited. All spiritual rights and blessings reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}

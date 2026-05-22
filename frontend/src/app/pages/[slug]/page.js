'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { ChevronLeft, Calendar, FileText, Image as ImageIcon } from 'lucide-react';

const defaultPages = [
  {
    title: "About Gita Divine",
    slug: "about-us",
    content: `<h2>About Gita Divine Essentials</h2><p>Welcome to Gita Divine, your trusted bridge to authentic Vedic traditions. We are committed to sourcing pure, organic, and scripturally approved pooja items and kits for devotees across India.</p><h3>Our Mission</h3><p>We work closely with local Vedic scholars and rural artisans to curate ritual checklists, traditional brassware, organic kumkum, and clay idols. By choosing Gita Divine, you support local potters and weavers while ensuring absolute purity in your prayers.</p>`,
    images: ["/pooja.png", "/pooja2.png"]
  },
  {
    title: "Vedic Temples & Devotion Guide",
    slug: "temple-guide",
    content: `<h2>Guide to Temple Worship & Devotion</h2><p>In Hinduism, temple worship is a powerful means of communion with the divine. This guide offers insights on simple protocols for visiting and offering prayers at sacred shrines.</p><h3>Key Offerings</h3><ul><li><strong>Archana Kit:</strong> Coconut, flowers, betel leaves, camphor, and incense.</li><li><strong>Prasadam:</strong> Hand-made sweets offered to the deity and distributed to all.</li></ul>`,
    images: ["/pooja3.png", "/ganesh.png"]
  }
];

export default function DynamicPageViewer({ params }) {
  const { API_BASE } = useApp();
  const slug = params?.slug;

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/pages/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPage(data);
        } else {
          throw new Error('Not found in DB');
        }
      } catch (err) {
        console.log("Database offline or page not found, checking local fallback for slug:", slug);
        
        // 1. Check local storage for admin-created pages
        const storedPagesStr = localStorage.getItem('dynamic_pages');
        let foundPage = null;
        
        if (storedPagesStr) {
          try {
            const storedPages = JSON.parse(storedPagesStr);
            foundPage = storedPages.find(p => p.slug === slug);
          } catch (e) {
            console.error("Error parsing stored pages", e);
          }
        }

        // 2. Check pre-seeded default pages
        if (!foundPage) {
          foundPage = defaultPages.find(p => p.slug === slug);
        }

        if (foundPage) {
          setPage(foundPage);
        } else {
          setError("Spiritually Guided Page Not Found");
        }
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPage();
    }
  }, [slug, API_BASE]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold border-t-crimson rounded-full animate-spin mx-auto"></div>
        <p className="font-serif text-lg text-slate-500 font-bold">Invoking divine page details...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 bg-white dark:bg-darkslate border-2 border-gold rounded-3xl mt-12 p-8 shadow-xl">
        <FileText className="h-14 w-14 text-crimson mx-auto animate-pulse" />
        <h3 className="font-serif text-2xl font-bold text-slate-800 dark:text-cream">{error || 'Page Not Found'}</h3>
        <p className="text-xs text-slate-500">
          This informational portal is currently offline or has not been registered by the temple administrator.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-gradient-to-r from-crimson to-amber text-white font-bold text-xs uppercase px-6 py-3 rounded-full shadow hover:shadow-lg transition duration-200"
        >
          Return to Altar
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-crimson dark:text-gold uppercase tracking-wider hover:underline">
        <ChevronLeft className="h-4 w-4" /> Back to Home
      </Link>

      {/* Main Page Container */}
      <article className="bg-white dark:bg-darkslate border border-gold/30 rounded-3xl shadow-xl overflow-hidden">
        
        {/* Sacred Decorative Banner Header */}
        <div className="bg-gradient-to-r from-crimson-dark via-crimson to-amber-dark text-white p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 border border-gold/15 rounded-full animate-spin-slow opacity-25 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 border border-dashed border-gold/20 rounded-full"></div>
          </div>
          
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] uppercase font-bold text-gold tracking-widest bg-white/10 px-3 py-1 rounded-full border border-gold/30">
              Spiritual Guide & Info
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-cream tracking-wide">
              {page.title}
            </h1>
            <p className="text-[11px] text-cream/70 font-semibold uppercase flex items-center gap-1">
              <Calendar className="h-3 w-3 text-amber" /> Published: {new Date(page.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Dynamic HTML Content */}
        <div className="p-8 sm:p-10 space-y-8">
          <div 
            className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200
                       prose-headings:font-serif prose-headings:text-crimson dark:prose-headings:text-gold prose-headings:font-bold
                       prose-h2:text-2xl prose-h3:text-lg prose-h3:mt-4 prose-p:my-3 prose-ul:list-disc prose-ul:pl-5"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          {/* Render 2 to 3 dynamic images if available */}
          {page.images && page.images.filter(img => img).length > 0 && (
            <div className="pt-8 border-t border-gold/20">
              <h3 className="font-serif text-lg font-bold text-crimson dark:text-gold flex items-center gap-1.5 mb-4">
                <ImageIcon className="h-5 w-5 text-amber" /> Sacred Visual Gallery
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {page.images
                  .filter(img => img)
                  .map((imageUrl, idx) => (
                    <div 
                      key={idx} 
                      className="group overflow-hidden rounded-2xl border-2 border-gold/25 bg-gold/5 shadow shadow-gold/5 transition duration-300 hover:border-gold/60"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt={`Sacred gallery index ${idx + 1}`} 
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-3">
                          <span className="text-white text-xs font-bold font-serif">Image {idx + 1}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Mini Help Section */}
      <div className="bg-gold/5 border border-gold/20 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-serif font-bold text-slate-800 dark:text-cream">Need assistance with dynamic checkouts?</h4>
          <p className="text-xs text-slate-500">Ask our AI chatbot for immediate spiritual guidance and items recommendation.</p>
        </div>
        <Link 
          href="/" 
          className="bg-transparent border border-crimson hover:bg-crimson/5 text-crimson dark:text-gold dark:border-gold dark:hover:bg-gold/5 font-bold text-xs uppercase px-5 py-2.5 rounded-full transition duration-200"
        >
          Explore Altar
        </Link>
      </div>
    </div>
  );
}

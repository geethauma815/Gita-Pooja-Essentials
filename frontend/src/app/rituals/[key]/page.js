'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import KitBuilder from '../../../components/KitBuilder';
import { Calendar, Clock, BookOpen, Flame, Compass, ChevronRight, Award } from 'lucide-react';

const localMockRituals = [
  {
    name: "Diwali Lakshmi Pooja",
    key: "diwali-lakshmi-pooja",
    category: "festival",
    description: "Diwali Lakshmi Pooja is performed on the auspicious night of Deepavali to welcome Goddess Lakshmi, the deity of wealth, and Lord Ganesha, the lord of new beginnings, into households for a prosperous year ahead.",
    significance: "Worshipping Goddess Lakshmi during Pradosh Kaal represents cleansing the house of negativity, inviting financial stability, spiritual wisdom, and intellectual growth.",
    upcomingDate: "2026-11-08",
    timings: "Pradosh Kaal Muhurtham: 5:42 PM to 7:21 PM",
    baseBudget: 1500,
    checklist: [
      { name: "Clay Diyas (Pack of 11)", baseQuantity: "1 Pack", optional: false, estimatedPrice: 150, category: "Essential" },
      { name: "Kumkum & Haldi Set", baseQuantity: "1 Pack", optional: false, estimatedPrice: 40, category: "Essential" },
      { name: "Pooja Akshata (Sacred Rice)", baseQuantity: "100g", optional: false, estimatedPrice: 50, category: "Essential" },
      { name: "Ganga Jal (Sacred Water)", baseQuantity: "1 Bottle", optional: false, estimatedPrice: 60, category: "Essential" },
      { name: "Cotton Wicks (Round & Long)", baseQuantity: "1 Pack", optional: false, estimatedPrice: 30, category: "Essential" },
      { name: "Scented Agarbatti (Incense)", baseQuantity: "1 Box", optional: false, estimatedPrice: 80, category: "Essential" },
      { name: "Camphor (Karpur)", baseQuantity: "1 Pack", optional: false, estimatedPrice: 45, category: "Essential" },
      { name: "Fresh Marigold Garlands", baseQuantity: "2 Pcs", optional: false, estimatedPrice: 200, category: "Fresh Items" },
      { name: "Mango Leaves Toran", baseQuantity: "1 Pc", optional: true, estimatedPrice: 100, category: "Fresh Items" },
      { name: "Brass Pooja Thali (Plate)", baseQuantity: "1 Pc", optional: true, estimatedPrice: 450, category: "Utensil" },
      { name: "Kaju Katli Sweet Box", baseQuantity: "250g", optional: true, estimatedPrice: 300, category: "Prasad" }
    ],
    steps: [
      { stepNumber: 1, title: "Purification & Altar setup", instruction: "Clean the pooja space. Place a wooden board, spread a fresh red cloth, and position the idols of Ganesha and Lakshmi." },
      { stepNumber: 2, title: "Kalash Avahanam", instruction: "Fill a brass or copper pot with water, place mango leaves, and place a coconut covered in turmeric on top." },
      { stepNumber: 3, title: "Dhyaanam & Sankalpa", instruction: "Meditate upon Lord Ganesha and Goddess Lakshmi, announcing your name and family gotra for the prayers." },
      { stepNumber: 4, title: "Shodashopachara Worship", instruction: "Perform the 16 steps of puja: wash feet, offer fresh flowers, light incense, ring bells, and apply haldi-kumkum." },
      { stepNumber: 5, title: "Naivedyam & Aarti", instruction: "Offer sweets (Laddus/Kaju Katli), perform camphor aarti while chanting the stotrams, and distribute prasad." }
    ]
  },
  {
    name: "Satyanarayana Vratham",
    key: "satyanarayana-vratham",
    category: "vratham",
    description: "Satyanarayana Vratham is a traditional worship of Lord Vishnu, typically executed on Purnima (full moon) days or key lifecycle events like housewarmings (Gruhapravesham) and marriages.",
    significance: "Brings tranquility, removes domestic obstacles, and reinforces truth, integrity, and social unity through the distribution of sacred Prasad.",
    upcomingDate: "2026-06-29",
    timings: "Auspicious Muhurtham: 9:00 AM to 12:30 PM",
    baseBudget: 2800,
    checklist: [
      { name: "Satyanarayana Frame/Idol", baseQuantity: "1 Pc", optional: true, estimatedPrice: 500, category: "Essential" },
      { name: "Pooja Kalash (Copper)", baseQuantity: "1 Pc", optional: true, estimatedPrice: 350, category: "Utensil" },
      { name: "Raw Coconut with Husk", baseQuantity: "2 Pcs", optional: false, estimatedPrice: 80, category: "Fresh Items" },
      { name: "Fresh Betel Leaves & Nuts", baseQuantity: "11 Pairs", optional: false, estimatedPrice: 120, category: "Fresh Items" },
      { name: "Mixed Flower Garlands & Petals", baseQuantity: "1 Pack", optional: false, estimatedPrice: 250, category: "Fresh Items" },
      { name: "Pure Cow Ghee", baseQuantity: "200ml", optional: false, estimatedPrice: 190, category: "Essential" },
      { name: "Panchamrut (Milk, Curd, Honey, Ghee, Sugar Mix)", baseQuantity: "1 Bottle", optional: false, estimatedPrice: 150, category: "Essential" },
      { name: "Haldi-Kumkum-Sandala Set", baseQuantity: "1 Pack", optional: false, estimatedPrice: 60, category: "Essential" },
      { name: "Tulsi Leaves (Holy Basil)", baseQuantity: "1 Pack", optional: false, estimatedPrice: 50, category: "Fresh Items" },
      { name: "Dry Fruits Mix", baseQuantity: "200g", optional: true, estimatedPrice: 300, category: "Prasad" },
      { name: "Yellow Altar Cloth (Peetham Cloth)", baseQuantity: "1 Pc", optional: false, estimatedPrice: 100, category: "Essential" }
    ],
    steps: [
      { stepNumber: 1, title: "Sankalpam", instruction: "Take water in your hand and state your name, family details, and the purpose of performing the vratham." },
      { stepNumber: 2, title: "Ganesha Pooja", instruction: "Worship Lord Ganesha to remove all obstacles from the ritual execution." },
      { stepNumber: 3, title: "Navagraha Pooja", instruction: "Worship the nine planetary deities for peace and harmony." },
      { stepNumber: 4, title: "Prana Pratishtha & Archana", instruction: "Invoke Lord Satyanarayana into the Kalash. Recite the Vishnu Sahasranamam or Lord's names, offering Tulsi leaves and flowers." },
      { stepNumber: 5, title: "Vratha Katha Reading", instruction: "Read or listen to the five traditional stories/chapters of the Satyanarayana Vratham." },
      { stepNumber: 6, title: "Prasad Offering & Distribution", instruction: "Offer the special Rava Prasadam (prepared with equal parts wheat semolina, sugar, ghee, milk, banana) and distribute it to everyone present." }
    ]
  },
  {
    name: "Ganesh Chaturthi Pooja",
    key: "ganesh-chaturthi-pooja",
    category: "festival",
    description: "A major annual festival celebrating the birth of Lord Ganesha. Installing Ganesha idols at home helps clear personal hurdles and invokes luck.",
    significance: "Worshipping with fresh Durva grass, modaks, and traditional flowers invokes wisdom, patience, and good vibes in the household.",
    upcomingDate: "2026-09-14",
    timings: "Auspicious Muhurtham: 11:03 AM to 1:32 PM",
    baseBudget: 1800,
    checklist: [
      { name: "Clay Eco-Friendly Ganesha Idol", baseQuantity: "1 Pc", optional: false, estimatedPrice: 600, category: "Essential" },
      { name: "Durva Grass (31 Blades)", baseQuantity: "1 Bundle", optional: false, estimatedPrice: 40, category: "Fresh Items" },
      { name: "Red Hibiscus Flowers", baseQuantity: "1 Pack", optional: false, preferredRegion: "all", estimatedPrice: 100, category: "Fresh Items" },
      { name: "Modak Sweet Box (Steamed/Fried)", baseQuantity: "11 Pcs", optional: false, estimatedPrice: 250, category: "Prasad" },
      { name: "Sandalwood Paste (Chandan)", baseQuantity: "1 Tube", optional: false, estimatedPrice: 70, category: "Essential" },
      { name: "Janeu (Sacred Thread)", baseQuantity: "1 Pair", optional: false, estimatedPrice: 25, category: "Essential" },
      { name: "Turmeric & Vermillion", baseQuantity: "1 Pack", optional: false, estimatedPrice: 40, category: "Essential" },
      { name: "Aromatic Agarbatti & Camphor", baseQuantity: "1 Pack", optional: false, estimatedPrice: 75, category: "Essential" },
      { name: "Banana Leaves (For serving/altar)", baseQuantity: "2 Pcs", optional: true, estimatedPrice: 50, category: "Fresh Items" },
      { name: "Pooja Bell (Brass)", baseQuantity: "1 Pc", optional: true, estimatedPrice: 250, category: "Utensil" }
    ],
    steps: [
      { stepNumber: 1, title: "Prana Pratishtha", instruction: "Chant the Ganesha mantra to invite the deity's energy into the clay idol." },
      { stepNumber: 2, title: "Shodashopachara Worship", instruction: "Offer 16 types of service including washing feet, applying Chandan, offering janeu, and clothing." },
      { stepNumber: 3, title: "Offer Grass & Flowers", instruction: "Ganesha is fond of Durva grass and Red Hibiscus. Offer them with devotion." },
      { stepNumber: 4, title: "Modak Naivedyam", instruction: "Offer Modaks, laddus, and seasonal fruits to the deity." },
      { stepNumber: 5, title: "Ganesha Aarti", instruction: "Sing 'Jai Ganesh, Deva' and perform the aarti with burning camphor. Ring bells and blow the conch shell." }
    ]
  }
];

export default function RitualDetailPage({ params }) {
  const { API_BASE } = useApp();
  const [ritual, setRitual] = useState(null);
  const [activeTab, setActiveTab] = useState('procedure');

  useEffect(() => {
    async function fetchRitual() {
      try {
        const res = await fetch(`${API_BASE}/rituals/${params.key}`);
        if (res.ok) {
          const data = await res.json();
          setRitual(data);
        } else {
          // Fallback to local array
          const localMatch = localMockRituals.find(r => r.key === params.key);
          setRitual(localMatch);
        }
      } catch (err) {
        const localMatch = localMockRituals.find(r => r.key === params.key);
        setRitual(localMatch);
      }
    }
    fetchModelData();
    async function fetchModelData() {
      await fetchRitual();
    }
  }, [params.key, API_BASE]);

  if (!ritual) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. Ritual Cover & Header */}
      <section className="bg-gradient-to-br from-crimson-dark via-crimson to-amber-dark text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col md:flex-row justify-between gap-8 relative overflow-hidden">
        {/* Decorative Ring Background */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full border border-gold/10 animate-spin-slow"></div>

        <div className="space-y-4 max-w-3xl relative z-10">
          <span className="bg-gold text-darkslate text-xs font-bold uppercase px-3 py-1 rounded-full border border-white/20">
            {ritual.category} Variant
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide">
            {ritual.name}
          </h1>
          <p className="text-sm sm:text-base text-cream/90 leading-relaxed">
            {ritual.description}
          </p>

          {/* Timing details */}
          <div className="flex flex-wrap items-center gap-4 pt-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-xl border border-white/20">
              <Calendar className="h-4 w-4 text-gold" />
              <span>Upcoming Date: {ritual.upcomingDate}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-xl border border-white/20">
              <Clock className="h-4 w-4 text-gold" />
              <span>Auspicious Muhurtham: {ritual.timings}</span>
            </div>
          </div>
        </div>

        {/* Badge of Authenticity */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-white/10 border border-gold/40 p-6 rounded-2xl backdrop-blur-sm self-center text-center max-w-[200px] shrink-0">
          <Award className="h-10 w-10 text-gold mb-2" />
          <h4 className="text-sm font-bold text-gold font-serif">Vedic Certified</h4>
          <p className="text-[10px] text-cream/70 mt-1">Checklists verified by certified Purohits & temple advisors.</p>
        </div>
      </section>

      {/* 2. Grid split: Details vs Kit Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Significance & Steps (7 Columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-darkslate border border-gold/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
          
          {/* Significance */}
          <div className="space-y-2 pb-6 border-b border-gold/10">
            <h3 className="font-serif text-xl font-bold text-crimson dark:text-gold flex items-center gap-2">
              <Compass className="h-5 w-5" /> Ritual Significance
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {ritual.significance || ritual.description}
            </p>
          </div>

          {/* Procedure Navigation Tabs */}
          <div className="space-y-4">
            <div className="flex border-b border-gold/15">
              <button
                onClick={() => setActiveTab('procedure')}
                className={`pb-2.5 px-4 font-serif text-base font-bold transition-all duration-200 border-b-2 -mb-[1px] ${
                  activeTab === 'procedure'
                    ? 'border-crimson text-crimson dark:border-gold dark:text-gold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Procedure & Steps
              </button>
              <button
                onClick={() => setActiveTab('tips')}
                className={`pb-2.5 px-4 font-serif text-base font-bold transition-all duration-200 border-b-2 -mb-[1px] ${
                  activeTab === 'tips'
                    ? 'border-crimson text-crimson dark:border-gold dark:text-gold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Preparation Tips
              </button>
            </div>

            {/* Tab: Procedure steps */}
            {activeTab === 'procedure' && (
              <div className="space-y-6 pt-2">
                {ritual.steps?.map((step) => (
                  <div key={step.stepNumber} className="flex gap-4 items-start relative group">
                    {/* Ring Indicator */}
                    <div className="flex-shrink-0 bg-gold text-darkslate font-bold font-mono h-8 w-8 rounded-full flex items-center justify-center text-sm shadow divine-glow-amber">
                      {step.stepNumber}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-cream">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Preparation Tips */}
            {activeTab === 'tips' && (
              <div className="space-y-4 pt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <div className="p-4 bg-gold/5 rounded-2xl border border-gold/15 space-y-2">
                  <h4 className="font-bold text-sm text-crimson dark:text-gold flex items-center gap-1">
                    <BookOpen className="h-4 w-4" /> Puja Altar Placement
                  </h4>
                  <p>Clean your pooja room thoroughly on the day of worship. Build a small pedestal using a wooden plank (Peetham) and orient it such that the idols face East or North. Decorate with rangoli in front of the platform.</p>
                </div>
                <div className="p-4 bg-gold/5 rounded-2xl border border-gold/15 space-y-2">
                  <h4 className="font-bold text-sm text-crimson dark:text-gold flex items-center gap-1">
                    <Flame className="h-4 w-4" /> Prasadam Protocols
                  </h4>
                  <p>Prepare offerings using organic ingredients without tasting beforehand. Clean cooking utensils entirely. Traditionally, sweets like Rava Prasadam, Laddoos, or Payasam are prepared with pure cow ghee and cardamom.</p>
                </div>
                <div className="p-4 bg-gold/5 rounded-2xl border border-gold/15 space-y-2">
                  <h4 className="font-bold text-sm text-crimson dark:text-gold flex items-center gap-1">
                    <Award className="h-4 w-4" /> Traditional Dress Code
                  </h4>
                  <p>It is recommended that male worship practitioners wear traditional clean white dhotis or kurtas, and female practitioners wear traditional silk sarees or salwar suits to maintain spiritual sanctity.</p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Side: Kit Builder (5 Columns) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <KitBuilder ritual={ritual} />
        </div>

      </div>

    </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Info, Plus, Minus, Check, ShoppingBag, AlertCircle } from 'lucide-react';

export default function KitBuilder({ ritual }) {
  const { addToCart, addAlert } = useApp();
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Initialize checklist items with quantity and active status
  useEffect(() => {
    if (ritual && ritual.checklist) {
      const formattedItems = ritual.checklist.map((item, idx) => ({
        id: idx,
        name: item.name,
        baseQuantity: item.baseQuantity,
        estimatedPrice: item.estimatedPrice,
        category: item.category || 'Essential',
        optional: item.optional || false,
        active: true, // Default to checked
        qtyMultiplier: 1 // Default multiplier
      }));
      setItems(formattedItems);
    }
  }, [ritual]);

  // Recalculate total price whenever items modify
  useEffect(() => {
    const sum = items.reduce((acc, item) => {
      if (item.active) {
        return acc + (item.estimatedPrice * item.qtyMultiplier);
      }
      return acc;
    }, 0);
    setTotalPrice(sum);
  }, [items]);

  const toggleItemActive = (id) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  const adjustMultiplier = (id, amount) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextMult = item.qtyMultiplier + amount;
          return { ...item, qtyMultiplier: Math.max(1, nextMult) };
        }
        return item;
      })
    );
  };

  const handleAddBundleToCart = () => {
    const activeItems = items.filter(i => i.active);
    if (activeItems.length === 0) {
      addAlert('Please select at least one item to build your kit.', 'error');
      return;
    }

    // Prepare a mock Product object representing this ritual kit combo
    const productRepresentation = {
      _id: `custom_kit_${ritual.key}`,
      name: `Custom ${ritual.name} Kit`,
      price: totalPrice,
      images: ["https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&auto=format&fit=crop&q=60"],
      category: "kit-combo"
    };

    addToCart(productRepresentation, 1, activeItems);
  };

  return (
    <div className="bg-white dark:bg-darkslate border-2 border-gold rounded-3xl p-6 sm:p-8 divine-glow shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gold/20">
        <div>
          <h3 className="font-serif text-2xl font-bold text-spiritual-gradient dark:text-spiritual-gradient-dark">
            Smart Kit Builder
          </h3>
          <p className="text-xs text-slate-500">
            Deselect items you already have at home to reduce the kit price
          </p>
        </div>
        <div className="bg-gold/15 border border-gold/30 px-4 py-2 rounded-xl text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Kit Price</span>
          <span className="font-extrabold text-2xl text-crimson dark:text-gold">₹{totalPrice}</span>
        </div>
      </div>

      {/* Checklist items list */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
              item.active
                ? 'bg-gold/5 border-gold/40'
                : 'bg-slate-100/50 dark:bg-black/10 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Checkbox */}
              <button
                onClick={() => toggleItemActive(item.id)}
                className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                  item.active
                    ? 'bg-crimson border-crimson text-white divine-glow'
                    : 'border-slate-300 dark:border-slate-600 bg-transparent'
                }`}
              >
                {item.active && <Check className="h-3.5 w-3.5" />}
              </button>
              
              <div>
                <span className={`text-sm font-bold block ${item.active ? 'text-slate-800 dark:text-cream' : 'text-slate-400 line-through'}`}>
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  {item.category} • Base Qty: {item.baseQuantity}
                </span>
              </div>
            </div>

            {/* Quantity Multiplier Control & Price */}
            <div className="flex items-center gap-4">
              {item.active && (
                <div className="flex items-center border border-gold/30 rounded-lg overflow-hidden bg-white dark:bg-black/20">
                  <button
                    onClick={() => adjustMultiplier(item.id, -1)}
                    className="p-1 px-2 hover:bg-gold/10 duration-100 text-xs font-bold"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-xs font-bold px-2">{item.qtyMultiplier}x</span>
                  <button
                    onClick={() => adjustMultiplier(item.id, 1)}
                    className="p-1 px-2 hover:bg-gold/10 duration-100 text-xs font-bold"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              <span className={`text-sm font-extrabold w-16 text-right ${item.active ? 'text-crimson dark:text-gold' : 'text-slate-400'}`}>
                ₹{item.estimatedPrice * item.qtyMultiplier}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Warning Tip */}
      <div className="flex items-start gap-2 bg-amber/10 border border-amber/20 p-3 rounded-xl text-xs text-amber-900 dark:text-amber-200">
        <AlertCircle className="h-4 w-4 shrink-0 text-amber" />
        <p>
          <strong>Devotional Tip:</strong> Essential items are prepared fresh. Coconuts and betel leaves are packaged early morning in organic leaves.
        </p>
      </div>

      {/* Checkout Add Button */}
      <button
        onClick={handleAddBundleToCart}
        className="w-full bg-gradient-to-r from-crimson to-amber text-white font-bold py-4 rounded-xl hover:shadow-lg divine-glow-amber flex items-center justify-center gap-2 transition-all duration-200"
      >
        <ShoppingBag className="h-5 w-5" /> Add Customized Kit to Cart
      </button>

    </div>
  );
}

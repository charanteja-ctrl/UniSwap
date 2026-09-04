"use client";

import React from "react";

const categories = [
  { name: "Books", icon: "📚", color: "#dbeafe" },
  { name: "Electronics", icon: "💻", color: "#e0f2fe" },
  { name: "Calculators", icon: "🧮", color: "#ede9fe" },
  { name: "Clothing", icon: "👕", color: "#fce7f3" },
  { name: "Stationery", icon: "📓", color: "#fef3c7" },
  { name: "Bags", icon: "🎒", color: "#dcfce7" },
  { name: "Hostel Items", icon: "🛏️", color: "#f1f5f9" },
  { name: "Free Items", icon: "🎁", color: "#cffafe" },
];

export default function CategoryMarquee({
  onSelectCategory,
}: {
  onSelectCategory?: (category: string) => void;
}) {
  // Render array twice for a seamless infinite marquee loop
  const repeatedCategories = [...categories, ...categories];

  return (
    <section id="categories" className="w-full py-6 overflow-hidden">
      <div className="relative w-full marquee-mask">
        <div className="animate-marquee flex items-center gap-4 py-2">
          {repeatedCategories.map((cat, idx) => (
            <button
              key={`${cat.name}-${idx}`}
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
              className="group relative h-24 w-40 shrink-0 flex flex-col items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Subtle colored background with hover opacity increase */}
              <div
                className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${cat.color} 0%, #ffffff 100%)`,
                }}
              />

              {/* Card Content */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl transform group-hover:scale-110 transition-transform duration-200">
                  {cat.icon}
                </span>
                <span className="font-display font-medium text-xs text-slate-800 tracking-tight">
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

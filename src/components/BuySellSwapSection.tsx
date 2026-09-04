"use client";

import React from "react";
import { motion } from "motion/react";
import { ShoppingCart, Tag, RefreshCw, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function BuySellSwapSection() {
  const cards = [
    {
      title: "BUY",
      subtitle: "Find what you need without paying full price.",
      description: "Get textbooks, lab drafters, calculators, and electronics from campus seniors who took the exact same courses.",
      icon: <ShoppingCart className="w-6 h-6 text-blue-600" />,
      accentColor: "from-blue-500/10 to-indigo-500/5",
      badge: "Save Up to 70%",
      cta: "Browse Items",
      link: "#marketplace",
    },
    {
      title: "SELL",
      subtitle: "Turn unused things into extra money.",
      description: "List items in 30 seconds with Groq AI assistant. Transparent 2% platform fee with verified student buyers.",
      icon: <Tag className="w-6 h-6 text-emerald-600" />,
      accentColor: "from-emerald-500/10 to-teal-500/5",
      badge: "Fast Campus Cash",
      cta: "Start Selling",
      link: "/sell",
    },
    {
      title: "SWAP",
      subtitle: "Exchange something you have for something you need.",
      description: "Trade your 2nd year semester textbooks or electronics directly with peers. No money required, 100% campus trust.",
      icon: <RefreshCw className="w-6 h-6 text-purple-600" />,
      accentColor: "from-purple-500/10 to-pink-500/5",
      badge: "Zero Cash Trade",
      cta: "Explore Swaps",
      link: "/sell",
    },
  ];

  return (
    <section id="how-it-works" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#0a1b33]">
          Built for how students actually trade.
        </h2>
        <p className="font-sans text-sm text-slate-500 mt-2">
          Three easy ways to get textbooks, gear, and hostel essentials without leaving campus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-[36px] bg-white border border-slate-200/70 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col justify-between overflow-hidden group`}
          >
            {/* Background subtle gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.accentColor} opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                  {card.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-600 bg-white/80 backdrop-blur-sm border border-slate-200/50 px-3 py-1 rounded-full shadow-2xs">
                  {card.badge}
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-[#0a1b33]">
                  {card.title}
                </h3>
                <p className="font-medium text-slate-800 text-sm mt-1">
                  {card.subtitle}
                </p>
                <p className="font-sans text-xs text-slate-500 mt-3 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-8 mt-4 border-t border-slate-100">
              <Link
                href={card.link}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0a152d] group-hover:text-blue-700 transition-colors"
              >
                <span>{card.cta}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

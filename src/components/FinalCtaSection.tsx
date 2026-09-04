"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Tag, Sparkles } from "lucide-react";

export default function FinalCtaSection({
  onExploreClick,
}: {
  onExploreClick?: () => void;
}) {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-[48px] bg-gradient-to-r from-[#0A2540] via-[#0D2B4A] to-[#0A1B33] text-white p-10 md:p-20 text-center relative overflow-hidden shadow-2xl space-y-6">
        {/* Subtle Decorative Ambient Background */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-yellow-300 text-xs font-semibold backdrop-blur-sm border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Next Semester?</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight leading-tight">
            Got something you don&apos;t need anymore?
          </h2>

          <p className="font-sans text-sm sm:text-base text-blue-200/90 leading-relaxed max-w-xl mx-auto">
            Someone at VIT-AP might be looking for exactly that. List your books, electronics, or lab equipment in under a minute with AI assistance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/sell"
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-7 py-3.5 rounded-full text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2 transform active:scale-95"
            >
              <Tag className="w-4 h-4" />
              <span>Sell an Item</span>
            </Link>

            <button
              onClick={onExploreClick}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold px-7 py-3.5 rounded-full text-sm transition-all backdrop-blur-sm flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

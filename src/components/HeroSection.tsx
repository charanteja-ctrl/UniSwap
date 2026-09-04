"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight, ShieldCheck, Sparkles, ArrowRight, LogIn, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function HeroSection({
  onExploreClick,
}: {
  onExploreClick?: () => void;
}) {
  const { user } = useAuth();
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden min-h-[580px] md:h-[620px] flex flex-col justify-between">
        {/* Subtle Campus Ambient Mesh Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[30%] -right-[15%] w-[650px] h-[650px] rounded-full bg-gradient-to-br from-blue-100/60 via-indigo-50/40 to-emerald-50/30 blur-3xl" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-50/50 via-sky-50/40 to-transparent blur-2xl" />
          
          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: `radial-gradient(#0a152d 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Campus Imagery soft accent card in top right */}
          <div className="hidden lg:block absolute right-16 top-16 w-80 rounded-3xl overflow-hidden shadow-2xl border border-white/80 rotate-2 hover:rotate-0 transition-transform duration-500 bg-white/70 backdrop-blur-md p-3">
            <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                alt="VIT-AP Campus Community"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-[#0a152d]/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active on Campus</span>
              </div>
            </div>
            <div className="mt-3 px-1 flex items-center justify-between text-xs">
              <div className="font-semibold text-slate-800">Casio FX-991CW</div>
              <div className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ₹850 • MH-2
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start"
        >
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-semibold mb-6 shadow-sm">
            <span className="text-emerald-600 font-bold">✦</span>
            <span>Exclusively for VIT-AP Students</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[42px] sm:text-[48px] md:text-[56px] font-medium leading-[1.1] tracking-tight text-[#0a1b33] max-w-2xl">
            Buy. Sell. Swap. <br />
            <span className="bg-gradient-to-r from-[#0a1b33] via-blue-900 to-indigo-800 bg-clip-text text-transparent">
              All within VIT-AP.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="font-sans text-[14px] md:text-[15px] text-slate-600 max-w-xl mt-4 leading-relaxed">
            Buy affordable second-hand items, sell things you no longer need, and connect with verified VIT-AP students — all in one trusted campus marketplace.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mt-8">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={onExploreClick}
                className="bg-[#0a152d] hover:bg-[#071022] text-white font-medium rounded-full px-6 py-3 text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4 text-yellow-400" />
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/sell"
                className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-medium rounded-full px-6 py-3 text-sm transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Sell an Item</span>
              </Link>
            </motion.div>
          </div>

          {/* VIT-AP Trust Indicator */}
          <div className="flex items-center gap-2 mt-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-slate-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>🔒 VIT-AP verified community</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Only <strong className="text-slate-800">@vitap.ac.in</strong> students can join.</span>
          </div>
        </motion.div>

        {/* Floating Bottom Navbar */}
        <div className="relative w-full pb-8 flex justify-center">
          <div className="flex items-center bg-white/90 backdrop-blur-2xl px-2 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/60 gap-4 sm:gap-6">
            {/* Left Logo */}
            <Link href="/" className="flex items-center gap-2 pl-1">
              <div className="w-9 h-9 bg-[#0a152d] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                ✦
              </div>
              <span className="font-display font-semibold text-sm text-[#0a152d] hidden sm:inline">
                UniSwap
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-4 text-xs font-medium text-slate-700">
              <a
                href="#marketplace"
                className="hover:text-blue-900 transition-colors px-1"
              >
                Marketplace
              </a>
              <a
                href="#how-it-works"
                className="hover:text-blue-900 transition-colors px-1"
              >
                How It Works
              </a>
              <a
                href="#categories"
                className="hover:text-blue-900 transition-colors px-1"
              >
                Categories
              </a>
            </nav>

            {/* Right Action */}
            <div className="flex items-center gap-2">
              {user ? (
                <Link
                  href="/sell"
                  className="flex items-center gap-1 bg-[#0a152d] hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-colors shadow-sm"
                >
                  <span>Start Selling</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-full transition-colors shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/sell"
                    className="hidden sm:flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                  >
                    <span>Sell</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

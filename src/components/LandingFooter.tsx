"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";
import UniSwapLogo from "@/components/UniSwapLogo";

export default function LandingFooter() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 text-slate-600">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <UniSwapLogo size="sm" withText href="/" />
            </div>
            <p className="font-sans text-sm text-slate-500 max-w-sm leading-relaxed">
              The trusted marketplace for VIT-AP students. Buy, sell, and swap verified pre-owned textbooks, electronics, and hostel essentials inside campus.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>@vitap.ac.in Verified Community</span>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-xs text-slate-900 uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-500">
              <li><a href="#marketplace" className="hover:text-blue-900 transition">Marketplace</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-900 transition">How It Works</a></li>
              <li><Link href="/sell" className="hover:text-blue-900 transition">Sell</Link></li>
              <li><a href="#marketplace" className="hover:text-blue-900 transition">Buy</a></li>
              <li><a href="#marketplace" className="hover:text-blue-900 transition">Swap</a></li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-xs text-slate-900 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-500">
              <li><Link href="/orders" className="hover:text-blue-900 transition">Help Center</Link></li>
              <li><a href="mailto:support@vitap.ac.in" className="hover:text-blue-900 transition">Contact</a></li>
              <li><a href="/orders" className="hover:text-blue-900 transition">Report an Issue</a></li>
              <li><Link href="/admin" className="hover:text-blue-900 transition">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Nav Col 3 */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-xs text-slate-900 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-500">
              <li><a href="#" className="hover:text-blue-900 transition">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-900 transition">Terms</a></li>
              <li><a href="#" className="hover:text-blue-900 transition">Community Guidelines</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © 2026 UniSwap. Built for the VIT-AP community.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by Razorpay & Groq AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

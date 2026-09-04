"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  PlusCircle,
  ShieldCheck,
  FileText,
  Shield,
  Sparkles,
  LogOut,
  LogIn,
  User,
} from "lucide-react";

export default function Navbar({ onOpenAi }: { onOpenAi?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#0A2540] text-white border-b border-blue-950/40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-slate-950 font-black text-xl shadow group-hover:scale-105 transition-transform">
                U
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-white">UniSwap</span>
                  <span className="bg-yellow-400/20 text-yellow-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-yellow-400/30 uppercase tracking-wider">
                    VIT-AP
                  </span>
                </div>
                <span className="text-[10px] text-blue-200 block -mt-1">Campus Peer Marketplace</span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-blue-100">
            <Link href="/" className="hover:text-yellow-400 transition-colors">
              Browse Marketplace
            </Link>
            <Link href="/sell" className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Sell / Swap Item</span>
            </Link>
            <Link href="/orders" className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-300" />
              <span>My Orders</span>
            </Link>
            <Link href="/admin" className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-purple-300" />
              <span>Admin & Revenue</span>
            </Link>
          </nav>

          {/* User & Actions */}
          <div className="flex items-center gap-3">
            {onOpenAi && (
              <button
                onClick={onOpenAi}
                className="hidden sm:flex items-center gap-1.5 bg-blue-600/60 hover:bg-blue-600 text-yellow-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-400/30 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Groq AI</span>
              </button>
            )}

            {user ? (
              /* Authenticated Student Pill */
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] border border-emerald-400/40">
                    ✓
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="font-semibold text-white flex items-center gap-1">
                      <span>{user.name}</span>
                      <span className="text-[10px] text-blue-200">({user.regNo})</span>
                    </div>
                    <div className="text-[10px] text-emerald-300 font-medium">
                      {user.hostel} • Verified Student
                    </div>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition text-xs flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4 text-rose-300" />
                  <span className="hidden lg:inline text-[11px]">Logout</span>
                </button>
              </div>
            ) : (
              /* Not logged in: Sign In button */
              <Link
                href="/login"
                className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

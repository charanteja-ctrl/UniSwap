"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth, DEMO_USERS } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";
import NotificationDropdown from "@/components/NotificationDropdown";
import {
  ShoppingBag,
  PlusCircle,
  CheckCircle,
  Bot,
  Shield,
  FileText,
  Bell,
  Search,
  Sparkles,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Crown,
  Store,
  Compass,
} from "lucide-react";

export default function Navbar({ onOpenAi }: { onOpenAi?: () => void }) {
  const { user, loginAsRole, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleBadge = (role: UserRole = "student") => {
    switch (role) {
      case "super_admin":
      case "admin":
        return {
          bg: "bg-purple-500/20 border-purple-400/40 text-purple-300",
          label: "ADMIN",
          icon: Crown,
        };
      case "moderator":
        return {
          bg: "bg-blue-500/20 border-blue-400/40 text-blue-300",
          label: "MODERATOR",
          icon: ShieldCheck,
        };
      default:
        return {
          bg: "bg-emerald-500/20 border-emerald-400/40 text-emerald-300",
          label: "STUDENT",
          icon: GraduationCap,
        };
    }
  };

  const badge = getRoleBadge(user?.role);
  const RoleIcon = badge.icon;

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
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-blue-100">
            <Link href="/" className="hover:text-yellow-400 transition-colors">
              Browse Marketplace
            </Link>
            <Link href="/seller" className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-400" />
              <span>Seller Studio</span>
            </Link>
            <Link href="/sell" className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Sell / Swap</span>
            </Link>
            <Link href="/orders" className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-300" />
              <span>Orders & QR</span>
            </Link>
            <Link href="/admin" className="hover:text-yellow-400 transition-colors flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-purple-300" />
              <span>
                {user?.role === "admin" || user?.role === "super_admin"
                  ? "Admin Command"
                  : user?.role === "moderator"
                  ? "Moderation Hub"
                  : "Campus Safety"}
              </span>
            </Link>
          </nav>

          {/* User & Actions */}
          <div className="flex items-center gap-2.5">
            {onOpenAi && (
              <button
                onClick={onOpenAi}
                className="hidden sm:flex items-center gap-1.5 bg-blue-600/60 hover:bg-blue-600 text-yellow-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-400/30 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Groq AI</span>
              </button>
            )}

            {/* In-App Notifications */}
            <NotificationDropdown />

            {/* User Profile & Role Switcher Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 text-xs transition"
                >
                  <div className={`w-7 h-7 rounded-lg ${badge.bg} flex items-center justify-center font-bold text-xs border`}>
                    <RoleIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>{user.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="text-[10px] text-blue-200 font-mono">
                      {user.regNo} • {user.hostel}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-200 ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 animate-in zoom-in-95 space-y-3">
                    {/* Student Info Box */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{user.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium pt-0.5">
                        <CheckCircle className="w-3 h-3" /> @vitap.ac.in Verified
                      </div>
                    </div>

                    {/* 1-Click Role Switcher */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                        Switch Persona (Instant Testing):
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            loginAsRole("student");
                            setDropdownOpen(false);
                          }}
                          className={`p-1.5 rounded-lg text-center border text-[10px] font-bold transition ${
                            user.role === "student"
                              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          🎓 Student
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            loginAsRole("moderator");
                            setDropdownOpen(false);
                          }}
                          className={`p-1.5 rounded-lg text-center border text-[10px] font-bold transition ${
                            user.role === "moderator"
                              ? "bg-blue-500/20 border-blue-400 text-blue-300"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          🛡️ Mod
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            loginAsRole("admin");
                            setDropdownOpen(false);
                          }}
                          className={`p-1.5 rounded-lg text-center border text-[10px] font-bold transition ${
                            user.role === "admin" || user.role === "super_admin"
                              ? "bg-purple-500/20 border-purple-400 text-purple-300"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          👑 Admin
                        </button>
                      </div>
                    </div>

                    {/* Navigation Links inside Dropdown */}
                    <div className="border-t border-slate-800 pt-2 space-y-1 text-xs">
                      <Link
                        href="/seller"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition"
                      >
                        <Store className="w-3.5 h-3.5 text-amber-400" />
                        <span>Seller Studio & Analytics</span>
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>My Orders & Handover QR</span>
                      </Link>
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition"
                      >
                        <Shield className="w-3.5 h-3.5 text-purple-400" />
                        <span>Admin & Moderation Hub</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-300 hover:bg-rose-500/10 transition text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

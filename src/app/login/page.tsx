"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, DEMO_USERS } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";
import {
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  KeyRound,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, signup, loginAsRole } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [hostel, setHostel] = useState("MH-2");
  const [role, setRole] = useState<UserRole>("student");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || "Failed to sign in. Please verify your email.");
        } else {
          setSuccessMsg("Welcome back to UniSwap VIT-AP!");
          setTimeout(() => router.push("/"), 800);
        }
      } else {
        const res = await signup(name, email, password, regNo, hostel, role);
        if (!res.success) {
          setError(res.error || "Failed to create student account.");
        } else {
          setSuccessMsg("Account created! Redirecting to campus feed...");
          setTimeout(() => router.push("/"), 800);
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRole = (r: UserRole) => {
    loginAsRole(r);
    setSuccessMsg(`Switched to demo persona: ${DEMO_USERS[r].name} (${r.toUpperCase()})`);
    setTimeout(() => {
      if (r === "admin" || r === "moderator") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-yellow-400 selection:text-slate-950">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-slate-950 font-black text-lg shadow group-hover:scale-105 transition-transform">
            U
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">UniSwap</span>
              <span className="bg-yellow-400/20 text-yellow-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-yellow-400/30">
                VIT-AP
              </span>
            </div>
            <span className="text-[10px] text-blue-300 block -mt-1">Student Marketplace</span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row items-center gap-10">
        {/* Left Column: Campus Security Pitch & 1-Click Role Switcher */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>@vitap.ac.in Verified Campus Community</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Exclusive to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400">VIT-AP</span> Students.
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Zero scams, zero external strangers. UniSwap requires university verification to buy, sell, or swap textbooks, scientific calculators, cycle passes, and room essentials.
          </p>

          {/* Quick 1-Click Persona Cards */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> 1-Click Persona Switcher
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Instant Evaluator Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Student Persona */}
              <button
                type="button"
                onClick={() => handleQuickRole("student")}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 p-3 rounded-2xl text-left transition group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                    🎓
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Student
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-emerald-300 transition">
                  Charan Teja
                </div>
                <div className="text-[10px] text-slate-400 font-mono">23BCE1024 • MH-2</div>
              </button>

              {/* Moderator Persona */}
              <button
                type="button"
                onClick={() => handleQuickRole("moderator")}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 p-3 rounded-2xl text-left transition group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                    🛡️
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                    Moderator
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-blue-300 transition">
                  Council Lead
                </div>
                <div className="text-[10px] text-slate-400 font-mono">MOD-2026 • Hostels</div>
              </button>

              {/* Admin Persona */}
              <button
                type="button"
                onClick={() => handleQuickRole("admin")}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 p-3 rounded-2xl text-left transition group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                    👑
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                    Admin
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-purple-300 transition">
                  Platform Admin
                </div>
                <div className="text-[10px] text-slate-400 font-mono">ADMIN-01 • Revenue</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login/Register Form */}
        <div className="w-full lg:w-1/2">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            {/* Tabs */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                  mode === "signin"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                VIT-AP Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                  mode === "signup"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Student Registration
              </button>
            </div>

            {/* Error / Success feedback */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Student Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Charan Teja"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Registration No.
                      </label>
                      <input
                        type="text"
                        required
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                        placeholder="e.g. 23BCE1024"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs font-mono font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Hostel / Block
                      </label>
                      <select
                        value={hostel}
                        onChange={(e) => setHostel(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="MH-1">Men&apos;s Hostel 1 (MH-1)</option>
                        <option value="MH-2">Men&apos;s Hostel 2 (MH-2)</option>
                        <option value="MH-3">Men&apos;s Hostel 3 (MH-3)</option>
                        <option value="MH-4">Men&apos;s Hostel 4 (MH-4)</option>
                        <option value="MH-5">Men&apos;s Hostel 5 (MH-5)</option>
                        <option value="LH-1">Ladies Hostel 1 (LH-1)</option>
                        <option value="LH-2">Ladies Hostel 2 (LH-2)</option>
                        <option value="Day Scholar">Day Scholar / Off-Campus</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>University Email Address</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-normal">
                    Requires @vitap.ac.in
                  </span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname.23bce1024@vitap.ac.in"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition group"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === "signin"
                        ? "Sign In to UniSwap VIT-AP"
                        : "Create Verified Student Account"}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              By accessing UniSwap, you agree to the VIT-AP Student Code of Conduct and Verified Peer Escrow terms.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 py-4 text-center text-xs text-slate-500 border-t border-white/5">
        UniSwap • Exclusively for Vellore Institute of Technology, Andhra Pradesh (VIT-AP)
      </footer>
    </div>
  );
}

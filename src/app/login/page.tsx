"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, DEMO_USERS } from "@/lib/auth-context";
import { UserRole } from "@/lib/types";
import UniSwapLogo from "@/components/UniSwapLogo";
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
  Eye,
  EyeOff,
  Store,
  Crown,
  KeyRound,
  Check,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loginAsRole } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleDomainChip = (domain: string) => {
    const currentName = email.split("@")[0] || "";
    setEmail(`${currentName}${domain}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || "Failed to sign in. Please verify your university email.");
      } else {
        setSuccessMsg("Verification successful! Welcome back to UniSwap VIT-AP.");
        setTimeout(() => router.push("/"), 700);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRole = (r: UserRole) => {
    loginAsRole(r);
    setSuccessMsg(`Authenticated as: ${DEMO_USERS[r].name} (${r.replace("_", " ").toUpperCase()})`);
    setTimeout(() => {
      if (r === "master_admin" || r === "admin" || r === "moderator") {
        router.push("/admin");
      } else if (r === "club_manager" || r === "business_advertiser") {
        router.push("/ads");
      } else {
        router.push("/");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#070e1c] text-white flex flex-col justify-between selection:bg-yellow-400 selection:text-slate-950">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <UniSwapLogo size="md" withText href="/" />

        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition backdrop-blur-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Column: Campus Security Pitch & 1-Click Role Switcher */}
        <div className="w-full lg:w-7/12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>@vitapstudent.ac.in Verified Campus Community</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Sign In to the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-500">
              VIT-AP Campus
            </span>{" "}
            Ecosystem.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Verified peer-to-peer student marketplace. Zero outside scammers, university escrow protection, and secure QR-handover pickup at campus landmarks.
          </p>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5">
              <div className="text-yellow-400 font-extrabold text-lg mb-0.5">2% Fee</div>
              <div className="text-xs text-slate-400">Escrow-backed transactions with student OTP handover.</div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5">
              <div className="text-blue-400 font-extrabold text-lg mb-0.5">VIT-AP Map</div>
              <div className="text-xs text-slate-400">Rock Plaza, AB-1, MH/LH Hostel meetup pickup pins.</div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5">
              <div className="text-emerald-400 font-extrabold text-lg mb-0.5">100% Verified</div>
              <div className="text-xs text-slate-400">Exclusive to active students, faculty, and campus clubs.</div>
            </div>
          </div>

          {/* Quick 1-Click Role Evaluator Switcher */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Quick Persona Switcher
              </span>
              <span className="text-[11px] text-amber-400/90 font-mono font-medium">1-Click Instant Login</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* Student */}
              <button
                type="button"
                onClick={() => handleQuickRole("student")}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/50 p-2.5 rounded-xl text-left transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">🎓</span>
                  <span className="text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Student
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-emerald-300 transition truncate">
                  Charan Teja
                </div>
                <div className="text-[10px] text-slate-400 font-mono">23BCE1024 • MH-2</div>
              </button>

              {/* Club Lead */}
              <button
                type="button"
                onClick={() => handleQuickRole("club_manager")}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/50 p-2.5 rounded-xl text-left transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">🏛️</span>
                  <span className="text-[9px] font-bold uppercase bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    Club Lead
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition truncate">
                  IEEE VIT-AP
                </div>
                <div className="text-[10px] text-slate-400 font-mono">TechFest Events</div>
              </button>

              {/* Merchant Partner */}
              <button
                type="button"
                onClick={() => handleQuickRole("business_advertiser")}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/50 p-2.5 rounded-xl text-left transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">🍕</span>
                  <span className="text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                    Merchant
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-amber-300 transition truncate">
                  Campus Pizza
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Rock Plaza Deals</div>
              </button>

              {/* Moderator */}
              <button
                type="button"
                onClick={() => handleQuickRole("moderator")}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-blue-400/50 p-2.5 rounded-xl text-left transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">🛡️</span>
                  <span className="text-[9px] font-bold uppercase bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                    Council
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-blue-300 transition truncate">
                  Moderator
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Disputes & Safety</div>
              </button>

              {/* Platform Admin */}
              <button
                type="button"
                onClick={() => handleQuickRole("admin")}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-400/50 p-2.5 rounded-xl text-left transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">⚙️</span>
                  <span className="text-[9px] font-bold uppercase bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                    Admin
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-purple-300 transition truncate">
                  Campus Admin
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Listings & Escrow</div>
              </button>

              {/* Master Admin */}
              <button
                type="button"
                onClick={() => handleQuickRole("master_admin")}
                className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-yellow-400/50 p-2.5 rounded-xl text-left transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">👑</span>
                  <span className="text-[9px] font-bold uppercase bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-500/30">
                    Master
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-yellow-300 transition truncate">
                  Master Admin
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Treasury & RBAC</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Card */}
        <div className="w-full lg:w-5/12">
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Header Tabs: Sign In vs Sign Up */}
            <div className="flex rounded-xl bg-slate-950/80 p-1 border border-white/10">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-lg text-xs font-bold transition bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              >
                Student Sign In
              </button>
              <Link
                href="/signup"
                className="flex-1 py-2.5 rounded-lg text-xs font-bold text-center text-slate-400 hover:text-white transition"
              >
                Register Account
              </Link>
            </div>

            {/* Error / Success feedback */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in-50">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in-50">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* University Email Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    University Email
                  </label>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="text-slate-500">Quick:</span>
                    <button
                      type="button"
                      onClick={() => handleDomainChip("@vitapstudent.ac.in")}
                      className="text-yellow-400 hover:underline font-mono"
                    >
                      @vitapstudent.ac.in
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. charan.23bce1024@vitapstudent.ac.in"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your student password"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-yellow-400 focus:ring-yellow-400/50"
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <Check className="w-3 h-3" /> SSL 256-Bit
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <>
                    <span>Sign In to UniSwap VIT-AP</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Link to Register */}
            <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/10">
              Don&apos;t have a verified account yet?{" "}
              <Link href="/signup" className="text-yellow-400 font-bold hover:underline">
                Create Student Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50">
          <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Student Password</h3>
                <p className="text-xs text-slate-400">VIT-AP University Identity & Access</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you forgot your password or need access restored, you can log in instantly via the{" "}
              <span className="text-yellow-400 font-bold">1-Click Persona Switcher</span> on the sign-in page, or contact the student helpdesk at{" "}
              <span className="font-mono text-blue-300">support.uniswap@vitap.ac.in</span>.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 py-4 text-center text-xs text-slate-500 border-t border-white/5">
        UniSwap • Exclusively for Vellore Institute of Technology, Andhra Pradesh (VIT-AP)
      </footer>
    </div>
  );
}

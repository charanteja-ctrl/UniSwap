"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
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
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  Store,
  Check,
  Compass,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [accountType, setAccountType] = useState<"student" | "club_manager" | "business_advertiser">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [regNo, setRegNo] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [hostel, setHostel] = useState("MH-2");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Compute password strength (0 to 100)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 30;
    if (pass.length >= 8) score += 20;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = getPasswordStrength(password);

  const handleDomainChip = (domain: string) => {
    const currentName = email.split("@")[0] || "";
    setEmail(`${currentName}${domain}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!agreedToTerms) {
      setError("You must agree to the VIT-AP Student Code of Conduct and Escrow terms.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await signup(name, email, password, regNo, hostel, accountType);
      if (!res.success) {
        setError(res.error || "Registration failed. Please check your student credentials.");
      } else {
        setSuccessMsg("Account verified & created! Welcome to UniSwap VIT-AP.");
        setTimeout(() => router.push("/"), 800);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070e1c] text-white flex flex-col justify-between selection:bg-yellow-400 selection:text-slate-950">
      {/* Ambient background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute top-1/2 -left-32 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <UniSwapLogo size="md" withText href="/" />

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">Already registered?</span>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs text-yellow-300 hover:text-yellow-200 bg-yellow-400/10 hover:bg-yellow-400/20 px-3.5 py-2 rounded-xl border border-yellow-400/30 transition backdrop-blur-sm font-bold"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Column: Campus Value Proposition */}
        <div className="w-full lg:w-5/12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-400/30 text-yellow-300 text-xs font-semibold backdrop-blur-sm">
            <GraduationCap className="w-4 h-4 text-yellow-400" />
            <span>Official Student Onboarding</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Built by Students, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-500">
              For VIT-AP
            </span>{" "}
            Campus.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Create your verified profile to buy, sell, or swap pre-owned engineering books, calculators, cycle passes, and room essentials directly within campus.
          </p>

          {/* Student Perks */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-3.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Zero Outside Scammers</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Restricted exclusively to students with active university credentials.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-3.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Campus Landmark Meetups</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Coordinate handovers safely at Rock Plaza, AB-1, or Hostel Blocks via OpenStreetMap.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-3.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">2% Secure Escrow Protection</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Payment is only transferred to the seller once you scan their unique handover QR code.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="w-full lg:w-7/12">
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Top Toggle */}
            <div className="flex rounded-xl bg-slate-950/80 p-1 border border-white/10">
              <Link
                href="/login"
                className="flex-1 py-2 rounded-lg text-xs font-bold text-center text-slate-400 hover:text-white transition"
              >
                Student Sign In
              </Link>
              <button
                type="button"
                className="flex-1 py-2 rounded-lg text-xs font-bold transition bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              >
                Create Account
              </button>
            </div>

            {/* Account Type Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Your Campus Role:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType("student")}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    accountType === "student"
                      ? "bg-emerald-500/15 border-emerald-400 text-emerald-300 shadow-sm"
                      : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-xs font-bold">Student</span>
                  <span className="text-[9px] opacity-75">Buy & Sell</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType("club_manager")}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    accountType === "club_manager"
                      ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-sm"
                      : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span className="text-xs font-bold">Club Lead</span>
                  <span className="text-[9px] opacity-75">IEEE / ACM / Events</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType("business_advertiser")}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    accountType === "business_advertiser"
                      ? "bg-amber-500/15 border-amber-400 text-amber-300 shadow-sm"
                      : "bg-slate-950/60 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span className="text-xs font-bold">Partner</span>
                  <span className="text-[9px] opacity-75">Campus Cafe & Deals</span>
                </button>
              </div>
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
              {/* Name & Reg No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Charan Teja"
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Registration No.
                  </label>
                  <input
                    type="text"
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                    placeholder="e.g. 23BCE1024"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs font-mono font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 uppercase"
                  />
                </div>
              </div>

              {/* Email Address with Domain helper */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    University Email
                  </label>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-slate-500">Quick Domain:</span>
                    <button
                      type="button"
                      onClick={() => handleDomainChip("@vitapstudent.ac.in")}
                      className="text-yellow-400 hover:underline font-mono"
                    >
                      @vitapstudent.ac.in
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={() => handleDomainChip("@vitap.ac.in")}
                      className="text-yellow-400 hover:underline font-mono"
                    >
                      @vitap.ac.in
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
                    placeholder="charan.23bce1024@vitapstudent.ac.in"
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 font-mono"
                  />
                </div>
              </div>

              {/* Branch & Hostel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Academic School / Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  >
                    <option value="CSE">B.Tech Computer Science (CSE)</option>
                    <option value="ECE">B.Tech Electronics & Comm (ECE)</option>
                    <option value="MECH">B.Tech Mechanical Engineering</option>
                    <option value="BUSINESS">VBS - Business Administration</option>
                    <option value="LAW">VITSOL - School of Law</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Campus Residence / Hostel
                  </label>
                  <select
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
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

              {/* Password & Security Meter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong student password (min 6 chars)"
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

                {/* Password Strength Meter */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Password Security</span>
                      <span
                        className={`font-bold ${
                          strength < 50
                            ? "text-rose-400"
                            : strength < 80
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {strength < 50 ? "Weak" : strength < 80 ? "Good" : "Very Strong"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength < 50
                            ? "bg-rose-500 w-1/3"
                            : strength < 80
                            ? "bg-amber-400 w-2/3"
                            : "bg-emerald-400 w-full"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Terms of Service Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-950 text-yellow-400 focus:ring-yellow-400/50"
                />
                <label htmlFor="terms" className="text-xs text-slate-400 leading-snug cursor-pointer">
                  I agree to the VIT-AP Student Code of Conduct, zero-scam verification policy, and Escrow meetup protocols.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <>
                    <span>Complete Student Registration</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-1 text-center text-xs text-slate-400 border-t border-white/10">
              Already have an account?{" "}
              <Link href="/login" className="text-yellow-400 font-bold hover:underline">
                Sign In here
              </Link>
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

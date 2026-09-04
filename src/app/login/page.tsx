"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Zap,
  BookOpen,
} from "lucide-react";

function LoginForm() {
  const { user, login, signup, loginAsDemo } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [hostel, setHostel] = useState("MH-2");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const isEmailValidVitap = email.trim().toLowerCase().endsWith("@vitap.ac.in");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === "signin") {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || "Login failed. Please verify your VIT-AP email.");
        } else {
          router.push(redirectUrl);
        }
      } else {
        const res = await signup(name, email, password, regNo, hostel);
        if (!res.success) {
          setErrorMsg(res.error || "Registration failed. Please check your information.");
        } else {
          router.push(redirectUrl);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    router.push(redirectUrl);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-11 h-11 rounded-2xl bg-[#0a152d] text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            ✦
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-2xl text-[#0a1b33]">UniSwap</span>
              <span className="bg-yellow-400 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                VIT-AP
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block -mt-1 font-medium">
              Campus Peer Marketplace
            </span>
          </div>
        </Link>

        <h2 className="mt-6 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0a1b33]">
          {mode === "signin" ? "Student Sign In" : "Create Student Account"}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w">
          Exclusively restricted to verified <strong>@vitap.ac.in</strong> students.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200/80 rounded-[32px] sm:px-10 space-y-6">
          {/* Quick Demo Student Button */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-yellow-200/80 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" /> Instant Demo Access
              </span>
              <span className="text-[10px] bg-yellow-400/50 text-slate-900 px-2 py-0.5 rounded-full">
                1-Click Entry
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Evaluating or grading UniSwap? Enter instantly as a verified VIT-AP student (Charan • 23BCE1024) without requiring an OTP.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full mt-1 bg-[#0a152d] hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Enter as Verified Demo Student</span>
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                mode === "signin"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                mode === "signup"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Register (New Student)
            </button>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Reg. Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      placeholder="e.g. 23BCE1024"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Hostel / Block *
                    </label>
                    <select
                      value={hostel}
                      onChange={(e) => setHostel(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="MH-1">MH-1</option>
                      <option value="MH-2">MH-2</option>
                      <option value="MH-3">MH-3</option>
                      <option value="LH-1">LH-1</option>
                      <option value="LH-2">LH-2</option>
                      <option value="Day Scholar">Day Scholar</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  VIT-AP Student Email *
                </label>
                {email && (
                  <span
                    className={`text-[10px] font-bold ${
                      isEmailValidVitap ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {isEmailValidVitap ? "✓ Domain Verified" : "Needs @vitap.ac.in"}
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname.23bce@vitap.ac.in"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                    email && !isEmailValidVitap
                      ? "border-amber-400 focus:ring-amber-500"
                      : "border-slate-300 focus:ring-blue-500"
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Must be an official university address ending with <strong>@vitap.ac.in</strong>
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0a152d] hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{mode === "signin" ? "Sign In to UniSwap" : "Register Student Profile"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Trust points */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Campus network restricted to VIT-AP students only</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Protected by Razorpay Standard Escrow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

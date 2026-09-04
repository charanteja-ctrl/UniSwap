"use client";

import React, { useState } from "react";
import { CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Smartphone, Lock, RefreshCw } from "lucide-react";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";

export default function SecurePaymentsSection() {
  const [sliderPrice, setSliderPrice] = useState<number>(1000);
  const platformFee = Math.max(1, Math.round(sliderPrice * 0.02));
  const totalPayable = sliderPrice + platformFee;

  const paymentSteps = [
    { num: "01", title: "Choose Item", desc: "Select textbooks, calculators, or gadgets from verified students." },
    { num: "02", title: "Checkout", desc: "Pick your preferred campus meetup spot (Library, SAC, Hostels)." },
    { num: "03", title: "Razorpay", desc: "Pay securely via UPI (GPay, PhonePe, Paytm), Cards, or Net Banking." },
    { num: "04", title: "Payment Confirmed", desc: "Backend HMAC-SHA256 signature verification guarantees escrow." },
    { num: "05", title: "Campus Exchange", desc: "Meet the seller on campus, inspect the item, and complete handoff." },
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-3 border border-emerald-200/50">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Campus Escrow Protection</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#0a1b33]">
          Simple and secure payments.
        </h2>
        <p className="font-sans text-sm text-slate-500 mt-2">
          No awkward cash negotiations at hostel gates. Every transaction is backed by Razorpay Standard Checkout with transparent 2% platform fee.
        </p>
      </div>

      {/* Step Flow Banner */}
      <div className="bg-white rounded-[36px] border border-slate-200/80 p-8 shadow-sm mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {paymentSteps.map((step, idx) => (
            <div key={step.num} className="relative flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-black text-blue-950/20">
                  {step.num}
                </span>
                {idx < paymentSteps.length - 1 && (
                  <span className="hidden lg:block text-slate-300 font-bold">→</span>
                )}
              </div>
              <h3 className="font-display font-semibold text-sm text-slate-900">
                {step.title}
              </h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Column: Payment Methods & Transparent 2% Fee Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: Supported Methods & Security */}
        <div className="rounded-[36px] bg-white border border-slate-200/80 p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-slate-900">
              Pay via your favorite student apps
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full Razorpay Standard Web Checkout integration supports instant UPI payments, debit cards, credit cards, and all major Indian net banking portals.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                <Smartphone className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                <div className="text-xs font-bold text-slate-800">Instant UPI</div>
                <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                <CreditCard className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <div className="text-xs font-bold text-slate-800">Cards</div>
                <div className="text-[10px] text-slate-400">Visa, Mastercard, RuPay</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center col-span-2 sm:col-span-1">
                <Lock className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                <div className="text-xs font-bold text-slate-800">Secure Escrow</div>
                <div className="text-[10px] text-slate-400">HMAC-SHA256 verified</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Powered by Razorpay Web Checkout</span>
            <span className="font-bold text-emerald-700">100% Encrypted</span>
          </div>
        </div>

        {/* Right: Transparent 2% Fee Calculator */}
        <div className="rounded-[36px] bg-[#0a152d] text-white p-8 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-yellow-400 uppercase tracking-wide">
                Transparent Fee Model
              </div>
              <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full font-semibold">
                UniSwap Campus Rate: 2%
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-medium">
              See exact buyer & seller breakdown
            </h3>

            {/* Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-blue-200">
                <span>Select sample item price:</span>
                <span className="font-bold text-white text-sm">₹{sliderPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={sliderPrice}
                onChange={(e) => setSliderPrice(Number(e.target.value))}
                className="w-full accent-yellow-400 cursor-pointer"
              />
            </div>

            {/* Receipt Box */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-blue-200 font-sans">
                <span>Item Price (to Seller)</span>
                <span className="font-bold text-white font-mono">₹{sliderPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-blue-200 font-sans">
                <span>UniSwap Fee (2%)</span>
                <span className="font-bold text-yellow-300 font-mono">₹{platformFee}</span>
              </div>
              <div className="border-t border-white/20 pt-2 flex justify-between text-sm font-bold text-white font-sans">
                <span>Total Customer Pays</span>
                <span className="text-yellow-400 font-mono text-base">₹{totalPayable.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <RazorpayCheckoutButton
              productId="interactive-demo-calc"
              title="Interactive Platform Demo"
              price={sliderPrice}
              sellerId="demo-seller"
              sellerName="Rahul (VIT-AP Verified)"
              sellerHostel="MH-2"
              selectedLocation="Central Library Ground Floor"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

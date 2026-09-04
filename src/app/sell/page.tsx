"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { CAMPUS_LOCATIONS } from "@/lib/constants";
import { Sparkles, Loader2, DollarSign, Tag, MapPin, RefreshCw, Gift, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SellPage() {
  const [roughText, setRoughText] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [priceAdvice, setPriceAdvice] = useState<any | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Books");
  const [condition, setCondition] = useState("Good");
  const [price, setPrice] = useState<number>(350);
  const [originalPrice, setOriginalPrice] = useState<number>(600);
  const [location, setLocation] = useState("Central Library Ground Floor");
  const [isSwap, setIsSwap] = useState(false);
  const [swapFor, setSwapFor] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=60");
  const [submitted, setSubmitted] = useState(false);

  // 2% platform fee calculation preview
  const platformFee = isFree ? 0 : Math.max(1, Math.round(price * 0.02));
  const totalBuyerPays = isFree ? 0 : price + platformFee;

  // AI Listing Generator using Groq
  const handleGenerateListing = async () => {
    if (!roughText.trim()) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roughDescription: roughText }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.title) setTitle(data.data.title);
        if (data.data.description) setDescription(data.data.description);
        if (data.data.category) setCategory(data.data.category);
        if (data.data.condition) setCondition(data.data.condition);
        if (data.data.suggestedPrice) setPrice(data.data.suggestedPrice);
      }
    } catch (err) {
      console.error("AI Generation error:", err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // AI Price Suggester using Groq
  const handleSuggestPrice = async () => {
    if (!title.trim()) return;
    setIsPricingLoading(true);
    try {
      const res = await fetch("/api/ai/price-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          condition,
          originalPrice,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPriceAdvice(data.data);
        if (data.data.suggestedMinPrice) {
          setPrice(data.data.suggestedMinPrice);
        }
      }
    } catch (err) {
      console.error("Price suggestion error:", err);
    } finally {
      setIsPricingLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            List an Item on <span className="text-blue-700">UniSwap VIT-AP</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Sell or swap your textbooks, calculators, lab kits, or donate free notes to verified VIT-AP campus peers.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-md space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Item Successfully Listed!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your item <strong>&quot;{title}&quot;</strong> is now live on the VIT-AP campus feed. When a student clicks Buy Now, payment will be processed via Razorpay and you will be notified for the campus exchange.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 bg-[#0A2540] hover:bg-blue-900 text-white rounded-xl font-semibold text-sm transition"
              >
                View in Marketplace
              </Link>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setTitle("");
                  setRoughText("");
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition"
              >
                List Another Item
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* AI Listing Assistant Card */}
            <div className="bg-gradient-to-r from-blue-900 to-[#0A2540] text-white p-6 rounded-2xl shadow-md space-y-3 border border-blue-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <h2 className="font-bold text-base">Groq AI Listing Assistant</h2>
                <span className="text-[10px] bg-yellow-400 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                  Llama 3
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Type a rough summary of what you want to sell (e.g. <em>&quot;Casio fx991es calculator used for 1 semester, mint condition, bought for 1200&quot;</em>) and let AI fill the details.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <input
                  type="text"
                  value={roughText}
                  onChange={(e) => setRoughText(e.target.value)}
                  placeholder="Describe your item informally..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="button"
                  onClick={handleGenerateListing}
                  disabled={isAiGenerating || !roughText.trim()}
                  className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  {isAiGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Auto-Fill with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-2">
                  Item Details
                </h3>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Higher Engineering Mathematics - B.S. Grewal"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category & Condition */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Books">Books 📚</option>
                      <option value="Calculators">Calculators 🧮</option>
                      <option value="Electronics">Electronics 💻</option>
                      <option value="Stationery">Stationery 📓</option>
                      <option value="Academic/Lab">Academic / Lab 🧪</option>
                      <option value="Bags">Bags 🎒</option>
                      <option value="Hostel Essentials">Hostel Essentials 🛏️</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Condition *
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Like New">Like New (Barely used)</option>
                      <option value="Good">Good (Minor wear, fully working)</option>
                      <option value="Fair">Fair (Noticeable wear)</option>
                      <option value="Needs Repair">Needs Repair / For parts</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mention semester usage, condition of pages/screens, and why it's useful for VIT-AP students."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Campus Meetup Point */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" /> Default Pickup Point *
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CAMPUS_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        📍 {loc.name} ({loc.description})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Special Listing Options: Swap & Free */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <h3 className="font-bold text-base text-slate-900">Exchange Preferences</h3>

                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 flex-1">
                    <input
                      type="checkbox"
                      checked={isSwap}
                      onChange={(e) => setIsSwap(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <div className="font-semibold text-xs text-slate-900 flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5 text-indigo-600" /> Open for Swap
                      </div>
                      <div className="text-[11px] text-slate-500">I will trade this for another item</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 flex-1">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <div>
                      <div className="font-semibold text-xs text-slate-900 flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5 text-emerald-600" /> Give Away for Free
                      </div>
                      <div className="text-[11px] text-slate-500">Donate to campus juniors for free</div>
                    </div>
                  </label>
                </div>

                {isSwap && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      What do you want in swap?
                    </label>
                    <input
                      type="text"
                      value={swapFor}
                      onChange={(e) => setSwapFor(e.target.value)}
                      placeholder="e.g. Data Structures & Algorithms textbook or Arduino UNO"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Pricing Section with 2% Transparent Breakdown */}
              {!isFree && (
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-900">Pricing & 2% Fee Calculator</h3>
                    <button
                      type="button"
                      onClick={handleSuggestPrice}
                      disabled={isPricingLoading || !title.trim()}
                      className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 disabled:opacity-50"
                    >
                      {isPricingLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                      )}
                      <span>Suggest Price with Groq AI</span>
                    </button>
                  </div>

                  {priceAdvice && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-amber-950">
                        <span>💡 AI Recommendation:</span>
                        <span>₹{priceAdvice.suggestedMinPrice} – ₹{priceAdvice.suggestedMaxPrice}</span>
                        <span className="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-semibold text-[10px]">
                          {priceAdvice.demandRating} DEMAND
                        </span>
                      </div>
                      <p className="text-amber-800">{priceAdvice.reasoning}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                        Your Desired Price (₹) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                        Original Retail Price (₹)
                      </label>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Realtime fee preview */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Seller Net Earnings:</span>
                      <span className="font-bold text-slate-900">₹{price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>UniSwap 2% Platform Fee:</span>
                      <span className="font-bold text-blue-700">₹{platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                      <span>Buyer Pays on Razorpay:</span>
                      <span className="text-emerald-700">₹{totalBuyerPays.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0A2540] hover:bg-blue-900 text-white font-bold text-sm shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
                >
                  <span>Publish Listing to VIT-AP Students</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

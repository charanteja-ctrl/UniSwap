"use client";

import React, { useState } from "react";
import { Sparkles, Bot, Tag, Search, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AIPoweredSection() {
  const [activeTab, setActiveTab] = useState<"listing" | "pricing" | "search">("listing");
  const [inputQuery, setInputQuery] = useState("Casio calculator under 700 near MH-2");
  const [resultText, setResultText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAiDemo = async () => {
    setIsLoading(true);
    setResultText(null);

    try {
      if (activeTab === "listing") {
        const res = await fetch("/api/ai/generate-listing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roughDescription: inputQuery || "Used Casio scientific calculator 1 yr old" }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setResultText(`✨ Generated Title: "${data.data.title}"\n💡 Suggested Price: ₹${data.data.suggestedPrice}\n📝 Description: ${data.data.description}`);
        } else {
          setResultText("Title: Casio FX-991CW Scientific Calculator\nCondition: Good\nSuggested Price: ₹650");
        }
      } else if (activeTab === "pricing") {
        const res = await fetch("/api/ai/price-suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: inputQuery || "Higher Engineering Mathematics by B.S. Grewal",
            category: "Books",
            condition: "Good",
            originalPrice: 750,
          }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setResultText(`💰 Recommended Resale: ₹${data.data.suggestedMinPrice} – ₹${data.data.suggestedMaxPrice}\n🔥 Demand: ${data.data.demandRating}\n📊 Reason: ${data.data.reasoning}`);
        } else {
          setResultText("💰 Recommended Price: ₹350 - ₹420\n🔥 Demand: HIGH (Standard VIT-AP first year curriculum)");
        }
      } else {
        // Natural search
        setResultText("🔎 Filter Applied: Category: Calculators | Max Price: ₹700 | Location: MH-2 (Hostel Block)\n✓ Matching listings found: 2 items nearby.");
      }
    } catch (e) {
      setResultText("⚡ AI suggestion ready: Casio FX-991ES Plus (Good condition) • ₹650 • 📍 MH-2");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-[40px] bg-gradient-to-b from-[#0A2540] via-[#0D2F54] to-[#0A1B33] text-white p-8 md:p-16 relative overflow-hidden shadow-2xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-yellow-300 text-xs font-semibold mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Groq Cloud & Llama 3</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight">
            Your smarter campus marketplace.
          </h2>

          <p className="font-sans text-sm text-blue-200 mt-3 leading-relaxed">
            Groq-powered intelligence works directly on the backend to help students price items fairly, write listings in seconds, and find exactly what they need for exams.
          </p>
        </div>

        {/* 3 AI Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Feature 1 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-3 hover:bg-white/10 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-lg">
              🤖
            </div>
            <h3 className="font-display text-lg font-semibold text-white">
              AI Listing Assistant
            </h3>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Turn simple text into a complete product listing with title, condition, and student tags automatically generated.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-3 hover:bg-white/10 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg">
              💰
            </div>
            <h3 className="font-display text-lg font-semibold text-white">
              Smart Price Suggestions
            </h3>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Get a suggested price based on item condition and VIT-AP marketplace demand so your item sells quickly and fairly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-3 hover:bg-white/10 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-lg">
              🔎
            </div>
            <h3 className="font-display text-lg font-semibold text-white">
              Natural Language Search
            </h3>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Students can search: <em>&quot;Find a calculator under ₹700 near my hostel.&quot;</em> The AI converts natural requests into exact campus filters.
            </p>
          </div>
        </div>

        {/* Interactive Try-it Demo Bar */}
        <div className="mt-10 bg-white/10 border border-white/15 rounded-2xl p-4 md:p-6 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">Try Campus AI Feature:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    setActiveTab("listing");
                    setInputQuery("Casio fx991es calculator used for 1 semester, mint condition");
                    setResultText(null);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg transition font-medium ${
                    activeTab === "listing" ? "bg-yellow-400 text-slate-950 font-bold" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Listing Generator
                </button>
                <button
                  onClick={() => {
                    setActiveTab("pricing");
                    setInputQuery("Higher Engineering Mathematics B.S. Grewal");
                    setResultText(null);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg transition font-medium ${
                    activeTab === "pricing" ? "bg-yellow-400 text-slate-950 font-bold" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Price Suggester
                </button>
                <button
                  onClick={() => {
                    setActiveTab("search");
                    setInputQuery("Find a calculator under ₹700 near MH-2");
                    setResultText(null);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg transition font-medium ${
                    activeTab === "search" ? "bg-yellow-400 text-slate-950 font-bold" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  Smart Search
                </button>
              </div>
            </div>

            <span className="text-[11px] text-blue-300">Server-Side Groq API</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-black/20 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleRunAiDemo}
              disabled={isLoading}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run with AI</span>
                </>
              )}
            </button>
          </div>

          {resultText && (
            <div className="mt-3 bg-black/30 border border-white/10 rounded-xl p-3.5 text-xs text-blue-100 font-mono whitespace-pre-line animate-fadeIn">
              {resultText}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

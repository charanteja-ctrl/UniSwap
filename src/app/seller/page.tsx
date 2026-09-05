"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { Offer, Product } from "@/lib/types";
import { INITIAL_PRODUCTS } from "@/lib/constants";
import {
  TrendingUp,
  DollarSign,
  Tag,
  Eye,
  Bookmark,
  Award,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Percent,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function SellerStudioPage() {
  const { user } = useAuth();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  // Seller metrics
  const stats = {
    grossSales: 18450,
    platformFeePaid: 369, // 2%
    netEarnings: 18081,
    totalOrders: 14,
    views: 1284,
    saves: 186,
    conversionRate: "8.2%",
    trustScore: 96,
  };

  const fetchOffers = async () => {
    setLoadingOffers(true);
    try {
      const res = await fetch("/api/offers");
      const data = await res.json();
      if (data.success && data.offers) {
        setOffers(data.offers);
      }
    } catch (e) {
      console.error("Failed to load offers:", e);
    } finally {
      setLoadingOffers(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOfferAction = async (offerId: string, action: "ACCEPT" | "REJECT") => {
    try {
      const res = await fetch("/api/offers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setOffers((prev) =>
          prev.map((o) => (o.id === offerId ? { ...o, status: action === "ACCEPT" ? "ACCEPTED" : "REJECTED" } : o))
        );
      }
    } catch (e) {
      console.error("Failed to update offer:", e);
    }
  };

  const sellerProducts = INITIAL_PRODUCTS.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Campus Seller Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {user?.name || "Charan Teja"}&apos;s Store & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Registration: <span className="font-mono font-bold text-slate-800">{user?.regNo || "23BCE1024"}</span> • Hostel:{" "}
              <span className="font-semibold text-slate-800">{user?.hostel || "MH-2"}</span> • Trust Score:{" "}
              <strong className="text-emerald-600">{stats.trustScore}/100 (Tier 1 Verified)</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sell"
              className="px-4 py-2.5 bg-[#0A2540] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-yellow-400" />
              <span>Add New Listing</span>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Gross Sales */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">₹{stats.grossSales.toLocaleString()}</div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24% this month
            </div>
          </div>

          {/* Net Settlement (After 2% Fee) */}
          <div className="bg-gradient-to-br from-[#0A2540] to-blue-900 text-white p-6 rounded-3xl shadow-md space-y-2">
            <div className="flex items-center justify-between text-blue-200">
              <span className="text-xs font-bold uppercase tracking-wider">Net Escrow Payouts</span>
              <DollarSign className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-black text-yellow-400">₹{stats.netEarnings.toLocaleString()}</div>
            <div className="text-xs text-blue-200">
              After 2% UniSwap campus fee (₹{stats.platformFeePaid})
            </div>
          </div>

          {/* Views & Saves */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Engagement</span>
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.views.toLocaleString()}</div>
            <div className="text-xs text-slate-500">
              {stats.saves} saves • {stats.conversionRate} conversion
            </div>
          </div>

          {/* Completed Campus Trades */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Completed Trades</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.totalOrders}</div>
            <div className="text-xs text-emerald-600 font-semibold">
              100% QR verified on campus
            </div>
          </div>
        </div>

        {/* Gamification: Campus Seller Badges */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-base text-slate-900">Campus Seller Achievements</h3>
            </div>
            <span className="text-xs bg-yellow-100 text-yellow-800 font-bold px-2.5 py-0.5 rounded-full">
              4 Badges Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
              <div className="text-2xl">🏅</div>
              <div className="font-bold text-xs text-amber-950">First Sale</div>
              <div className="text-[10px] text-amber-700">Initial campus item sold</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-1">
              <div className="text-2xl">🔥</div>
              <div className="font-bold text-xs text-rose-950">10 Trades Club</div>
              <div className="text-[10px] text-rose-700">10 successful QR pickups</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1">
              <div className="text-2xl">⚡</div>
              <div className="font-bold text-xs text-blue-950">Fast Responder</div>
              <div className="text-[10px] text-blue-700">Replies within 15 mins</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <div className="text-2xl">💎</div>
              <div className="font-bold text-xs text-emerald-950">High Trust Seller</div>
              <div className="text-[10px] text-emerald-700">Score &gt; 95, zero disputes</div>
            </div>
          </div>
        </div>

        {/* Section: Incoming Student Offers */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-base text-slate-900">Incoming Student Offers & Negotiation</h3>
            </div>
            <button
              type="button"
              onClick={fetchOffers}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOffers ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {offers.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No active offers at the moment. When students propose an offer, it will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{offer.productTitle}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          offer.status === "ACCEPTED"
                            ? "bg-emerald-100 text-emerald-800"
                            : offer.status === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {offer.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      From: <strong>{offer.buyerName}</strong> ({offer.buyerRegNo}) • Meetup: <strong>{offer.meetupLocation}</strong>
                    </div>

                    {offer.message && (
                      <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-xl border border-slate-200/60 max-w-lg">
                        &quot;{offer.message}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-400 line-through">₹{offer.originalPrice}</span>
                      <span className="text-base font-extrabold text-emerald-700">
                        Offered: ₹{offer.offerPrice}
                      </span>
                    </div>

                    {offer.status === "PENDING" && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOfferAction(offer.id, "ACCEPT")}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOfferAction(offer.id, "REJECT")}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Listings Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Your Active Campus Listings ({sellerProducts.length})</h3>
            <Link href="/sell" className="text-xs font-bold text-blue-700 hover:text-blue-900">
              + Post Another Listing
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {sellerProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3"
              >
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-32 object-cover rounded-xl border border-slate-100"
                />
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-blue-700">{p.category}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      ACTIVE
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 truncate">{p.title}</h4>
                  <div className="font-extrabold text-sm text-slate-900 mt-1">₹{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

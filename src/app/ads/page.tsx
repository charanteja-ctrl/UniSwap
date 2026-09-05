"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { Advertisement, AdCategory } from "@/lib/types";
import {
  Sparkles,
  Calendar,
  MapPin,
  Tag,
  Ticket,
  ExternalLink,
  PlusCircle,
  Eye,
  MousePointerClick,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building,
  Store,
  ArrowRight,
  Filter,
  X,
  Loader2,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function AdsHubPage() {
  const { user } = useAuth();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "clubs" | "deals">("all");
  const [claimedCodes, setClaimedCodes] = useState<Record<string, boolean>>({});

  // Campaign Creation Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [advType, setAdvType] = useState<"CLUB" | "BUSINESS">("CLUB");
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [advName, setAdvName] = useState(user?.clubName || user?.businessName || user?.name || "");
  const [packageType, setPackageType] = useState<"BASIC" | "PREMIUM" | "CAMPUS_FEATURED">("PREMIUM");
  const [dealDiscount, setDealDiscount] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("Central Library / Rock Plaza");
  const [actionText, setActionText] = useState("Register Free");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ads");
      const data = await res.json();
      if (data.success && data.ads) {
        setAds(data.ads);
      }
    } catch (e) {
      console.error("Failed to load ads:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleClaimCode = (adId: string) => {
    setClaimedCodes((prev) => ({ ...prev, [adId]: true }));
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tagline,
          advertiserType: advType,
          advertiserName: advName,
          packageType,
          dealDiscount,
          couponCode,
          eventDate,
          location,
          actionText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        fetchAds();
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg(null);
          setTitle("");
          setTagline("");
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const displayedAds = ads.filter((ad) => {
    if (activeTab === "clubs") return ad.advertiserType === "CLUB";
    if (activeTab === "deals") return ad.advertiserType === "BUSINESS";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Hero Header */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#0e355c] to-blue-950 text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-blue-900/60">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold border border-yellow-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Life, Verified Clubs & Local Deals</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              UniSwap Advertisement & Community Hub
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed">
              Discover official VIT-AP club events, technical hackathons, workshops, and exclusive student discounts at nearby cafes, restaurants, and gyms.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Launch Club / Business Campaign</span>
              </button>

              <Link
                href="/admin"
                className="px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Ad Approvals in Master Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute right-[-10%] top-[-20%] w-[450px] h-[450px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Tab Switcher & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "all"
                  ? "bg-[#0A2540] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Campaigns ({ads.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("clubs")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "clubs"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Campus Clubs & Events</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("deals")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "deals"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Nearby Student Deals</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Approval Workflow Enforced • 100% Verified Partners
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedAds.map((ad) => {
            const isApproved = ad.status === "APPROVED";
            const isClaimed = claimedCodes[ad.id];

            return (
              <div
                key={ad.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div>
                  {/* Banner Image */}
                  <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                    <img
                      src={ad.bannerUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm text-white ${
                          ad.advertiserType === "CLUB" ? "bg-blue-600/90" : "bg-amber-600/90"
                        }`}
                      >
                        {ad.advertiserType === "CLUB" ? "🎓 Club Event" : "🏪 Partner Deal"}
                      </span>
                      {ad.packageType === "CAMPUS_FEATURED" && (
                        <span className="text-[10px] font-bold bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                    </div>

                    {!isApproved && (
                      <div className="absolute bottom-3 right-3 bg-amber-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                        {ad.status}
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <span>{ad.advertiserName}</span>
                        {ad.advertiserVerified && (
                          <span className="text-emerald-600 font-bold">✓</span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[10px] font-mono">{ad.packageType}</span>
                    </div>

                    <h3 className="font-display font-bold text-base text-slate-900 leading-snug">
                      {ad.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {ad.tagline}
                    </p>

                    {/* Metadata Pill Row */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-600">
                      {ad.eventDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>{ad.eventDate}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span className="truncate">{ad.location}</span>
                      </div>
                      {ad.dealDiscount && (
                        <div className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          <Tag className="w-3.5 h-3.5" />
                          <span>{ad.dealDiscount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action & Analytics */}
                <div className="p-6 pt-0 space-y-3">
                  {/* Coupon Code Reveal if business deal */}
                  {ad.couponCode && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500 font-sans">Coupon Code:</span>
                      {isClaimed ? (
                        <span className="font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                          {ad.couponCode}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleClaimCode(ad.id)}
                          className="font-bold text-blue-700 hover:text-blue-900 underline"
                        >
                          Reveal Code
                        </button>
                      )}
                    </div>
                  )}

                  {/* Primary CTA */}
                  <button
                    type="button"
                    onClick={() => alert(`Navigating to: ${ad.title}`)}
                    className="w-full py-2.5 bg-[#0A2540] hover:bg-blue-900 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{ad.actionText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {/* Analytics Stats Footer */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {ad.impressions.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MousePointerClick className="w-3 h-3" /> {ad.clicks.toLocaleString()} clicks
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      CTR: {((ad.clicks / (ad.impressions || 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Campaign Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Launch UniSwap Campaign
                </h3>
                <p className="text-xs text-slate-500">
                  Subject to Master Admin & Moderator approval prior to publication.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {successMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-1 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Campaign Submitted!</h4>
                <p>{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                {/* Type toggle */}
                <div className="flex rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setAdvType("CLUB")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      advType === "CLUB" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600"
                    }`}
                  >
                    🎓 University Club / Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdvType("BUSINESS")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                      advType === "BUSINESS" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600"
                    }`}
                  >
                    🏪 Nearby Business Deal
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Campaign / Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={advType === "CLUB" ? "e.g. HackAP 2026 Hackathon" : "e.g. 20% Off Pizza & Pasta Combo"}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tagline & Offer Description
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Short engaging description for students..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Organization / Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      value={advName}
                      onChange={(e) => setAdvName(e.target.value)}
                      placeholder="e.g. IEEE Chapter / Campus Pizza"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Campaign Package
                    </label>
                    <select
                      value={packageType}
                      onChange={(e) => setPackageType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="BASIC">Basic Spotlight (₹499)</option>
                      <option value="PREMIUM">Featured Ad (₹999)</option>
                      <option value="CAMPUS_FEATURED">Campus Banner (₹1,999)</option>
                    </select>
                  </div>
                </div>

                {advType === "BUSINESS" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Discount Text
                      </label>
                      <input
                        type="text"
                        value={dealDiscount}
                        onChange={(e) => setDealDiscount(e.target.value)}
                        placeholder="e.g. Flat 20% Student Discount"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Coupon Code
                      </label>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="e.g. CAMPUS20"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold uppercase text-slate-900"
                      />
                    </div>
                  </div>
                )}

                {advType === "CLUB" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Event Date & Time
                    </label>
                    <input
                      type="text"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      placeholder="e.g. March 15, 2026 • 10:00 AM"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Campus Location / Venue
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. University Auditorium or Rock Plaza"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-[11px] text-blue-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-blue-700" />
                    <span>Ad Revenue Breakdown:</span>
                  </div>
                  <div>
                    Campaign Fee: <strong>₹{packageType === "BASIC" ? 499 : packageType === "PREMIUM" ? 999 : 1999}</strong> (Paid to UniSwap Platform Revenue via Razorpay).
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !title || !advName}
                  className="w-full py-3 bg-[#0A2540] hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Submit Campaign for Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

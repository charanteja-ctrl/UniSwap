"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { INITIAL_PRODUCTS } from "@/lib/constants";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";
import { MapPin, ShieldCheck, ArrowRight, Flame, Sparkles, Gift, RefreshCw } from "lucide-react";

export default function MarketplacePreview({
  selectedCategory,
  onResetCategory,
}: {
  selectedCategory?: string;
  onResetCategory?: () => void;
}) {
  const displayedProducts = selectedCategory && selectedCategory !== "ALL"
    ? INITIAL_PRODUCTS.filter(
        (p) =>
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === "Free Items" && p.isFree) ||
          (selectedCategory === "Hostel Items" && p.category === "Hostel Essentials")
      )
    : INITIAL_PRODUCTS.slice(0, 6);

  return (
    <section id="marketplace" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-2 border border-blue-200/50">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Campus Inventory</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#0a1b33]">
            What students are selling
          </h2>
          <p className="font-sans text-sm text-slate-500 mt-1">
            Find useful things at student-friendly prices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedCategory && (
            <button
              onClick={onResetCategory}
              className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition"
            >
              Category: {selectedCategory} ✕
            </button>
          )}
          <Link
            href="/sell"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 hover:border-slate-400 px-4 py-2 rounded-full transition shadow-sm"
          >
            <span>Post a Listing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Top Media */}
            <div className="relative aspect-[16/11] bg-slate-100 overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.demandRating === "HIGH" && (
                  <span className="inline-flex items-center gap-1 bg-rose-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    <Flame className="w-3 h-3 fill-current" /> High Demand
                  </span>
                )}
                {product.isFree && (
                  <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    <Gift className="w-3 h-3" /> 100% Free
                  </span>
                )}
                {product.isSwapAvailable && (
                  <span className="inline-flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    <RefreshCw className="w-3 h-3" /> Swap Available
                  </span>
                )}
              </div>

              {/* Location Tag */}
              <div className="absolute bottom-3 left-3 bg-[#0a152d]/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3 text-yellow-400" />
                <span>📍 {product.location}</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <span className="text-slate-500 font-medium">{product.condition}</span>
                </div>

                <h3 className="font-display font-medium text-slate-900 text-base line-clamp-1 group-hover:text-blue-900 transition-colors">
                  {product.title}
                </h3>

                <p className="font-sans text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Seller Info */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    {product.isFree ? (
                      <span className="text-2xl font-black text-emerald-600">FREE</span>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-2xl font-bold text-slate-900">
                          ₹{product.price}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          + 2% campus fee
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Seller & Verification Badge */}
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-800 flex items-center justify-end gap-1">
                      <span>{product.sellerName.split(" ")[0]}</span>
                      <span className="text-emerald-600 font-bold">✓</span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      <span>VIT-AP Verified</span>
                    </div>
                  </div>
                </div>

                {/* Checkout integration */}
                <div>
                  {product.isFree ? (
                    <button
                      onClick={() => alert(`Claimed "${product.title}"! Please coordinate pickup with ${product.sellerName} at ${product.location}.`)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
                    >
                      Claim Free Donation
                    </button>
                  ) : (
                    <RazorpayCheckoutButton
                      productId={product.id}
                      title={product.title}
                      price={product.price}
                      sellerId={product.sellerId}
                      sellerName={product.sellerName}
                      sellerHostel={product.sellerHostel}
                      selectedLocation={product.location}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Link */}
      <div className="mt-12 text-center">
        <Link
          href="/sell"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a152d] hover:text-blue-700 transition-colors"
        >
          <span>View all campus listings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

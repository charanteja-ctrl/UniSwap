"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { INITIAL_PRODUCTS } from "@/lib/constants";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";
import OfferModal from "@/components/OfferModal";
import CampusChatDrawer from "@/components/CampusChatDrawer";
import AISmartSearch, { AISearchFilters } from "@/components/AISmartSearch";
import CampusMapExplorer from "@/components/CampusMapExplorer";
import {
  MapPin,
  ShieldCheck,
  ArrowRight,
  Flame,
  Sparkles,
  Gift,
  RefreshCw,
  Tag,
  MessageSquare,
  Heart,
  Compass,
  Filter,
} from "lucide-react";

export default function MarketplacePreview({
  selectedCategory,
  onResetCategory,
}: {
  selectedCategory?: string;
  onResetCategory?: () => void;
}) {
  const [searchFilters, setSearchFilters] = useState<AISearchFilters>({ query: "" });
  const [mapLocation, setMapLocation] = useState<string>("");
  const [showMap, setShowMap] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Modals state
  const [offerProduct, setOfferProduct] = useState<Product | null>(null);
  const [chatProduct, setChatProduct] = useState<Product | null>(null);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter products based on Category, AI search, and Map Location
  const filteredProducts = INITIAL_PRODUCTS.filter((p) => {
    // 1. Category
    if (selectedCategory && selectedCategory !== "ALL") {
      const matchCat =
        p.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === "Free Items" && p.isFree) ||
        (selectedCategory === "Hostel Items" && p.category === "Hostel Essentials");
      if (!matchCat) return false;
    }

    // 2. AI Category filter
    if (searchFilters.category) {
      if (p.category.toLowerCase() !== searchFilters.category.toLowerCase()) return false;
    }

    // 3. AI Max Price filter
    if (searchFilters.maxPrice) {
      if (p.price > searchFilters.maxPrice) return false;
    }

    // 4. Map or AI Location filter
    const targetLoc = mapLocation || searchFilters.location;
    if (targetLoc) {
      const matchLoc = p.location.toLowerCase().includes(targetLoc.toLowerCase());
      if (!matchLoc) return false;
    }

    // 5. Query text
    if (searchFilters.query && !searchFilters.category && !searchFilters.maxPrice && !searchFilters.location) {
      const q = searchFilters.query.toLowerCase();
      const matchText =
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!matchText) return false;
    }

    return true;
  });

  return (
    <section id="marketplace" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Header with Title & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-2 border border-blue-200/50">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>VIT-AP Campus Live Exchange</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a1b33]">
            What students are selling & swapping
          </h2>
          <p className="font-sans text-sm text-slate-500 mt-1">
            Negotiate offers, inspect in-person at campus desks, and pay securely via 2% verified escrow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border transition shadow-xs ${
              showMap
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-yellow-400" />
            <span>{showMap ? "Hide Campus Map" : "Explore Campus Map"}</span>
          </button>

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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0A2540] hover:bg-blue-900 px-4 py-2 rounded-full transition shadow-sm"
          >
            <span>Post a Listing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* AI Smart Search Bar */}
      <AISmartSearch onFilterChange={setSearchFilters} />

      {/* Collapsible Interactive Campus Map Explorer */}
      {showMap && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <CampusMapExplorer
            selectedLocation={mapLocation}
            onSelectLocation={(loc) => setMapLocation(loc)}
          />
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900">No items match your active filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, clearing the campus map location, or switching categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setMapLocation("");
              setSearchFilters({ query: "" });
              if (onResetCategory) onResetCategory();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);

            return (
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
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
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

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition z-10"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isWishlisted ? "text-rose-500 fill-rose-500" : "text-white"
                      }`}
                    />
                  </button>

                  {/* Location Tag */}
                  <div className="absolute bottom-3 left-3 bg-[#0a152d]/85 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
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

                    {/* Negotiation & P2P Actions Row */}
                    {!product.isFree && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setOfferProduct(product)}
                          className="py-2 px-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Tag className="w-3.5 h-3.5" />
                          <span>Make Offer</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setChatProduct(product)}
                          className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                          <span>Chat Peer</span>
                        </button>
                      </div>
                    )}

                    {/* Checkout integration */}
                    <div>
                      {product.isFree ? (
                        <button
                          onClick={() =>
                            alert(
                              `Claimed "${product.title}"! Please coordinate pickup with ${product.sellerName} at ${product.location}.`
                            )
                          }
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
            );
          })}
        </div>
      )}

      {/* Offer Modal */}
      {offerProduct && (
        <OfferModal
          product={offerProduct}
          isOpen={!!offerProduct}
          onClose={() => setOfferProduct(null)}
        />
      )}

      {/* Chat Drawer */}
      {chatProduct && (
        <CampusChatDrawer
          product={chatProduct}
          isOpen={!!chatProduct}
          onClose={() => setChatProduct(null)}
          onMakeOfferClick={() => {
            setOfferProduct(chatProduct);
            setChatProduct(null);
          }}
        />
      )}
    </section>
  );
}

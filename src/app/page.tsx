"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";
import AIAssistantModal from "@/components/AIAssistantModal";
import { INITIAL_PRODUCTS, CAMPUS_LOCATIONS } from "@/lib/constants";
import { Product, ItemCategory } from "@/lib/types";
import {
  Search,
  Filter,
  MapPin,
  Flame,
  Star,
  ShieldCheck,
  ArrowUpDown,
  RefreshCw,
  Gift,
  HelpCircle,
  ExternalLink,
  Clock,
  Sparkles,
  Heart,
  MessageSquare
} from "lucide-react";

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedLocation, setSelectedLocation] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"NEWEST" | "PRICE_ASC" | "PRICE_DESC">("NEWEST");
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [offerProduct, setOfferProduct] = useState<Product | null>(null);
  const [offerAmount, setOfferAmount] = useState<string>("");
  const [offerSent, setOfferSent] = useState<boolean>(false);

  const categories: { label: string; value: string; icon: string }[] = [
    { label: "All Items", value: "ALL", icon: "✨" },
    { label: "Calculators", value: "Calculators", icon: "🧮" },
    { label: "Books", value: "Books", icon: "📚" },
    { label: "Electronics", value: "Electronics", icon: "💻" },
    { label: "Academic / Lab", value: "Academic/Lab", icon: "🧪" },
    { label: "Swap 🔄", value: "Swap", icon: "🔄" },
    { label: "Free 🎁", value: "Free", icon: "🎁" },
  ];

  const locations = [
    { label: "All Campus", value: "ALL" },
    { label: "Library", value: "Library" },
    { label: "Food Street", value: "Food Street" },
    { label: "SAC", value: "SAC" },
    { label: "MH-1", value: "MH-1" },
    { label: "MH-2", value: "MH-2" },
    { label: "MH-3", value: "MH-3" },
    { label: "LH-1", value: "LH-1" },
    { label: "LH-2", value: "LH-2" },
  ];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          selectedCategory === "ALL"
            ? true
            : selectedCategory === "Swap"
            ? p.isSwapAvailable || p.category === "Swap"
            : selectedCategory === "Free"
            ? p.isFree || p.category === "Free"
            : p.category === selectedCategory;

        const matchesLocation =
          selectedLocation === "ALL" ||
          p.location.toLowerCase().includes(selectedLocation.toLowerCase());

        const matchesSearch =
          !searchQuery.trim() ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesLocation && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "PRICE_ASC") return a.price - b.price;
        if (sortBy === "PRICE_DESC") return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedCategory, selectedLocation, searchQuery, sortBy]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendOffer = () => {
    if (!offerAmount) return;
    setOfferSent(true);
    setTimeout(() => {
      setOfferSent(false);
      setOfferProduct(null);
      setOfferAmount("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar onOpenAi={() => setIsAiOpen(true)} />

      {/* Hero Campus Banner */}
      <section className="bg-gradient-to-b from-[#0A2540] via-[#0F355A] to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-400/30 mb-3">
                <span>🎓 Official Campus Exchange</span>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                <span>VIT-AP University</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Buy, Sell & Swap <span className="text-yellow-400">Inside Campus</span>.
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Connect with fellow VIT-AP hostelers and day scholars. Safe meetups at Central Library & Hostels with transparent 2% platform fee & Razorpay escrow.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-3 rounded-xl text-center">
                <div className="text-xl font-bold text-yellow-400">100%</div>
                <div className="text-[11px] text-blue-200">@vitap.ac.in Verified</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-3 rounded-xl text-center">
                <div className="text-xl font-bold text-emerald-400">2%</div>
                <div className="text-[11px] text-blue-200">Transparent Fee</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-3 rounded-xl text-center col-span-2 sm:col-span-1">
                <div className="text-xl font-bold text-blue-300">10+</div>
                <div className="text-[11px] text-blue-200">Meetup Points</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 'Casio calculator', 'B.S. Grewal Maths', 'Engineering Graphics kit', 'MH-2'..."
              className="block w-full pl-11 pr-24 py-3.5 bg-white text-slate-900 placeholder-slate-400 text-sm rounded-2xl shadow-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={() => setIsAiOpen(true)}
              className="absolute right-2 top-2 bottom-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>AI Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Category Pills & Hostel Quick Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                  selectedCategory === c.value
                    ? "bg-[#0A2540] text-white shadow"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Location & Sort Dropdowns */}
          <div className="flex items-center gap-3">
            {/* Location Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="NEWEST">Newest First</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Marketplace Product Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Active Campus Listings</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                {filteredProducts.length} items
              </span>
            </h2>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Payments protected by Razorpay Escrow
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">No items match your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try switching hostel blocks or adjusting search keywords. You can also ask UniSwap AI for product recommendations!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSelectedLocation("ALL");
                  setSearchQuery("");
                }}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const fee = Math.max(1, Math.round(product.price * 0.02));
                const total = product.price + fee;
                const isWishlisted = wishlist.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    {/* Top Media / Thumbnail */}
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Demand & Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.demandRating === "HIGH" && (
                          <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            <Flame className="w-3 h-3 fill-current" /> High Demand
                          </span>
                        )}
                        {product.isFree && (
                          <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            <Gift className="w-3 h-3" /> 100% Free
                          </span>
                        )}
                        {product.isSwapAvailable && (
                          <span className="inline-flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            <RefreshCw className="w-3 h-3" /> Swap Available
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500 flex items-center justify-center shadow-sm transition"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isWishlisted ? "text-rose-500 fill-rose-500" : ""
                          }`}
                        />
                      </button>

                      {/* Location Badge */}
                      <div className="absolute bottom-3 left-3 bg-[#0A2540]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-yellow-400" />
                        <span>{product.location}</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {/* Category & Condition */}
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {product.category}
                          </span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                            {product.condition}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-blue-700 transition-colors">
                          {product.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Pricing & Seller Info */}
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="flex items-baseline justify-between">
                          <div>
                            {product.isFree ? (
                              <div className="text-2xl font-black text-emerald-600">FREE</div>
                            ) : (
                              <div>
                                <div className="text-2xl font-black text-slate-900">
                                  ₹{product.price}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  + ₹{fee} UniSwap 2% fee (Total: ₹{total})
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Seller Verified Badge */}
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1">
                              <span>{product.sellerName.split(" ")[0]}</span>
                              <span className="text-emerald-600">✓</span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              <span>{product.sellerRating}</span>
                              <span>• {product.sellerHostel}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          {product.isFree ? (
                            <button
                              onClick={() => {
                                alert(`Claimed free item "${product.title}"! Please coordinate pickup with ${product.sellerName} at ${product.location}.`);
                              }}
                              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                            >
                              <Gift className="w-4 h-4" /> Claim Free Donation
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
                              onSuccess={(order) => {
                                console.log("Order placed:", order);
                              }}
                            />
                          )}

                          {/* Secondary Action: Make an Offer or Swap */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setOfferProduct(product);
                                setOfferAmount(String(Math.round(product.price * 0.85)));
                              }}
                              className="flex-1 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                            >
                              💬 Make Offer
                            </button>
                            <button
                              onClick={() => setActiveProductModal(product)}
                              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Make an Offer Modal */}
      {offerProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 border border-slate-200 animate-fadeIn">
            <h3 className="font-bold text-base text-slate-900">Make an Offer to Seller</h3>
            <p className="text-xs text-slate-500">
              Item: <strong>{offerProduct.title}</strong> (Listed at ₹{offerProduct.price})
            </p>

            {offerSent ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-bold">
                ✓ Offer of ₹{offerAmount} sent to {offerProduct.sellerName}!
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Proposed Price (₹)
                  </label>
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOfferProduct(null)}
                    className="flex-1 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendOffer}
                    className="flex-1 py-2 rounded-lg bg-[#0A2540] hover:bg-blue-900 text-white text-xs font-semibold"
                  >
                    Send Offer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="relative aspect-video bg-slate-100">
              <img
                src={activeProductModal.images[0]}
                alt={activeProductModal.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveProductModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  {activeProductModal.category} • {activeProductModal.condition}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {activeProductModal.title}
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activeProductModal.description}
                </p>
              </div>

              {activeProductModal.isSwapAvailable && (
                <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl text-xs text-indigo-900">
                  <span className="font-bold">🔄 Swap Wish: </span>
                  <span>{activeProductModal.swapFor}</span>
                </div>
              )}

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-500">Pickup Location</div>
                  <div className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{activeProductModal.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-500">Seller</div>
                  <div className="font-bold text-slate-900">{activeProductModal.sellerName}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">✓ Verified Student</div>
                </div>
              </div>

              <div className="pt-2">
                <RazorpayCheckoutButton
                  productId={activeProductModal.id}
                  title={activeProductModal.title}
                  price={activeProductModal.price}
                  sellerId={activeProductModal.sellerId}
                  sellerName={activeProductModal.sellerName}
                  sellerHostel={activeProductModal.sellerHostel}
                  selectedLocation={activeProductModal.location}
                  onSuccess={() => setActiveProductModal(null)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Groq AI Assistant */}
      <AIAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </div>
  );
}

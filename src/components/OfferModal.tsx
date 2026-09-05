"use client";

import React, { useState } from "react";
import { Product } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import {
  Tag,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Percent,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface OfferModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onOfferSubmitted?: (offer: any) => void;
}

export default function OfferModal({
  product,
  isOpen,
  onClose,
  onOfferSubmitted,
}: OfferModalProps) {
  const { user } = useAuth();
  const [offerPrice, setOfferPrice] = useState<number>(
    Math.round(product.price * 0.85) // Default 15% discount
  );
  const [meetupLocation, setMeetupLocation] = useState(product.location || "Central Library Ground Floor");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const platformFee = Math.round(offerPrice * 0.02);
  const totalWithFee = offerPrice + platformFee;
  const savings = product.price - offerPrice;

  const handleQuickPercent = (pct: number) => {
    const discounted = Math.round(product.price * (1 - pct / 100));
    setOfferPrice(discounted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          sellerId: product.sellerId,
          sellerName: product.sellerName,
          buyerId: user?.id || "usr_demo_buyer",
          buyerName: user?.name || "Charan Teja",
          buyerRegNo: user?.regNo || "23BCE1024",
          buyerEmail: user?.email || "student@vitap.ac.in",
          originalPrice: product.price,
          offerPrice,
          meetupLocation,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to propose offer");
      }

      setSuccess(true);
      if (onOfferSubmitted) {
        onOfferSubmitted(data.offer);
      }
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong proposing the offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-slate-200/90 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Tag className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">Make a Student Offer</h3>
              <p className="text-[11px] text-blue-200 line-clamp-1">{product.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-display text-xl font-bold text-slate-900">
                Offer Sent to {product.sellerName.split(" ")[0]}!
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Proposed <strong>₹{offerPrice}</strong> (Savings of ₹{savings}). The seller will be notified in the Campus Chat and can Accept or Counter.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Price Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Original Asking Price
                  </span>
                  <div className="font-display text-lg font-bold text-slate-700 line-through">
                    ₹{product.price}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                    You Save
                  </span>
                  <div className="font-display text-lg font-bold text-emerald-700">
                    ₹{savings > 0 ? savings : 0}
                  </div>
                </div>
              </div>

              {/* Offer Input & Quick Percentage Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Your Proposed Offer (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-slate-400 text-base">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    max={product.price - 1}
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pl-8 pr-3 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Quick Chips */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleQuickPercent(10)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-semibold transition"
                  >
                    -10% (₹{Math.round(product.price * 0.9)})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPercent(15)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-semibold transition"
                  >
                    -15% (₹{Math.round(product.price * 0.85)})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPercent(20)}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-semibold transition"
                  >
                    -20% (₹{Math.round(product.price * 0.8)})
                  </button>
                </div>
              </div>

              {/* Meetup Spot */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Proposed Campus Meetup Spot</span>
                </label>
                <select
                  value={meetupLocation}
                  onChange={(e) => setMeetupLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Central Library Ground Floor (24/7 Desk)">Central Library Ground Floor (24/7 Desk)</option>
                  <option value="Men's Hostel 1 (MH-1) Gazebo">Men&apos;s Hostel 1 (MH-1) Gazebo</option>
                  <option value="Men's Hostel 2 (MH-2) Entrance Courtyard">Men&apos;s Hostel 2 (MH-2) Entrance Courtyard</option>
                  <option value="Ladies Hostel 1 (LH-1) Security Desk">Ladies Hostel 1 (LH-1) Security Desk</option>
                  <option value="Academic Block 1 (AB-1) Cafeteria">Academic Block 1 (AB-1) Cafeteria</option>
                  <option value="Rock Plaza Open Amphitheater">Rock Plaza Open Amphitheater</option>
                </select>
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Optional Note to Seller
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Can collect today around 4:30 PM, ready with UPI."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* Fee Transparency Box */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Agreed Price:</span>
                  <span className="font-bold text-slate-900">₹{offerPrice}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>UniSwap 2% Campus Fee:</span>
                  <span className="font-bold text-blue-700">₹{platformFee}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold border-t border-blue-200 pt-1">
                  <span>Estimated Total:</span>
                  <span className="text-emerald-700 font-extrabold">₹{totalWithFee}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || offerPrice <= 0 || offerPrice >= product.price}
                className="w-full py-3 bg-[#0A2540] hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Submit Offer of ₹{offerPrice}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Clock,
  Loader2,
  Lock,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { loadRazorpaySDK } from "@/lib/razorpay-loader";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export type CheckoutStage =
  | "IDLE"
  | "CREATING_ORDER"
  | "AWAITING_PAYMENT"
  | "VERIFYING_PAYMENT"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

interface RazorpayCheckoutButtonProps {
  productId: string;
  title: string;
  price: number; // in Rupees
  sellerId: string;
  sellerName: string;
  sellerHostel?: string;
  selectedLocation?: string;
  onSuccess?: (order: any) => void;
}

export default function RazorpayCheckoutButton({
  productId,
  title,
  price,
  sellerId,
  sellerName,
  sellerHostel = "MH-2",
  selectedLocation = "Central Library Ground Floor",
  onSuccess,
}: RazorpayCheckoutButtonProps) {
  const [stage, setStage] = useState<CheckoutStage>("IDLE");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [meetupTime, setMeetupTime] = useState("Today, 4:30 PM");
  const [buyerLocation, setBuyerLocation] = useState(selectedLocation);

  // Synchronous refs to prevent race conditions and double-callbacks
  const stageRef = useRef<CheckoutStage>("IDLE");
  const isVerifyingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Keep stageRef in sync with stage state
  const updateStage = useCallback((newStage: CheckoutStage) => {
    stageRef.current = newStage;
    if (isMountedRef.current) {
      setStage(newStage);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Calculate 2% platform fee
  const platformFee = Math.max(1, Math.round(price * 0.02));
  const totalAmount = price + platformFee;
  const totalAmountPaise = totalAmount * 100;

  const handleOpenModal = () => {
    setErrorMessage(null);
    updateStage("IDLE");
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    // Prevent accidental dismiss while payment verification is in-flight
    if (stageRef.current === "VERIFYING_PAYMENT") {
      return;
    }
    setIsOpen(false);
    updateStage("IDLE");
    setErrorMessage(null);
  };

  const handleInitiatePayment = async () => {
    if (stageRef.current === "CREATING_ORDER" || stageRef.current === "VERIFYING_PAYMENT") {
      return;
    }

    updateStage("CREATING_ORDER");
    setErrorMessage(null);

    try {
      // 1. Ensure Razorpay checkout.js script is loaded via singleton
      const scriptLoaded = await loadRazorpaySDK();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay payment gateway SDK. Please check your network connection.");
      }

      // 2. Call backend to create Razorpay order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmountPaise, // in paise
          productId,
          productTitle: title,
          buyerName: "VIT-AP Student",
          buyerEmail: "student@vitap.ac.in",
          exchangeLocation: buyerLocation,
          exchangeTime: meetupTime,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || "Failed to create payment order with campus server.");
      }

      const razorpayKey = orderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error("Razorpay Key ID is not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID.");
      }

      // Transition to AWAITING_PAYMENT before opening modal
      updateStage("AWAITING_PAYMENT");
      isVerifyingRef.current = false;

      // 3. Configure Razorpay Standard Checkout options
      const options = {
        key: razorpayKey,
        amount: orderData.amount, // in paise
        currency: orderData.currency || "INR",
        name: "UniSwap — VIT-AP",
        description: `Campus Purchase: ${title.substring(0, 30)}`,
        order_id: orderData.order_id,
        prefill: {
          name: "VIT-AP Student",
          email: "student@vitap.ac.in",
          contact: "9876543210",
        },
        notes: {
          platform: "UniSwap VIT-AP Campus",
          productId: productId,
          exchangeLocation: buyerLocation,
        },
        theme: {
          color: "#0A2540", // VIT navy blue
        },
        // Modal dismiss handler
        modal: {
          ondismiss: function () {
            // CRITICAL FIX: If payment was completed and verification is in-flight or succeeded,
            // DO NOT reset or blink the UI back to idle!
            if (
              stageRef.current === "VERIFYING_PAYMENT" ||
              stageRef.current === "SUCCESS" ||
              isVerifyingRef.current
            ) {
              console.log("[Razorpay Flow]: Checkout modal closed post-payment. Verification continues uninterrupted.");
              return;
            }

            console.log("[Razorpay Flow]: Checkout dismissed by student before payment.");
            if (isMountedRef.current) {
              updateStage("CANCELLED");
              setErrorMessage("Payment was dismissed. You can retry whenever you are ready.");
            }
          },
        },
        // Success handler
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          // Prevent double callback / Strict Mode re-execution
          if (isVerifyingRef.current) {
            console.log("[Razorpay Flow]: Duplicate payment callback blocked.");
            return;
          }
          isVerifyingRef.current = true;

          // Transition to stable VERIFYING_PAYMENT state immediately
          updateStage("VERIFYING_PAYMENT");
          setErrorMessage(null);

          try {
            console.log(`[Razorpay Flow]: Verifying payment ${response.razorpay_payment_id} for order ${response.razorpay_order_id}`);

            // 4. Verify signature on backend
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  productId,
                  productTitle: title,
                  sellerId,
                  sellerName,
                  buyerName: "Charan (VIT-AP)",
                  buyerEmail: "student@vitap.ac.in",
                  itemAmount: price,
                  platformFee: platformFee,
                  totalAmount: totalAmount,
                  exchangeLocation: buyerLocation,
                  exchangeTime: meetupTime,
                },
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment signature verification failed on campus server.");
            }

            // Confirmed success: transition cleanly
            if (isMountedRef.current) {
              setSuccessOrder(verifyData.order);
              updateStage("SUCCESS");

              // Trigger festive celebration once
              try {
                confetti({
                  particleCount: 80,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              } catch (e) {}

              if (onSuccess) {
                onSuccess(verifyData.order);
              }
            }
          } catch (verifyErr: any) {
            console.error("[Razorpay Verification Error]:", verifyErr);
            if (isMountedRef.current) {
              updateStage("FAILED");
              setErrorMessage(verifyErr.message || "Failed to verify payment signature with campus escrow server.");
            }
          } finally {
            isVerifyingRef.current = false;
          }
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      // Handle payment.failed event
      razorpayInstance.on("payment.failed", function (response: any) {
        console.error("[Razorpay Payment Failed Event]:", response.error);
        if (isMountedRef.current) {
          updateStage("FAILED");
          setErrorMessage(
            `Payment failed: ${response.error?.description || response.error?.reason || "Payment was declined by bank."}`
          );
        }
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error("[Razorpay Flow Init Error]:", err);
      if (isMountedRef.current) {
        updateStage("FAILED");
        setErrorMessage(err.message || "Something went wrong while opening payment.");
      }
    }
  };

  const isBusy = stage === "CREATING_ORDER" || stage === "AWAITING_PAYMENT" || stage === "VERIFYING_PAYMENT";

  return (
    <>
      {/* Main Buy Button */}
      <button
        type="button"
        onClick={handleOpenModal}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-semibold py-3 px-5 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]"
      >
        <CreditCard className="w-5 h-5 text-yellow-300" />
        <span>Buy Now • ₹{totalAmount}</span>
      </button>

      {/* Unified Seamless Modal Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 transition-all duration-300">
            {/* STAGE A: VERIFYING PAYMENT (Stable Loading State, No Blinking) */}
            {stage === "VERIFYING_PAYMENT" && (
              <div className="p-8 text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse" />
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 id="checkout-modal-title" className="text-xl font-bold text-slate-900">
                    Verifying Payment...
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Confirming Razorpay HMAC cryptographic signature and securing funds in campus escrow. Please do not close this window.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-left text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>1. Razorpay Test Transaction Authorized</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                    <span>2. Validating Cryptographic Escrow Signature</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                    <span>3. Registering Supabase Order Confirmation</span>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE B: SUCCESS (Final Confirmed Screen) */}
            {stage === "SUCCESS" && successOrder && (
              <div>
                <div className="bg-emerald-600 text-white p-6 text-center space-y-2">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 id="checkout-modal-title" className="text-xl font-bold">
                    Payment Verified & Successful!
                  </h3>
                  <p className="text-emerald-100 text-xs">
                    Your order is confirmed on Razorpay test network.
                  </p>
                </div>

                <div className="p-6 space-y-4 text-sm">
                  <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Order ID:</span>
                      <span className="font-mono font-semibold text-slate-800 text-xs">
                        {successOrder.razorpayOrderId || successOrder.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment ID:</span>
                      <span className="font-mono font-semibold text-slate-800 text-xs">
                        {successOrder.paymentId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Paid:</span>
                      <span className="font-bold text-emerald-700">₹{successOrder.totalAmount}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-1.5 text-xs text-blue-900">
                    <div className="font-bold text-blue-950 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-700" /> Campus Exchange Location:
                    </div>
                    <div>{successOrder.exchangeLocation}</div>
                    <div className="font-semibold text-slate-600 pt-1">
                      Scheduled Meetup: {successOrder.exchangeTime}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 text-center">
                    A notification has been sent to seller <strong>{sellerName}</strong>. Meet at the designated spot to collect your item!
                  </p>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition"
                  >
                    Done / Back to UniSwap
                  </button>
                </div>
              </div>
            )}

            {/* STAGE C: CHECKOUT FORM & ERROR HANDLING */}
            {stage !== "VERIFYING_PAYMENT" && stage !== "SUCCESS" && (
              <div>
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0A2540] to-blue-900 text-white p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <ShieldCheck className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 id="checkout-modal-title" className="font-bold text-lg">
                        VIT-AP Secure Checkout
                      </h3>
                      <p className="text-xs text-blue-200">
                        Protected by Razorpay & UniSwap Campus Escrow
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleCloseModal}
                    className="text-white/70 hover:text-white text-xl font-bold p-1 disabled:opacity-40"
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                  {/* Product Summary */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Item to purchase
                    </div>
                    <div className="font-semibold text-slate-900 text-base mt-0.5">{title}</div>
                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                      <span>
                        Seller: <strong>{sellerName}</strong>
                      </span>
                      <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                        ✓ Verified Student
                      </span>
                    </div>
                  </div>

                  {/* Campus Meetup Point Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> Campus Exchange Location
                    </label>
                    <select
                      value={buyerLocation}
                      disabled={isBusy}
                      onChange={(e) => setBuyerLocation(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100"
                    >
                      <option value="Central Library Ground Floor">📍 Central Library Ground Floor (24/7 Desk)</option>
                      <option value="Food Street / Main Canteen">📍 Food Street / Main Canteen Plaza</option>
                      <option value="Student Activity Center (SAC)">📍 Student Activity Center (SAC Foyer)</option>
                      <option value="Academic Block 1 (AB-1)">📍 Academic Block 1 (AB-1 Plaza)</option>
                      <option value="Academic Block 2 (AB-2)">📍 Academic Block 2 (AB-2 Atrium)</option>
                      <option value="Men's Hostel 1 (MH-1)">📍 Men's Hostel 1 (MH-1 Entry)</option>
                      <option value="Men's Hostel 2 (MH-2)">📍 Men's Hostel 2 (MH-2 Gate)</option>
                      <option value="Men's Hostel 3 (MH-3)">📍 Men's Hostel 3 (MH-3 Badminton Area)</option>
                      <option value="Ladies Hostel 1 (LH-1)">📍 Ladies Hostel 1 (LH-1 Visitor Area)</option>
                      <option value="Ladies Hostel 2 (LH-2)">📍 Ladies Hostel 2 (LH-2 Gate)</option>
                    </select>
                  </div>

                  {/* Meetup Preferred Time */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" /> Preferred Meetup Slot
                    </label>
                    <input
                      type="text"
                      disabled={isBusy}
                      value={meetupTime}
                      onChange={(e) => setMeetupTime(e.target.value)}
                      placeholder="e.g. Today, 4:30 PM after classes"
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100"
                    />
                  </div>

                  {/* Transparent 2% Fee Breakdown */}
                  <div className="border-t border-dashed border-slate-200 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Seller Price</span>
                      <span className="font-semibold text-slate-800">₹{price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 items-center">
                      <span className="flex items-center gap-1.5">
                        UniSwap Campus Fee (2%)
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded font-semibold">2%</span>
                      </span>
                      <span className="font-semibold text-slate-800">₹{platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total Amount Payable</span>
                      <span className="text-blue-700">₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Error Box */}
                  {errorMessage && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-50"
                      disabled={isBusy}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleInitiatePayment}
                      disabled={isBusy}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#0A2540] hover:bg-[#071b2f] text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-75"
                    >
                      {stage === "CREATING_ORDER" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
                          <span>Creating Order...</span>
                        </>
                      ) : stage === "AWAITING_PAYMENT" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
                          <span>Waiting for Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 text-yellow-400" />
                          <span>Pay ₹{totalAmount} via Razorpay</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

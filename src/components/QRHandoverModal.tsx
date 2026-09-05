"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  MapPin,
  Clock,
  Sparkles,
  Camera,
  Loader2,
  KeyRound,
} from "lucide-react";
import { Order } from "@/lib/types";

interface QRHandoverModalProps {
  order: Order;
  mode: "buyer" | "seller";
  isOpen: boolean;
  onClose: () => void;
  onVerified?: (updatedOrder: any) => void;
}

export default function QRHandoverModal({
  order,
  mode,
  isOpen,
  onClose,
  onVerified,
}: QRHandoverModalProps) {
  const [pinInput, setPinInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Generate dynamic token & 6-digit PIN
  const exchangeToken = order.exchangeQrToken || `UNISWAP-EXCHANGE:${order.orderId}:${order.productId}`;
  const backupPin = order.exchangeOtp || `${order.orderId.slice(-3)}-${order.id.slice(-3)}`;

  const handleVerify = async (providedToken?: string, providedOtp?: string) => {
    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/exchange/verify-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.orderId,
          qrToken: providedToken || exchangeToken,
          otp: providedOtp || pinInput,
          scannedBy: mode === "seller" ? order.sellerName : "Campus Peer",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to verify exchange token.");
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setIsSuccess(true);
      if (onVerified) {
        onVerified(data.order);
      }
    } catch (err: any) {
      console.error("QR Verification error:", err);
      setErrorMessage(err.message || "Failed to verify handover.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-slate-200/80 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <QrCode className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">
                {mode === "buyer" ? "Campus Handover QR Code" : "Scan & Confirm Handover"}
              </h3>
              <p className="text-[11px] text-blue-200">Order: {order.razorpayOrderId || order.orderId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-display text-xl font-bold text-slate-900">
                Handover Confirmed!
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Campus exchange successfully recorded at <strong>{order.exchangeLocation}</strong>. Escrow payout of ₹{order.itemAmount} has been released!
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#0a152d] text-white font-bold rounded-xl text-xs"
              >
                Close Receipt
              </button>
            </div>
          ) : mode === "buyer" ? (
            /* Buyer View: Show QR */
            <div className="space-y-4 text-center">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 inline-block mx-auto shadow-inner">
                <QRCodeSVG
                  value={exchangeToken}
                  size={190}
                  level="H"
                  includeMargin={true}
                  className="rounded-xl mx-auto"
                />
              </div>

              {/* 6-Digit Backup PIN */}
              <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
                  <KeyRound className="w-4 h-4 text-blue-700" />
                  <span>Backup 6-Digit PIN:</span>
                </div>
                <span className="font-mono text-base font-black text-blue-950 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                  {backupPin}
                </span>
              </div>

              <div className="text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Meetup Spot:
                </div>
                <div className="text-slate-600">{order.exchangeLocation}</div>
                <div className="text-[11px] text-slate-400">
                  Seller: <strong>{order.sellerName}</strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Show this QR code to {order.sellerName} when you physically inspect and receive your item. Scanning automatically completes the trade.
              </p>
            </div>
          ) : (
            /* Seller View: Scan or Input PIN */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Escrow Payout Ready
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Scan buyer&apos;s QR code or enter their 6-digit PIN to confirm item handover and receive <strong>₹{order.itemAmount}</strong>.
                </p>
              </div>

              {/* Simulated Camera Scanner / 1-Click Scan */}
              <div className="border border-dashed border-slate-300 rounded-2xl p-5 text-center space-y-3 bg-slate-50">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-slate-800">
                  Camera QR Scanner Ready
                </div>
                <button
                  type="button"
                  onClick={() => handleVerify(exchangeToken)}
                  disabled={isVerifying}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 mx-auto disabled:opacity-50"
                >
                  {isVerifying ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  )}
                  <span>Simulate Instant Camera Scan</span>
                </button>
              </div>

              {/* Or manual PIN entry */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Or enter Buyer&apos;s 6-Digit PIN
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="e.g. 849-201"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerify(undefined, pinInput)}
                    disabled={isVerifying || !pinInput.trim()}
                    className="bg-[#0a152d] hover:bg-slate-800 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
                  >
                    Confirm PIN
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

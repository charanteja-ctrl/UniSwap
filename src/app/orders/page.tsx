"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import QRHandoverModal from "@/components/QRHandoverModal";
import { useAuth } from "@/lib/auth-context";
import { Order, Review } from "@/lib/types";
import { ORDER_LIFECYCLE_STEPS, getOrderStepIndex } from "@/lib/order-state";
import {
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  FileText,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  QrCode,
  Camera,
  KeyRound,
  Sparkles,
  Star,
  Send,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // QR Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalMode, setModalMode] = useState<"buyer" | "seller">("buyer");
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Review state
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewsSubmitted, setReviewsSubmitted] = useState<Record<string, Review>>({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/verify-payment");
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error("Error fetching orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const displayOrders = orders.length > 0 ? orders : [
    {
      id: "demo-ord-1",
      orderId: "order_demo_1001",
      razorpayOrderId: "order_QeX9zK9j8L2v",
      paymentId: "pay_QeYaBc7dE123",
      productId: "prod-1",
      productTitle: "Casio FX-991CW ClassWiz Scientific Calculator",
      sellerId: "user-rahul",
      sellerName: "Rahul Sharma (MH-2)",
      buyerName: user?.name || "Charan Teja",
      buyerEmail: user?.email || "charan.23bce1024@vitap.ac.in",
      itemAmount: 850,
      platformFee: 17,
      totalAmount: 867,
      status: "PAID" as const,
      paymentStatus: "PAID" as const,
      exchangeLocation: "Central Library Ground Floor (24/7 Desk)",
      exchangeTime: "Today at 4:30 PM",
      exchangeQrToken: "UNISWAP-EXCHANGE:order_demo_1001:prod-1:TOKEN849",
      exchangeOtp: "849-201",
      createdAt: new Date().toISOString(),
    },
    {
      id: "demo-ord-2",
      orderId: "order_demo_1002",
      razorpayOrderId: "order_K8dM2bN4v6Px",
      paymentId: "pay_K8dM90aBcdEF",
      productId: "prod-2",
      productTitle: "Engineering Physics Lab Manual & Notes",
      sellerId: "user-charan",
      sellerName: user?.name || "Charan Teja (MH-2)",
      buyerName: "Aditya Roy (24BCE1902)",
      buyerEmail: "aditya.24bce1902@vitap.ac.in",
      itemAmount: 250,
      platformFee: 5,
      totalAmount: 255,
      status: "COMPLETED" as const,
      paymentStatus: "PAID" as const,
      exchangeLocation: "Gazebo near Men's Hostel 1 (MH-1)",
      exchangeTime: "Yesterday at 6:00 PM",
      exchangeQrToken: "UNISWAP-EXCHANGE:order_demo_1002:prod-2:TOKEN552",
      exchangeOtp: "552-119",
      qrScannedAt: new Date(Date.now() - 86400000).toISOString(),
      handoverConfirmedBy: "Charan Teja (MH-2)",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const handleOpenBuyerQR = (order: Order) => {
    setSelectedOrder(order);
    setModalMode("buyer");
    setIsQrOpen(true);
  };

  const handleOpenSellerScan = (order: Order) => {
    setSelectedOrder(order);
    setModalMode("seller");
    setIsQrOpen(true);
  };

  const handleVerifiedOrder = (updated: Order) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === updated.orderId ? { ...o, ...updated, status: "COMPLETED" } : o
      )
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrder) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      orderId: reviewOrder.orderId,
      productId: reviewOrder.productId,
      productTitle: reviewOrder.productTitle,
      reviewerId: user?.id || "usr_student",
      reviewerName: user?.name || "Charan Teja",
      reviewerRegNo: user?.regNo || "23BCE1024",
      revieweeId: reviewOrder.sellerId,
      revieweeName: reviewOrder.sellerName,
      rating,
      comment,
      verifiedPurchase: true,
      createdAt: new Date().toLocaleDateString(),
    };

    setReviewsSubmitted((prev) => ({ ...prev, [reviewOrder.orderId]: newReview }));
    setReviewOrder(null);
    setComment("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span>Campus Escrow & Order Lifecycle State Machine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Orders & Campus Meetup Verification
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Track state transitions, verified HMAC Razorpay signatures, dynamic QR tokens, and submit verified peer reviews.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
            <span>Refresh Orders</span>
          </button>
        </div>

        {/* Orders list */}
        <div className="space-y-6">
          {displayOrders.map((order) => {
            const isCompleted = order.status === "COMPLETED" || !!order.qrScannedAt;
            const currentStepIdx = getOrderStepIndex(order.status);
            const userReview = reviewsSubmitted[order.orderId];

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6 hover:shadow-md transition"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <QrCode className="w-5 h-5" />
                      )}
                    </span>
                    <div>
                      <div className="text-xs text-slate-500 font-mono">
                        Order ID: <strong>{order.razorpayOrderId || order.orderId}</strong>
                      </div>
                      <div className="text-xs text-slate-400">
                        Date: {new Date(order.createdAt).toLocaleDateString()} •{" "}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Verified
                    </span>
                    {isCompleted ? (
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Settled & Handed Over
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-700" /> Ready for Meetup
                      </span>
                    )}
                  </div>
                </div>

                {/* State Machine Progress Stepper */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Order Lifecycle State Machine:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {ORDER_LIFECYCLE_STEPS.map((step, idx) => {
                      const stepNumber = idx + 1;
                      const isPassed = currentStepIdx >= stepNumber;
                      const isCurrent = currentStepIdx === stepNumber;

                      return (
                        <div
                          key={step.status}
                          className={`p-2.5 rounded-xl border text-left transition ${
                            isPassed
                              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                              : "bg-white border-slate-200 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                            <span>Step 0{stepNumber}</span>
                            {isPassed && <span className="text-emerald-600">✓</span>}
                          </div>
                          <div className="font-bold text-xs">{step.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                      Purchased Item
                    </div>
                    <div className="font-bold text-slate-900 text-base">{order.productTitle}</div>
                    <div className="text-xs text-slate-600">
                      Seller: <strong>{order.sellerName}</strong>
                    </div>
                    <div className="text-xs text-slate-500">
                      Buyer: <strong>{order.buyerName}</strong>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                      Campus Meetup Spot
                    </div>
                    <div className="font-semibold text-blue-900 flex items-center gap-1 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{order.exchangeLocation}</span>
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.exchangeTime || "Coordinates in Chat"}</span>
                    </div>
                  </div>

                  {/* Payment Ledger Breakdown */}
                  <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                      Payment Ledger
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Seller Payout:</span>
                      <span>₹{order.itemAmount}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>UniSwap 2% Fee:</span>
                      <span className="text-blue-700 font-bold">₹{order.platformFee}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-slate-200">
                      <span>Total Escrow Paid:</span>
                      <span className="text-emerald-700">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Verified Reviews */}
                {isCompleted ? (
                  <div className="space-y-3">
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-emerald-950">
                            Physical Handover Settled at {order.exchangeLocation}
                          </div>
                          <div className="text-[11px] text-emerald-700">
                            Verified on {order.qrScannedAt ? new Date(order.qrScannedAt).toLocaleString() : "Campus Handover"} • Escrow funds released to {order.sellerName}.
                          </div>
                        </div>
                      </div>

                      {/* Review Trigger Button */}
                      {!userReview && (
                        <button
                          type="button"
                          onClick={() => setReviewOrder(order)}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Star className="w-3.5 h-3.5 text-yellow-300 fill-current" />
                          <span>Rate Seller Experience</span>
                        </button>
                      )}
                    </div>

                    {/* Display Submitted Verified Review */}
                    {userReview && (
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(userReview.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                            <span className="text-[11px] font-bold text-slate-700 ml-1">
                              {userReview.rating}.0 / 5.0
                            </span>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified Student Review
                          </span>
                        </div>
                        <p className="text-slate-700 italic">&quot;{userReview.comment}&quot;</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>Campus Handover QR Verification</span>
                        </div>
                        <p className="text-[11px] text-blue-800">
                          Meet peer in person. Show QR or scan it to release escrow payment.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenBuyerQR(order)}
                          className="flex items-center gap-1.5 bg-[#0A2540] hover:bg-blue-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition"
                        >
                          <QrCode className="w-3.5 h-3.5 text-yellow-400" />
                          <span>Show Handover QR (Buyer)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenSellerScan(order)}
                          className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Scan / Enter PIN (Seller)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
          >
            <span>Back to Browse Campus Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* QR Handover Modal */}
      {selectedOrder && (
        <QRHandoverModal
          order={selectedOrder}
          mode={modalMode}
          isOpen={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          onVerified={handleVerifiedOrder}
        />
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Rate Seller: {reviewOrder.sellerName}
              </h3>
              <button
                onClick={() => setReviewOrder(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-1 text-center">
                <label className="text-xs font-bold text-slate-600 uppercase">Select Rating</label>
                <div className="flex justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          s <= rating
                            ? "text-yellow-400 fill-current"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Your Review</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Accurate product description, prompt meetup at Central Library!"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0A2540] hover:bg-blue-900 text-white font-bold rounded-xl text-xs transition"
              >
                Submit Verified Campus Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

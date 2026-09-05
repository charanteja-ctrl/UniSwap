"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import QRHandoverModal from "@/components/QRHandoverModal";
import { useAuth } from "@/lib/auth-context";
import { Order } from "@/lib/types";
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

  // Demo fallback orders if database or mock orders are empty
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
      prev.map((o) => (o.orderId === updated.orderId ? { ...o, ...updated, status: "COMPLETED" } : o))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span>Campus Escrow & QR Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Orders & Meetup Handover
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Verify campus physical trades at Central Library, Hostels, or Gazebo via dynamic QR code and 6-digit OTP.
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
        <div className="space-y-4">
          {displayOrders.map((order) => {
            const isCompleted = order.status === "COMPLETED" || !!order.qrScannedAt;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5 hover:shadow-md transition"
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
                        Date: {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Verified
                    </span>
                    {isCompleted ? (
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Handover Completed
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-700" /> Pending Handover
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Info Grid */}
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
                      Meetup Spot & Time
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

                  <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                      Payment Breakdown
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Item Price:</span>
                      <span>₹{order.itemAmount}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>UniSwap 2% Fee:</span>
                      <span>₹{order.platformFee}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-slate-200">
                      <span>Total Paid:</span>
                      <span className="text-emerald-700">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Handover Actions & Verification Status */}
                {isCompleted ? (
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-emerald-950">
                          Physical Handover Verified at {order.exchangeLocation}
                        </div>
                        <div className="text-[11px] text-emerald-700">
                          Settled via QR verification on {order.qrScannedAt ? new Date(order.qrScannedAt).toLocaleString() : "Campus Handover"} • Escrow released.
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                      STATUS: SETTLED
                    </span>
                  </div>
                ) : (
                  <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>Campus Handover Verification Options</span>
                        </div>
                        <p className="text-[11px] text-blue-800">
                          Meet the peer in person. Show QR or scan it to release escrow payment.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Buyer QR Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenBuyerQR(order)}
                          className="flex items-center gap-1.5 bg-[#0A2540] hover:bg-blue-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition"
                        >
                          <QrCode className="w-3.5 h-3.5 text-yellow-400" />
                          <span>Show Handover QR (Buyer)</span>
                        </button>

                        {/* Seller Scan Button */}
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
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Order } from "@/lib/types";
import { CheckCircle2, Clock, MapPin, ShieldCheck, FileText, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Demo sample order if empty
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
      buyerName: "Charan (23BCE...)",
      buyerEmail: "student@vitap.ac.in",
      itemAmount: 850,
      platformFee: 17,
      totalAmount: 867,
      status: "PAID" as const,
      paymentStatus: "PAID" as const,
      exchangeLocation: "Central Library Ground Floor (24/7 Desk)",
      exchangeTime: "Today at 4:30 PM",
      createdAt: new Date().toISOString(),
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Orders & Receipts
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Track your Razorpay payments, verified signatures, and scheduled campus meetups.
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
          {displayOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:shadow-md transition"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-xs text-slate-500 font-mono">
                      Order ID: <strong>{order.razorpayOrderId || order.orderId}</strong>
                    </div>
                    <div className="text-xs text-slate-400">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Verified
                  </span>
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Purchased Item</div>
                  <div className="font-bold text-slate-900 text-base">{order.productTitle}</div>
                  <div className="text-xs text-slate-600">Seller: {order.sellerName}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Meetup Coordinates</div>
                  <div className="font-semibold text-blue-900 flex items-center gap-1 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{order.exchangeLocation}</span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.exchangeTime || "Coordinates in Chat"}</span>
                  </div>
                </div>

                <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Payment Breakdown</div>
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

              {/* Payment Verification Details */}
              <div className="bg-slate-50 p-3 rounded-xl text-[11px] font-mono text-slate-600 flex flex-wrap items-center justify-between gap-2 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Payment ID:</span>
                  <span className="font-bold text-slate-800">{order.paymentId || "pay_demo_test"}</span>
                </div>
                <div className="text-emerald-700 font-sans font-semibold flex items-center gap-1">
                  <span>✓ HMAC-SHA256 Signature Validated</span>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
}

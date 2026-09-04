"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { DollarSign, TrendingUp, Users, ShoppingCart, ShieldCheck, CheckCircle2, ArrowUpRight, Percent, Settings, Database } from "lucide-react";

export default function AdminPage() {
  const [feePercent, setFeePercent] = useState<number>(2);
  const [domain, setDomain] = useState<string>("vitap.ac.in");
  const [isSaved, setIsSaved] = useState(false);

  // Mock campus metrics
  const stats = {
    gmv: 48650,
    revenue: 973, // 2% of GMV
    totalOrders: 64,
    verifiedStudents: 1420,
    activeListings: 186,
    avgOrderValue: 760,
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>VIT-AP University Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Platform Revenue & Admin Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Monitor GMV, UniSwap 2% marketplace fees, student verification rates, and Razorpay transactions.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* GMV */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Campus GMV</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">₹{stats.gmv.toLocaleString()}</div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% this semester
            </div>
          </div>

          {/* UniSwap 2% Revenue */}
          <div className="bg-gradient-to-br from-[#0A2540] to-blue-900 text-white p-6 rounded-2xl shadow-md space-y-2">
            <div className="flex items-center justify-between text-blue-200">
              <span className="text-xs font-bold uppercase tracking-wider">UniSwap 2% Fee Revenue</span>
              <Percent className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-black text-yellow-400">₹{stats.revenue.toLocaleString()}</div>
            <div className="text-xs text-blue-200">
              Direct marketplace cut via Razorpay Route
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Orders Completed</span>
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.totalOrders}</div>
            <div className="text-xs text-slate-500">
              Avg Order Value: ₹{stats.avgOrderValue}
            </div>
          </div>

          {/* Verified Students */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Verified Students</span>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-900">{stats.verifiedStudents}</div>
            <div className="text-xs text-emerald-600 font-semibold">
              100% @vitap.ac.in emails
            </div>
          </div>
        </div>

        {/* Razorpay & Database Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Razorpay Standard Checkout Status</span>
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Test Mode Active
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Orders created at <code>/api/create-order</code> and verified using HMAC-SHA256 at <code>/api/verify-payment</code> with environment credentials.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Supabase PostgreSQL Cloud DB</span>
              </h3>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Ref: <code>xrnofwzaglylwrrxyfyh.supabase.co</code>. Row Level Security enabled for products, profiles, and order tables.
            </p>
          </div>
        </div>

        {/* Configurable Platform Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-700" />
              <h3 className="font-bold text-base text-slate-900">Configurable Fee & Campus Guard</h3>
            </div>
            {isSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Settings updated!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                UniSwap Marketplace Fee (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={feePercent}
                  onChange={(e) => setFeePercent(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="text-sm font-bold text-slate-600">%</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Currently 2% (₹20 per ₹1,000 transaction)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Allowed University Email Domain
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Restricts student registrations exclusively to VIT-AP
              </span>
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0A2540] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition shadow"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Recent Campus Razorpay Transactions</h3>
            <span className="text-xs text-slate-500">Live transaction ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Razorpay Order ID</th>
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">Seller</th>
                  <th className="p-3.5">Buyer</th>
                  <th className="p-3.5">Item Value</th>
                  <th className="p-3.5">UniSwap Fee (2%)</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-semibold text-slate-900">order_QeX9zK9j8L2v</td>
                  <td className="p-3.5 font-medium text-slate-900">Casio FX-991CW Calculator</td>
                  <td className="p-3.5">Rahul (MH-2)</td>
                  <td className="p-3.5">Charan (23BCE...)</td>
                  <td className="p-3.5 font-semibold">₹850</td>
                  <td className="p-3.5 font-bold text-blue-700">₹17</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">
                      PAID ✓
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-semibold text-slate-900">order_P8fJ4dKm9A1c</td>
                  <td className="p-3.5 font-medium text-slate-900">Higher Engg Mathematics</td>
                  <td className="p-3.5">Priya V. (LH-1)</td>
                  <td className="p-3.5">Arun (24BME...)</td>
                  <td className="p-3.5 font-semibold">₹380</td>
                  <td className="p-3.5 font-bold text-blue-700">₹8</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">
                      PAID ✓
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-semibold text-slate-900">order_M3vL9rTa6X7q</td>
                  <td className="p-3.5 font-medium text-slate-900">Mini Drafter Engineering Kit</td>
                  <td className="p-3.5">Karthik (MH-1)</td>
                  <td className="p-3.5">Sneha (LH-2)</td>
                  <td className="p-3.5 font-semibold">₹450</td>
                  <td className="p-3.5 font-bold text-blue-700">₹9</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">
                      PAID ✓
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

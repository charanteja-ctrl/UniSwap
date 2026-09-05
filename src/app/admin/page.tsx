"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth, DEMO_USERS } from "@/lib/auth-context";
import { UserRole, ReportItem } from "@/lib/types";
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Percent,
  Settings,
  Database,
  ShieldAlert,
  AlertTriangle,
  Trash2,
  EyeOff,
  UserCheck,
  Crown,
  Sparkles,
  Lock,
} from "lucide-react";

export default function AdminPage() {
  const { user, loginAsRole } = useAuth();
  const [activeTab, setActiveTab] = useState<"revenue" | "moderation" | "rbac">("revenue");

  // Config settings
  const [feePercent, setFeePercent] = useState<number>(2);
  const [domain, setDomain] = useState<string>("vitap.ac.in");
  const [isSaved, setIsSaved] = useState(false);

  // Mock moderation items
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: "rep-1",
      productId: "prod-fake-1",
      productTitle: "Non-CASIO Fake FX-991EX (Broken Solar)",
      reportedBy: "Siddharth (23BCI0041)",
      reportedEmail: "siddharth.23bci0041@vitap.ac.in",
      reason: "Suspected fake model with fake serial number, keys not working properly in FAT exam.",
      status: "PENDING",
      createdAt: "2026-09-04T14:30:00.000Z",
    },
    {
      id: "rep-2",
      productId: "prod-spam-2",
      productTitle: "External Paid Assignment & Lab Project Proxy",
      reportedBy: "Ananya (24BCE1180)",
      reportedEmail: "ananya.24bce1180@vitap.ac.in",
      reason: "Violates VIT-AP student code of conduct. Offering academic dishonesty services.",
      status: "PENDING",
      createdAt: "2026-09-05T08:15:00.000Z",
    },
    {
      id: "rep-3",
      productId: "prod-price-3",
      productTitle: "Engineering Graphics Drafter (Dented Scale)",
      reportedBy: "Rohit (23BME0012)",
      reportedEmail: "rohit.23bme0012@vitap.ac.in",
      reason: "Advertised as 'Like New' but seller photos show chipped ruler edge.",
      status: "REVIEWED",
      createdAt: "2026-09-03T11:00:00.000Z",
    },
  ]);

  // Mock student directory for RBAC
  const [studentDirectory, setStudentDirectory] = useState([
    {
      id: "usr-1",
      name: "Charan Teja",
      email: "charan.23bce1024@vitap.ac.in",
      regNo: "23BCE1024",
      hostel: "MH-2",
      role: "student" as UserRole,
      verifiedAt: "2026-08-10",
    },
    {
      id: "usr-2",
      name: "Student Council Lead",
      email: "council.moderator@vitap.ac.in",
      regNo: "MOD-2026",
      hostel: "MH-1",
      role: "moderator" as UserRole,
      verifiedAt: "2026-07-15",
    },
    {
      id: "usr-3",
      name: "UniSwap Administrator",
      email: "admin.uniswap@vitap.ac.in",
      regNo: "ADMIN-01",
      hostel: "Central Admin",
      role: "admin" as UserRole,
      verifiedAt: "2026-06-01",
    },
    {
      id: "usr-4",
      name: "Priya Venkatesh",
      email: "priya.23bce1420@vitap.ac.in",
      regNo: "23BCE1420",
      hostel: "LH-1",
      role: "student" as UserRole,
      verifiedAt: "2026-08-14",
    },
  ]);

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

  const handleModerate = (id: string, action: "DISMISSED" | "RESOLVED") => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setStudentDirectory((prev) =>
      prev.map((s) => (s.id === id ? { ...s, role: newRole } : s))
    );
  };

  const currentRole = user?.role || "student";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header & Role Switcher Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>VIT-AP University Governance & RBAC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Admin, Moderation & Revenue Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Current Persona: <strong className="text-slate-900">{user?.name}</strong> • Role:{" "}
              <span
                className={`font-mono font-bold uppercase px-2 py-0.5 rounded text-xs ${
                  currentRole === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : currentRole === "moderator"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {currentRole}
              </span>
            </p>
          </div>

          {/* Quick 1-Click Role Switcher Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden lg:inline">
              Switch Persona:
            </span>
            <button
              type="button"
              onClick={() => loginAsRole("student")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentRole === "student"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => loginAsRole("moderator")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentRole === "moderator"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              🛡️ Moderator
            </button>
            <button
              type="button"
              onClick={() => loginAsRole("admin")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                currentRole === "admin"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              👑 Admin
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("revenue")}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === "revenue"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Platform Revenue & GMV</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("moderation")}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === "moderation"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Moderation Queue ({reports.filter((r) => r.status === "PENDING").length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rbac")}
            className={`pb-3 px-4 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
              activeTab === "rbac"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>Role-Based Access Control (RBAC)</span>
          </button>
        </div>

        {/* TAB 1: REVENUE & PLATFORM METRICS */}
        {activeTab === "revenue" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* GMV */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
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
              <div className="bg-gradient-to-br from-[#0A2540] to-blue-900 text-white p-6 rounded-3xl shadow-md space-y-2">
                <div className="flex items-center justify-between text-blue-200">
                  <span className="text-xs font-bold uppercase tracking-wider">UniSwap 2% Cut</span>
                  <Percent className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-3xl font-black text-yellow-400">₹{stats.revenue.toLocaleString()}</div>
                <div className="text-xs text-blue-200">
                  Direct marketplace cut via Razorpay Route
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
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
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
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

            {/* Razorpay & Supabase Status Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
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

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
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
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
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
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
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
          </div>
        )}

        {/* TAB 2: MODERATION QUEUE */}
        {activeTab === "moderation" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    <span>Campus Safety & Flagged Item Reports</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized for <strong>Moderators</strong> and <strong>Admins</strong>. Review student flagged listings to prevent fraud, counterfeits, and prohibited items.
                  </p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full">
                  {reports.filter((r) => r.status === "PENDING").length} Actionable Items
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {reports.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{item.productTitle}</div>
                        <div className="text-[11px] text-slate-400">
                          Reported by: <strong>{item.reportedBy}</strong> ({item.reportedEmail})
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        item.status === "PENDING"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : item.status === "RESOLVED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-100 text-slate-700 border border-slate-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wide block">
                      Student Reason:
                    </span>
                    <p>{item.reason}</p>
                  </div>

                  {item.status === "PENDING" && (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleModerate(item.id, "DISMISSED")}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Dismiss / No Violation</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModerate(item.id, "RESOLVED")}
                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Take Down Listing & Warn Student</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT DIRECTORY & RBAC */}
        {activeTab === "rbac" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-purple-600" />
                    <span>Role-Based Access Control (RBAC) Management</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assign, elevate, or revoke student roles across <strong>Student</strong>,{" "}
                    <strong>Moderator</strong>, and <strong>Admin</strong>.
                  </p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-900 font-bold px-3 py-1 rounded-full">
                  Admin Privileges Only
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Registration No.</th>
                      <th className="p-3.5">Hostel</th>
                      <th className="p-3.5">Email (@vitap.ac.in)</th>
                      <th className="p-3.5">Current Role</th>
                      <th className="p-3.5 text-right">Assign New Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentDirectory.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                            {student.name.charAt(0)}
                          </div>
                          <span>{student.name}</span>
                        </td>
                        <td className="p-3.5 font-mono font-semibold text-slate-800">
                          {student.regNo}
                        </td>
                        <td className="p-3.5">{student.hostel}</td>
                        <td className="p-3.5 font-mono text-slate-600">{student.email}</td>
                        <td className="p-3.5">
                          <span
                            className={`font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded border ${
                              student.role === "admin"
                                ? "bg-purple-100 text-purple-800 border-purple-200"
                                : student.role === "moderator"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-emerald-100 text-emerald-800 border-emerald-200"
                            }`}
                          >
                            {student.role}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <select
                            value={student.role}
                            onChange={(e) =>
                              handleRoleChange(student.id, e.target.value as UserRole)
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="student">Student</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth, DEMO_USERS } from "@/lib/auth-context";
import { UserRole, ReportItem, AuditLog, Advertisement, CustomRoleDefinition, Permission } from "@/lib/types";
import { hasPermission, ROLE_PERMISSIONS } from "@/lib/permissions";
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
  Activity,
  FileText,
  Server,
  Shield,
  RefreshCw,
  Megaphone,
  Check,
  X,
  Layers,
  PlusCircle,
  Building,
} from "lucide-react";

export default function AdminPage() {
  const { user, loginAsRole } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "revenue" | "ads_workflow" | "moderation" | "rbac" | "audit" | "health"
  >("revenue");

  // Config settings
  const [feePercent, setFeePercent] = useState<number>(2);
  const [domain, setDomain] = useState<string>("vitap.ac.in");
  const [isSaved, setIsSaved] = useState(false);

  // Health check state
  const [healthData, setHealthData] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // Advertisements workflow state
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [adsLoading, setAdsLoading] = useState(false);

  // Custom Roles state for Dynamic RBAC
  const [customRoles, setCustomRoles] = useState<CustomRoleDefinition[]>([
    {
      id: "role-master-admin",
      name: "MASTER_ADMIN",
      description: "Full platform governance, finance, ad approvals & system settings",
      permissions: ["ALL_PERMISSIONS"],
      userCount: 1,
      isSystemRole: true,
    },
    {
      id: "role-admin",
      name: "ADMIN",
      description: "Marketplace oversight, user moderation, and dispute management",
      permissions: ["PRODUCT_CREATE", "ORDER_VIEW", "PAYMENT_VIEW", "REPORT_REVIEW", "AD_APPROVE"],
      userCount: 2,
      isSystemRole: true,
    },
    {
      id: "role-ad-moderator",
      name: "ADVERTISEMENT_MODERATOR",
      description: "Review and approve university club and nearby business campaigns",
      permissions: ["AD_REVIEW", "AD_APPROVE", "AD_REJECT", "VIEW_CAMPAIGN_ANALYTICS"],
      userCount: 3,
      isSystemRole: false,
    },
    {
      id: "role-club-manager",
      name: "CLUB_MANAGER",
      description: "Manage official student chapters, create event campaigns & view reach",
      permissions: ["AD_CREATE", "AD_EDIT_OWN", "AD_SUBMIT", "EVENT_CREATE", "VIEW_CAMPAIGN_ANALYTICS"],
      userCount: 12,
      isSystemRole: false,
    },
  ]);

  // Create Role Modal state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<Permission[]>(["AD_REVIEW", "AD_APPROVE"]);

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
  ]);

  // Audit Logs Ledger
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "aud-101",
      actorId: "usr_master_admin",
      actorName: "Master Administrator",
      actorRole: "master_admin",
      action: "PLATFORM_FEE_CONFIG",
      resource: "MarketplaceFee",
      details: "Set campus marketplace fee rate to 2.0% (auto-deducted via Razorpay Route)",
      timestamp: "10:05 AM Today",
      ipAddress: "172.16.20.14 (VIT-AP Admin WiFi)",
    },
    {
      id: "aud-102",
      actorId: "usr_admin_platform",
      actorName: "UniSwap Administrator",
      actorRole: "admin",
      action: "ADVERTISEMENT_APPROVED",
      resource: "Campaign #ad-101 (TechFest 2026)",
      details: "Approved featured campus banner for IEEE Student Branch (₹1,999 revenue logged)",
      timestamp: "09:30 AM Today",
      ipAddress: "172.16.20.14",
    },
  ]);

  // Student directory for RBAC
  const [studentDirectory, setStudentDirectory] = useState([
    {
      id: "usr-1",
      name: "Charan Teja",
      email: "charan.23bce1024@vitap.ac.in",
      regNo: "23BCE1024",
      hostel: "MH-2",
      role: "student" as UserRole,
      trustScore: 98,
      verifiedAt: "2026-08-10",
    },
    {
      id: "usr-2",
      name: "Student Council Lead",
      email: "council.moderator@vitap.ac.in",
      regNo: "MOD-2026",
      hostel: "MH-1",
      role: "moderator" as UserRole,
      trustScore: 99,
      verifiedAt: "2026-07-15",
    },
    {
      id: "usr-3",
      name: "UniSwap Master Admin",
      email: "master.admin@vitap.ac.in",
      regNo: "EXEC-001",
      hostel: "University Executive Secretariat",
      role: "master_admin" as UserRole,
      trustScore: 100,
      verifiedAt: "2026-06-01",
    },
    {
      id: "usr-4",
      name: "IEEE Chapter Lead",
      email: "ieee.chapter@vitap.ac.in",
      regNo: "CLUB-IEEE-01",
      hostel: "Student Activity Center",
      role: "club_manager" as UserRole,
      trustScore: 97,
      verifiedAt: "2026-07-20",
    },
    {
      id: "usr-5",
      name: "Campus Pizza Partner",
      email: "partners.pizza@vitap.ac.in",
      regNo: "BIZ-8802",
      hostel: "Rock Plaza Dining",
      role: "business_advertiser" as UserRole,
      trustScore: 95,
      verifiedAt: "2026-08-01",
    },
  ]);

  const stats = {
    gmv: 48650,
    marketplaceCut: 973, // 2% of GMV
    adRevenue: 3497, // From approved campaigns
    totalOrders: 64,
    verifiedStudents: 1420,
    activeCampaigns: 3,
  };

  const totalPlatformEarnings = stats.marketplaceCut + stats.adRevenue;

  const fetchAds = async () => {
    setAdsLoading(true);
    try {
      const res = await fetch("/api/ads");
      const data = await res.json();
      if (data.success && data.ads) {
        setAds(data.ads);
      }
    } catch (e) {
      console.error("Ads fetch error:", e);
    } finally {
      setAdsLoading(false);
    }
  };

  const fetchHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealthData(data);
    } catch (e) {
      console.error("Health check error:", e);
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
    if (activeTab === "health") fetchHealth();
  }, [activeTab]);

  const handleAdWorkflow = async (adId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/ads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setAds((prev) =>
          prev.map((a) => (a.id === adId ? { ...a, status: action === "APPROVE" ? "APPROVED" : "REJECTED" } : a))
        );
        // Log to audit
        const adItem = ads.find((a) => a.id === adId);
        const newAudit: AuditLog = {
          id: `aud-${Date.now()}`,
          actorId: user?.id || "usr_admin",
          actorName: user?.name || "Master Administrator",
          actorRole: user?.role || "master_admin",
          action: action === "APPROVE" ? "ADVERTISEMENT_APPROVED" : "ADVERTISEMENT_REJECTED",
          resource: adItem?.title || "Campaign",
          details: `Campaign ${action === "APPROVE" ? "approved for public publishing" : "rejected"}`,
          timestamp: "Just now",
          ipAddress: "127.0.0.1",
        };
        setAuditLogs((prev) => [newAudit, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newRole: CustomRoleDefinition = {
      id: `role-${Date.now()}`,
      name: newRoleName.toUpperCase().replace(/\s+/g, "_"),
      description: newRoleDesc || "Custom configured administrative role",
      permissions: selectedPerms,
      userCount: 0,
      isSystemRole: false,
    };

    setCustomRoles((prev) => [...prev, newRole]);
    setIsRoleModalOpen(false);
    setNewRoleName("");
    setNewRoleDesc("");

    // Audit log
    const newAudit: AuditLog = {
      id: `aud-${Date.now()}`,
      actorId: user?.id || "usr_admin",
      actorName: user?.name || "Master Admin",
      actorRole: user?.role || "master_admin",
      action: "CUSTOM_ROLE_CREATED",
      resource: `Role ${newRole.name}`,
      details: `Created custom RBAC role with permissions: ${selectedPerms.join(", ")}`,
      timestamp: "Just now",
      ipAddress: "127.0.0.1",
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setStudentDirectory((prev) =>
      prev.map((s) => (s.id === id ? { ...s, role: newRole } : s))
    );
    const student = studentDirectory.find((s) => s.id === id);
    const newAudit: AuditLog = {
      id: `aud-${Date.now()}`,
      actorId: user?.id || "usr_admin",
      actorName: user?.name || "Admin",
      actorRole: user?.role || "master_admin",
      action: "ROLE_ASSIGNMENT",
      resource: `User ${student?.name} (${student?.regNo})`,
      details: `Role reassigned to ${newRole.toUpperCase()}`,
      timestamp: "Just now",
      ipAddress: "127.0.0.1",
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const currentRole = user?.role || "master_admin";

  const allPossiblePerms: Permission[] = [
    "AD_REVIEW",
    "AD_APPROVE",
    "AD_REJECT",
    "PAYMENT_VIEW",
    "REFUND_MANAGE",
    "REPORT_REVIEW",
    "USER_SUSPEND",
    "ROLE_ASSIGN",
    "EVENT_CREATE",
    "DEAL_CREATE",
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Executive Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0A2540] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-900">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold border border-yellow-400/30">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span>UniSwap Master Admin Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Platform Governance, Dual Revenue & RBAC
            </h1>
            <p className="text-xs text-blue-200">
              Active Persona: <strong className="text-white">{user?.name}</strong> • Role:{" "}
              <span className="font-mono uppercase bg-yellow-400 text-slate-950 px-2 py-0.5 rounded font-black text-xs">
                {currentRole}
              </span>
            </p>
          </div>

          {/* Persona Switcher Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => loginAsRole("master_admin")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                currentRole === "master_admin" ? "bg-yellow-400 text-slate-950" : "bg-white/10 text-white"
              }`}
            >
              👑 Master Admin
            </button>
            <button
              type="button"
              onClick={() => loginAsRole("admin")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                currentRole === "admin" ? "bg-purple-600 text-white" : "bg-white/10 text-white"
              }`}
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              onClick={() => loginAsRole("club_manager")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                currentRole === "club_manager" ? "bg-blue-600 text-white" : "bg-white/10 text-white"
              }`}
            >
              🎓 Club Manager
            </button>
            <button
              type="button"
              onClick={() => loginAsRole("student")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                currentRole === "student" ? "bg-emerald-600 text-white" : "bg-white/10 text-white"
              }`}
            >
              🎓 Student
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("revenue")}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === "revenue"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Dual Revenue & GMV</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ads_workflow")}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === "ads_workflow"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Megaphone className="w-4 h-4 text-amber-500" />
            <span>Ad Approval Workflow ({ads.filter((a) => a.status === "UNDER_REVIEW").length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("moderation")}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === "moderation"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Marketplace Moderation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rbac")}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === "rbac"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Dynamic RBAC & Roles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === "audit"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Security Audit Logs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("health")}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === "health"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Telemetry & Health</span>
          </button>
        </div>

        {/* TAB 1: DUAL REVENUE STREAM */}
        {activeTab === "revenue" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Platform Combined Earnings */}
              <div className="bg-gradient-to-br from-[#0A2540] to-blue-900 text-white p-6 rounded-3xl shadow-md space-y-2">
                <div className="flex items-center justify-between text-blue-200">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Platform Revenue</span>
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="text-3xl font-black text-yellow-400">
                  ₹{totalPlatformEarnings.toLocaleString()}
                </div>
                <div className="text-xs text-blue-200">
                  Marketplace 2% Cut + Ad Campaign Fees
                </div>
              </div>

              {/* Marketplace 2% Cut */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Marketplace 2% Cut</span>
                  <Percent className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  ₹{stats.marketplaceCut.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">
                  From ₹{stats.gmv.toLocaleString()} GMV ({stats.totalOrders} orders)
                </div>
              </div>

              {/* Advertisement Revenue */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Ad Campaign Revenue</span>
                  <Megaphone className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  ₹{stats.adRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-600 font-semibold">
                  From {stats.activeCampaigns} active verified campaigns
                </div>
              </div>

              {/* Total Verified Students */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Verified Campus Users</span>
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">{stats.verifiedStudents}</div>
                <div className="text-xs text-emerald-600 font-semibold">
                  100% @vitap.ac.in domain enforced
                </div>
              </div>
            </div>

            {/* Platform Settings */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-700" />
                  <h3 className="font-bold text-base text-slate-900">Configurable Fee & Campus Guard</h3>
                </div>
                {isSaved && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Updated!
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Marketplace Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    value={feePercent}
                    onChange={(e) => setFeePercent(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Restricted Email Domain
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0A2540] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: ADVERTISEMENT APPROVAL WORKFLOW */}
        {activeTab === "ads_workflow" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-amber-500" />
                    <span>Advertisement & Club Campaign Review Queue</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Master Admin and Ad Moderators review submitted campaigns. Only approved campaigns appear on the Ads Hub.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchAds}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                >
                  <RefreshCw className={`w-4 h-4 ${adsLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={ad.bannerUrl}
                      alt={ad.title}
                      className="w-24 h-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded text-white ${
                            ad.advertiserType === "CLUB" ? "bg-blue-600" : "bg-amber-600"
                          }`}
                        >
                          {ad.advertiserType}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            ad.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : ad.status === "REJECTED"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-900 animate-pulse"
                          }`}
                        >
                          {ad.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900">{ad.title}</h4>
                      <p className="text-xs text-slate-600 max-w-xl">{ad.tagline}</p>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Advertiser: <strong>{ad.advertiserName}</strong> • Package:{" "}
                        <span className="text-blue-700 font-bold">
                          {ad.packageType} (₹{ad.pricePaid})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    {ad.status === "UNDER_REVIEW" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAdWorkflow(ad.id, "APPROVE")}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Publish</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdWorkflow(ad.id, "REJECT")}
                          className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">Workflow Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DYNAMIC RBAC & ROLES MANAGEMENT */}
        {activeTab === "rbac" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <span>Dynamic Role-Based Access Control (RBAC)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define custom roles, configure granular permissions, and dynamically assign roles to university accounts.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsRoleModalOpen(true)}
                className="px-4 py-2.5 bg-[#0A2540] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-yellow-400" />
                <span>Create Custom Role</span>
              </button>
            </div>

            {/* Configured Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {customRoles.map((role) => (
                <div
                  key={role.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono font-black text-sm text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                      {role.name}
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {role.userCount} assigned users
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{role.description}</p>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                      Granted Permissions:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((p) => (
                        <span
                          key={p}
                          className="text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Student Directory User Assignment Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-6">
              <h4 className="font-bold text-base text-slate-900">User Role Reassignments</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Student / Account</th>
                      <th className="p-3.5">Registration No.</th>
                      <th className="p-3.5">Hostel / Location</th>
                      <th className="p-3.5">Current Role</th>
                      <th className="p-3.5 text-right">Assign New Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentDirectory.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">
                          <div>{student.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{student.email}</div>
                        </td>
                        <td className="p-3.5 font-mono">{student.regNo}</td>
                        <td className="p-3.5">{student.hostel}</td>
                        <td className="p-3.5">
                          <span className="font-mono font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                            {student.role}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <select
                            value={student.role}
                            onChange={(e) =>
                              handleRoleChange(student.id, e.target.value as UserRole)
                            }
                            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800"
                          >
                            <option value="student">Student</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                            <option value="master_admin">Master Admin</option>
                            <option value="club_manager">Club Manager</option>
                            <option value="business_advertiser">Business Advertiser</option>
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

        {/* TAB 4: MODERATION QUEUE */}
        {activeTab === "moderation" && (
          <div className="space-y-4 animate-fadeIn">
            {reports.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="font-bold text-sm text-slate-900">{item.productTitle}</div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{item.reason}</p>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() =>
                      setReports((prev) =>
                        prev.map((r) => (r.id === item.id ? { ...r, status: "DISMISSED" } : r))
                      )
                    }
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() =>
                      setReports((prev) =>
                        prev.map((r) => (r.id === item.id ? { ...r, status: "RESOLVED" } : r))
                      )
                    }
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                  >
                    Takedown Listing & Warn
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4 animate-fadeIn">
            <h3 className="font-bold text-base text-slate-900">Security & Governance Audit Ledger</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Actor</th>
                    <th className="p-3.5">Resource</th>
                    <th className="p-3.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3.5 text-slate-400">{log.timestamp}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 font-sans font-bold text-slate-900">{log.actorName}</td>
                      <td className="p-3.5 font-sans">{log.resource}</td>
                      <td className="p-3.5 font-sans text-slate-600">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: TELEMETRY & HEALTH */}
        {activeTab === "health" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-600" />
                  <span>Production System Telemetry</span>
                </h3>
                <p className="text-xs text-slate-500">Live health endpoints polled from /api/health</p>
              </div>
              <button
                type="button"
                onClick={fetchHealth}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? "animate-spin" : ""}`} />
                <span>Refresh Diagnostics</span>
              </button>
            </div>

            {healthData && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Database Engine</span>
                  <div className="font-bold text-sm text-slate-900">{healthData.services.database.provider}</div>
                  <div className="text-xs text-emerald-600 font-bold">{healthData.services.database.status} (RLS Active)</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Payment Gateway</span>
                  <div className="font-bold text-sm text-slate-900">{healthData.services.paymentGateway.provider}</div>
                  <div className="text-xs text-emerald-600 font-bold">{healthData.services.paymentGateway.status}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">AI Intelligence Engine</span>
                  <div className="font-bold text-sm text-slate-900">{healthData.services.aiEngine.provider}</div>
                  <div className="text-xs text-emerald-600 font-bold">{healthData.services.aiEngine.status}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Custom Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Create Dynamic RBAC Role</h3>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomRole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. CAMPUS_EVENT_COORDINATOR"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Describe role responsibilities..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Select Role Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                  {allPossiblePerms.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 p-1.5 text-[11px] font-mono font-semibold text-slate-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPerms.includes(perm)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPerms((prev) => [...prev, perm]);
                          } else {
                            setSelectedPerms((prev) => prev.filter((p) => p !== perm));
                          }
                        }}
                        className="rounded text-purple-600"
                      />
                      <span>{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0A2540] hover:bg-blue-900 text-white font-bold rounded-xl text-xs transition"
              >
                Save & Register Role
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

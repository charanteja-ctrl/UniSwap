"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth, DEMO_USERS } from "@/lib/auth-context";
import {
  UserRole,
  ReportItem,
  AuditLog,
  Advertisement,
  CustomRoleDefinition,
  Permission,
  FeedbackItem,
  FeedbackStatus,
  FeedbackCategory,
} from "@/lib/types";
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
  MessageSquare,
  Star,
  Search,
  Image as ImageIcon,
  Send,
  CornerDownRight,
  Eye,
  Filter,
} from "lucide-react";

export default function AdminPage() {
  const { user, loginAsRole } = useAuth();
  const currentRole = user?.role || "master_admin";

  const [activeTab, setActiveTab] = useState<
    "revenue" | "ads_workflow" | "moderation" | "feedback" | "rbac" | "audit" | "health"
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

  // Feedback Management state
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackMetrics, setFeedbackMetrics] = useState({
    totalSubmissions: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>,
    statusCounts: { New: 0, "In Progress": 0, Resolved: 0 } as Record<FeedbackStatus, number>,
  });
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState<string>("ALL");
  const [feedbackStatus, setFeedbackStatus] = useState<string>("ALL");
  const [feedbackRating, setFeedbackRating] = useState<string>("ALL");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);

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

  const fetchFeedback = async () => {
    setFeedbackLoading(true);
    try {
      const params = new URLSearchParams();
      if (feedbackSearch.trim()) params.set("search", feedbackSearch.trim());
      if (feedbackCategory !== "ALL") params.set("category", feedbackCategory);
      if (feedbackStatus !== "ALL") params.set("status", feedbackStatus);
      if (feedbackRating !== "ALL") params.set("rating", feedbackRating);
      params.set("role", currentRole);

      const res = await fetch(`/api/feedback?${params.toString()}`, {
        headers: {
          "x-user-role": currentRole,
        },
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackList(data.feedback || []);
        if (data.metrics) {
          setFeedbackMetrics(data.metrics);
        }
      }
    } catch (e) {
      console.error("Feedback fetch error:", e);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleUpdateFeedbackStatus = async (id: string, status: FeedbackStatus) => {
    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": currentRole,
        },
        body: JSON.stringify({ id, status, actorRole: currentRole }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
        setFeedbackMetrics((prev) => {
          const counts = { ...prev.statusCounts };
          const oldItem = feedbackList.find((f) => f.id === id);
          if (oldItem && oldItem.status !== status) {
            counts[oldItem.status] = Math.max(0, counts[oldItem.status] - 1);
            counts[status] = (counts[status] || 0) + 1;
          }
          return { ...prev, statusCounts: counts };
        });
        const newAudit: AuditLog = {
          id: `aud-${Date.now()}`,
          actorId: user?.id || "usr_admin",
          actorName: user?.name || "Administrator",
          actorRole: currentRole,
          action: "FEEDBACK_STATUS_UPDATE",
          resource: `Feedback #${id}`,
          details: `Updated feedback status to ${status}`,
          timestamp: "Just now",
          ipAddress: "127.0.0.1",
        };
        setAuditLogs((prev) => [newAudit, ...prev]);
      } else {
        alert(data.error || "Failed to update feedback status");
      }
    } catch (e) {
      console.error("Status update error:", e);
    }
  };

  const handleSendAdminReply = async (id: string) => {
    if (!replyText.trim()) return;
    setReplySubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": currentRole,
        },
        body: JSON.stringify({
          id,
          adminReply: replyText.trim(),
          actorRole: currentRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const now = new Date().toISOString();
        setFeedbackList((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, adminReply: replyText.trim(), adminReplyAt: now } : item
          )
        );
        setReplyingId(null);
        setReplyText("");
        const newAudit: AuditLog = {
          id: `aud-${Date.now()}`,
          actorId: user?.id || "usr_admin",
          actorName: user?.name || "Administrator",
          actorRole: currentRole,
          action: "FEEDBACK_REPLY_SENT",
          resource: `Feedback #${id}`,
          details: `Official campus response dispatched to student`,
          timestamp: "Just now",
          ipAddress: "127.0.0.1",
        };
        setAuditLogs((prev) => [newAudit, ...prev]);
      } else {
        alert(data.error || "Failed to send reply");
      }
    } catch (e) {
      console.error("Admin reply error:", e);
    } finally {
      setReplySubmitting(false);
    }
  };

  useEffect(() => {
    fetchAds();
    if (activeTab === "health") fetchHealth();
    if (activeTab === "feedback") fetchFeedback();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "feedback") {
      fetchFeedback();
    }
  }, [feedbackCategory, feedbackStatus, feedbackRating]);

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
            onClick={() => setActiveTab("feedback")}
            className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 flex-shrink-0 ${
              activeTab === "feedback"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Feedback & Suggestions ({feedbackMetrics?.statusCounts?.New || 0})</span>
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

        {/* TAB: STUDENT FEEDBACK & SUGGESTIONS */}
        {activeTab === "feedback" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header & Refresh */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <span>Student Feedback & Suggestions Governance</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct voice from VIT-AP campus buyers and sellers. Review ratings, track unresolved pain points, and dispatch official campus replies.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchFeedback}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${feedbackLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Submissions */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Submissions</span>
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {feedbackMetrics.totalSubmissions}
                </div>
                <div className="text-xs text-slate-500">All student opinions & reports</div>
              </div>

              {/* Average Rating */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Average Rating</span>
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{feedbackMetrics.averageRating}</span>
                  <span className="text-sm font-bold text-slate-400">/ 5.0</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(feedbackMetrics.averageRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-medium text-slate-500 ml-1">Campus Satisfaction</span>
                </div>
              </div>

              {/* Pending Action */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending Action</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                </div>
                <div className="text-3xl font-black text-amber-600">
                  {feedbackMetrics.statusCounts.New}
                </div>
                <div className="text-xs text-slate-500">Requires triage or reply</div>
              </div>

              {/* Resolved Count & Rate */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Resolved</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-emerald-600">
                  {feedbackMetrics.statusCounts.Resolved}
                </div>
                <div className="text-xs text-slate-500">
                  {feedbackMetrics.totalSubmissions > 0
                    ? `${Math.round((feedbackMetrics.statusCounts.Resolved / feedbackMetrics.totalSubmissions) * 100)}% resolution rate`
                    : "No submissions yet"}
                </div>
              </div>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Rating Distribution</h4>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = feedbackMetrics.ratingDistribution[stars] || 0;
                  const pct =
                    feedbackMetrics.totalSubmissions > 0
                      ? Math.round((count / feedbackMetrics.totalSubmissions) * 100)
                      : 0;
                  return (
                    <div
                      key={stars}
                      className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-bold text-xs text-slate-800">
                          {stars} <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={feedbackSearch}
                    onChange={(e) => setFeedbackSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchFeedback()}
                    placeholder="Search by title, student name, keyword, or category..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>

                {/* Category Dropdown */}
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ALL">All Categories</option>
                  <option value="General Website">General Website</option>
                  <option value="Buying Experience">Buying Experience</option>
                  <option value="Selling Experience">Selling Experience</option>
                  <option value="Payment Issues">Payment Issues</option>
                  <option value="Campus Meetup">Campus Meetup</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Other">Other</option>
                </select>

                {/* Status Dropdown */}
                <select
                  value={feedbackStatus}
                  onChange={(e) => setFeedbackStatus(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                {/* Rating Dropdown */}
                <select
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ALL">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>

                {/* Search Action */}
                <button
                  type="button"
                  onClick={fetchFeedback}
                  className="px-4 py-2.5 bg-[#0A2540] hover:bg-blue-900 text-white font-bold rounded-xl text-xs transition"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Submissions List */}
            {feedbackLoading ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Loading verified student feedback...
                </p>
              </div>
            ) : feedbackList.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No feedback submissions found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {feedbackSearch || feedbackCategory !== "ALL" || feedbackStatus !== "ALL" || feedbackRating !== "ALL"
                    ? "Try adjusting your filters or search keywords to see matching results."
                    : "No student feedback has been submitted yet. Student submissions will appear here in real time."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbackList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-4"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Category Badge */}
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                          {item.category}
                        </span>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200/60">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= item.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                              }`}
                            />
                          ))}
                          <span className="text-[11px] font-black text-amber-700 ml-1">{item.rating}/5</span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                            item.status === "Resolved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : item.status === "In Progress"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-800 border-amber-200 animate-pulse"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      {/* Author & Timestamp */}
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {item.isAnonymous ? (
                          <span className="inline-flex items-center gap-1 font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            🕶️ Anonymous Student
                          </span>
                        ) : (
                          <span className="font-bold text-slate-800">
                            {item.userName} ({item.userEmail})
                          </span>
                        )}
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>

                    {/* Title & Message */}
                    <div className="space-y-1.5">
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    {/* Screenshot thumbnail if available */}
                    {item.screenshotPath && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setPreviewScreenshot(item.screenshotPath || null)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition group"
                        >
                          <ImageIcon className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                          <span>View Attached Screenshot</span>
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>
                    )}

                    {/* Admin Action Bar: Status Selector & Reply Button */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Update Status:</span>
                        {(["New", "In Progress", "Resolved"] as FeedbackStatus[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleUpdateFeedbackStatus(item.id, st)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                              item.status === st
                                ? st === "Resolved"
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : st === "In Progress"
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "bg-amber-500 text-white shadow-sm"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      {/* Reply Button Trigger */}
                      {replyingId !== item.id && (
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingId(item.id);
                            setReplyText(item.adminReply || "");
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                          <CornerDownRight className="w-3.5 h-3.5" />
                          <span>{item.adminReply ? "Edit Official Campus Reply" : "Write Official Campus Reply"}</span>
                        </button>
                      )}
                    </div>

                    {/* Official Admin Reply Display */}
                    {item.adminReply && replyingId !== item.id && (
                      <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase text-blue-800 tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            Official UniSwap Campus Response
                          </span>
                          {item.adminReplyAt && (
                            <span className="text-[10px] text-blue-500 font-medium">
                              {new Date(item.adminReplyAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-blue-950 whitespace-pre-wrap leading-relaxed font-medium">
                          {item.adminReply}
                        </p>
                      </div>
                    )}

                    {/* Reply Input Form */}
                    {replyingId === item.id && (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5 text-blue-600" />
                            Respond as {user?.name || "Campus Admin"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setReplyingId(null)}
                            className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type clear resolution notes or campus guidance for this student..."
                          className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingId(null)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={replySubmitting || !replyText.trim()}
                            onClick={() => handleSendAdminReply(item.id)}
                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#0A2540] hover:bg-blue-900 text-white transition disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{replySubmitting ? "Sending..." : "Dispatch Reply"}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Screenshot Lightbox Modal */}
      {previewScreenshot && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Attached Screenshot Preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setPreviewScreenshot(null)}
        >
          <div
            className="bg-white rounded-3xl p-4 max-w-3xl w-full shadow-2xl border border-slate-200 space-y-3 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>Attached Student Screenshot</span>
              </h3>
              <button
                type="button"
                onClick={() => setPreviewScreenshot(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto rounded-2xl bg-slate-950 flex items-center justify-center p-2">
              <img
                src={previewScreenshot}
                alt="Student attached screenshot"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

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

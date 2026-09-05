"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, Tag, ShieldCheck, QrCode, CreditCard, Sparkles } from "lucide-react";
import { NotificationItem } from "@/lib/types";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      userId: "usr-1",
      title: "New Student Offer Received!",
      message: "Charan (23BCE1024) offered ₹750 for Casio FX-991CW Calculator.",
      type: "OFFER",
      read: false,
      createdAt: "10 mins ago",
    },
    {
      id: "notif-2",
      userId: "usr-1",
      title: "Handover QR Code Ready",
      message: "Meetup scheduled at Central Library Ground Desk. Show QR to seller.",
      type: "ORDER",
      read: false,
      createdAt: "45 mins ago",
    },
    {
      id: "notif-3",
      userId: "usr-1",
      title: "VIT-AP Escrow Payout Released",
      message: "₹833 has been settled to your account after QR verification (2% platform cut deducted).",
      type: "SYSTEM",
      read: true,
      createdAt: "Yesterday",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "OFFER":
        return <Tag className="w-3.5 h-3.5 text-yellow-500" />;
      case "ORDER":
        return <QrCode className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-white/10 hover:bg-white/15 rounded-xl border border-white/10 text-slate-200 hover:text-white transition"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in zoom-in-95 text-slate-900">
          <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-xs text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 space-y-1 hover:bg-slate-50 transition ${
                  !n.read ? "bg-blue-50/40" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    {getIcon(n.type)}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{n.createdAt}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed pl-5">
                  {n.message}
                </p>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500 font-medium">
            UniSwap Real-time Campus Alerts
          </div>
        </div>
      )}
    </div>
  );
}

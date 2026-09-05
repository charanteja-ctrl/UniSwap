"use client";

import React, { useState } from "react";
import { Product, ChatMessage, Offer } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import {
  MessageSquare,
  Send,
  X,
  MapPin,
  Sparkles,
  Tag,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";

interface CampusChatDrawerProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onMakeOfferClick?: () => void;
}

export default function CampusChatDrawer({
  product,
  isOpen,
  onClose,
  onMakeOfferClick,
}: CampusChatDrawerProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      threadId: `th-${product.id}`,
      productId: product.id,
      productTitle: product.title,
      senderId: product.sellerId,
      senderName: product.sellerName,
      senderRegNo: "23BCE0912",
      text: `Hey! Thanks for your interest in the ${product.title}. It's in ${product.condition} condition and available for pickup at ${product.location}.`,
      timestamp: "10:14 AM",
    },
  ]);
  const [inputText, setInputText] = useState("");

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId: `th-${product.id}`,
      productId: product.id,
      productTitle: product.title,
      senderId: user?.id || "usr_student_charan",
      senderName: user?.name || "Charan Teja",
      senderRegNo: user?.regNo || "23BCE1024",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    if (!textToSend) setInputText("");

    // Simulated peer auto-reply after 1.2s for interactive demo
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          threadId: `th-${product.id}`,
          productId: product.id,
          productTitle: product.title,
          senderId: product.sellerId,
          senderName: product.sellerName,
          senderRegNo: "23BCE0912",
          text: "Sounds great! You can pay via UniSwap Razorpay escrow or make an offer, and we can meet at Central Library Ground Desk!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  };

  const quickPrompts = [
    "Is this still available?",
    "Can you do ₹50 less?",
    "Can we meet at Central Library?",
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="bg-[#0A2540] text-white p-4 flex items-center justify-between border-b border-blue-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/60 border border-blue-400/30 flex items-center justify-center font-bold text-yellow-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span>{product.sellerName}</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>
              <p className="text-[11px] text-blue-200">
                Typically responds in &lt; 15 mins • {product.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Product Reference Card */}
        <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-slate-900 truncate">{product.title}</h4>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-extrabold text-blue-900">₹{product.price}</span>
                <span className="text-[10px] text-slate-500 bg-slate-200/80 px-1.5 py-0.2 rounded">
                  {product.condition}
                </span>
              </div>
            </div>
          </div>

          {onMakeOfferClick && (
            <button
              onClick={() => {
                onClose();
                onMakeOfferClick();
              }}
              className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1 flex-shrink-0"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Make Offer</span>
            </button>
          )}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
          <div className="text-center my-2">
            <span className="text-[10px] font-semibold text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
              🔒 Encrypted Campus Chat • All exchanges covered by UniSwap Escrow
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.senderId === user?.id || m.senderName === user?.name;
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1`}
              >
                <span className="text-[10px] font-semibold text-slate-400 px-1">
                  {isMe ? "You" : m.senderName} • {m.timestamp}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 px-2.5 py-1 rounded-full border border-slate-200 flex-shrink-0 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder="Type a message or proposed meetup time..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 bg-[#0A2540] hover:bg-blue-900 disabled:opacity-40 text-white rounded-xl transition shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

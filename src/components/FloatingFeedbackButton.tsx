"use client";

import React, { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import FeedbackModal from "@/components/FeedbackModal";

export default function FloatingFeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <aside aria-label="Feedback button container">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Feedback & Suggestions"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 sm:py-2.5 rounded-full bg-gradient-to-r from-[#0A2540] via-[#113359] to-[#239867] text-white shadow-xl shadow-blue-950/40 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-400/40 group select-none backdrop-blur-sm"
        >
          <div className="relative">
            <MessageSquarePlus className="w-5 h-5 text-emerald-300 group-hover:rotate-12 transition-transform duration-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-xs font-extrabold tracking-wide uppercase font-sans hidden sm:inline">
            Feedback
          </span>
        </button>
      </aside>

      {/* Feedback Modal */}
      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

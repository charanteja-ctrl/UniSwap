"use client";

import React, { useState } from "react";
import HeroSection from "@/components/HeroSection";
import CategoryMarquee from "@/components/CategoryMarquee";
import MarketplacePreview from "@/components/MarketplacePreview";
import BuySellSwapSection from "@/components/BuySellSwapSection";
import AIPoweredSection from "@/components/AIPoweredSection";
import SecurePaymentsSection from "@/components/SecurePaymentsSection";
import TrustCommunitySection from "@/components/TrustCommunitySection";
import CampusExchangeSection from "@/components/CampusExchangeSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import LandingFooter from "@/components/LandingFooter";
import AIAssistantModal from "@/components/AIAssistantModal";
import { Sparkles, Bot } from "lucide-react";

export default function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const scrollToMarketplace = () => {
    const el = document.getElementById("marketplace");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    scrollToMarketplace();
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#0a1b33] selection:bg-yellow-200 selection:text-slate-900">
      {/* 1. Main Hero Container */}
      <HeroSection onExploreClick={scrollToMarketplace} />

      {/* 2. Marketplace Category Marquee (Pure CSS, no title above, gradient mask) */}
      <CategoryMarquee onSelectCategory={handleSelectCategory} />

      {/* 3. Marketplace Preview Section (Real student listings with Razorpay Checkout) */}
      <MarketplacePreview
        selectedCategory={selectedCategory}
        onResetCategory={() => setSelectedCategory("ALL")}
      />

      {/* 4. Buy / Sell / Swap Section (3 motion-animated cards) */}
      <BuySellSwapSection />

      {/* 5. AI-Powered UniSwap (Groq AI listing generator & pricing engine) */}
      <AIPoweredSection />

      {/* 6. Secure Payments (Razorpay payment flow & 2% transparent fee breakdown) */}
      <SecurePaymentsSection />

      {/* 7. VIT-AP Verified Community (Trust, ratings, & @vitap.ac.in guard) */}
      <TrustCommunitySection />

      {/* 8. Campus Exchange (Predefined meetup locations) */}
      <CampusExchangeSection />

      {/* 9. Final Large Rounded CTA */}
      <FinalCtaSection onExploreClick={scrollToMarketplace} />

      {/* 10. Footer */}
      <LandingFooter />

      {/* Floating Ask UniSwap AI Helper Button */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#0a152d] hover:bg-blue-900 text-white p-3.5 rounded-full shadow-2xl border border-white/20 flex items-center gap-2 text-xs font-semibold hover:scale-105 transition-all cursor-pointer group"
      >
        <div className="w-6 h-6 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-black text-xs">
          ✦
        </div>
        <span className="hidden sm:inline">Ask Campus AI</span>
      </button>

      {/* Floating Groq Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}

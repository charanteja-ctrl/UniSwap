"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, UserCheck, Star, AlertOctagon, MapPin, Flag } from "lucide-react";

export default function TrustCommunitySection() {
  const trustFeatures = [
    {
      icon: <UserCheck className="w-5 h-5 text-blue-600" />,
      title: "@vitap.ac.in verified users",
      desc: "Mandatory university domain check during signup eliminates random strangers, scammers, and outside commercial sellers.",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      title: "Student profiles & registration numbers",
      desc: "Every seller and buyer profile displays department, year of study, and hostel block for complete transparency.",
    },
    {
      icon: <Star className="w-5 h-5 text-amber-500" />,
      title: "Seller ratings & peer reviews",
      desc: "After every completed campus handoff, students leave honest 5-star ratings and condition feedback.",
    },
    {
      icon: <MapPin className="w-5 h-5 text-indigo-600" />,
      title: "Safe campus exchange points",
      desc: "Meet in high-traffic campus zones like the Central Library, SAC foyer, or hostel security desks.",
    },
    {
      icon: <Flag className="w-5 h-5 text-rose-600" />,
      title: "Report & block protection system",
      desc: "One-click reporting for suspicious listings, spam, or abusive behavior with instant admin review.",
    },
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-[48px] bg-white border border-slate-200/80 p-8 md:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column */}
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Campus Trust First</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0a1b33]">
              Made for one campus. <br />
              <span className="text-blue-900">Built on trust.</span>
            </h2>

            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              Unlike generic classifieds or chaotic WhatsApp groups, UniSwap operates within a closed, authenticated student network. Every participant is a verified VIT-AP student.
            </p>

            {/* Visual Verification Badge Showcase */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ✓
              </div>
              <div>
                <div className="font-display font-bold text-sm tracking-wider text-slate-900 uppercase">
                  VIT-AP VERIFIED ✓
                </div>
                <div className="text-[11px] text-slate-500">
                  Backed by student ID & official @vitap.ac.in credentials
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Trust Feature Checklist */}
          <div className="w-full lg:max-w-md space-y-4">
            {trustFeatures.map((f, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:border-slate-300 transition-colors flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-semibold text-xs text-slate-900">
                    {f.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

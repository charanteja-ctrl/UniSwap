"use client";

import React from "react";
import { MapPin, Clock, ShieldCheck, Compass } from "lucide-react";
import { CAMPUS_LOCATIONS } from "@/lib/constants";

export default function CampusExchangeSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-3 border border-blue-200/50">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Zero Shipping Cost</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-[#0a1b33]">
          Meet on campus. Exchange with confidence.
        </h2>

        <p className="font-sans text-sm text-slate-500 mt-2">
          No waiting for courier deliveries or paying shipping fees. Coordinate meetups during lunch breaks or after classes right on campus.
        </p>
      </div>

      {/* Exchange Points Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAMPUS_LOCATIONS.slice(0, 6).map((loc) => (
          <div
            key={loc.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase">
                {loc.type}
              </span>
            </div>

            <div>
              <h3 className="font-display font-semibold text-base text-slate-900">
                {loc.name}
              </h3>
              <p className="font-sans text-xs text-slate-500 mt-1">
                {loc.description}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Campus Security Monitored</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

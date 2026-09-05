"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Sparkles, Building, BookOpen, Coffee, Compass } from "lucide-react";

interface CampusHotspot {
  id: string;
  name: string;
  code: string;
  type: "academic" | "hostel" | "hub";
  itemCount: number;
  xPercent: number; // For SVG map coordinates (0-100)
  yPercent: number;
  description: string;
}

const VITAP_HOTSPOTS: CampusHotspot[] = [
  {
    id: "spot-lib",
    name: "Central Library (24/7 Desk)",
    code: "LIB",
    type: "academic",
    itemCount: 48,
    xPercent: 50,
    yPercent: 42,
    description: "Primary academic exchange point; 24/7 security & high footfall desk.",
  },
  {
    id: "spot-mh1",
    name: "Men's Hostel 1 (MH-1) Gazebo",
    code: "MH-1",
    type: "hostel",
    itemCount: 34,
    xPercent: 24,
    yPercent: 28,
    description: "Popular meetup gazebo between MH-1 and dining halls.",
  },
  {
    id: "spot-mh2",
    name: "Men's Hostel 2 (MH-2) Courtyard",
    code: "MH-2",
    type: "hostel",
    itemCount: 42,
    xPercent: 32,
    yPercent: 58,
    description: "Courtyard entrance; convenient for engineering books & electronics.",
  },
  {
    id: "spot-lh",
    name: "Ladies Hostels (LH-1 / LH-2) Gate",
    code: "LH",
    type: "hostel",
    itemCount: 29,
    xPercent: 78,
    yPercent: 32,
    description: "Secured entrance gate with round-the-clock student access.",
  },
  {
    id: "spot-ab1",
    name: "Academic Block 1 (AB-1) Cafeteria",
    code: "AB-1",
    type: "academic",
    itemCount: 22,
    xPercent: 62,
    yPercent: 68,
    description: "Central food court & lecture halls; ideal for daytime class swaps.",
  },
  {
    id: "spot-rock",
    name: "Rock Plaza & Student Activity Center",
    code: "ROCK",
    type: "hub",
    itemCount: 16,
    xPercent: 44,
    yPercent: 82,
    description: "Open air amphitheater & club activity zone.",
  },
];

export default function CampusMapExplorer({
  selectedLocation,
  onSelectLocation,
}: {
  selectedLocation?: string;
  onSelectLocation: (loc: string) => void;
}) {
  const [activeSpot, setActiveSpot] = useState<CampusHotspot>(VITAP_HOTSPOTS[0]);

  const handleSpotClick = (spot: CampusHotspot) => {
    setActiveSpot(spot);
    onSelectLocation(spot.name);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full mb-1">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>VIT-AP Geospatial Discovery</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Marketplace Map
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any campus landmark to discover listings within walking distance of your hostel or class.
          </p>
        </div>

        {selectedLocation && (
          <button
            onClick={() => onSelectLocation("")}
            className="self-start sm:self-auto text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
          >
            Clear Filter ✕
          </button>
        )}
      </div>

      {/* Interactive Map Visual Container */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-gradient-to-br from-slate-900 via-[#0a152d] to-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner p-4">
        {/* Campus Grid Blueprint Overlay */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Ambient glow rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Campus Road lines (Stylized Blueprint) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <path
            d="M 50 150 Q 200 120 400 200 T 800 220"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          <path
            d="M 250 50 Q 300 200 450 350"
            fill="none"
            stroke="#93c5fd"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Hotspot Pins on Map */}
        {VITAP_HOTSPOTS.map((spot) => {
          const isSelected = selectedLocation?.includes(spot.code) || activeSpot.id === spot.id;

          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => handleSpotClick(spot)}
              style={{
                left: `${spot.xPercent}%`,
                top: `${spot.yPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-transform hover:scale-110 z-20"
            >
              <div className="relative flex flex-col items-center">
                {/* Ping Pulse effect on active spot */}
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-yellow-400/30 animate-ping" />
                )}

                {/* Marker Pill */}
                <div
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1.5 transition border ${
                    isSelected
                      ? "bg-yellow-400 text-slate-950 border-yellow-300 scale-105"
                      : "bg-slate-900/90 text-white border-white/20 hover:bg-slate-800"
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-slate-950 fill-current" : "text-yellow-400"}`} />
                  <span>{spot.code}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-full ${
                      isSelected ? "bg-slate-950 text-yellow-300" : "bg-blue-600/60 text-white"
                    }`}
                  >
                    {spot.itemCount}
                  </span>
                </div>
              </div>
            </button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-slate-300 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400" /> Active Hotspot
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Walkable Zone
          </span>
        </div>
      </div>

      {/* Selected Location Details Strip */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            {activeSpot.code}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <span>{activeSpot.name}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {activeSpot.itemCount} Items Nearby
              </span>
            </h4>
            <p className="text-xs text-slate-500">{activeSpot.description}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectLocation(activeSpot.name)}
          className="px-4 py-2 bg-[#0A2540] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto flex items-center gap-1.5"
        >
          <span>Filter to {activeSpot.code}</span>
          <Navigation className="w-3.5 h-3.5 text-yellow-400" />
        </button>
      </div>
    </div>
  );
}

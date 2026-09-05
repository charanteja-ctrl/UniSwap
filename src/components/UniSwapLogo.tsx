"use client";

import React from "react";
import Link from "next/link";

interface UniSwapLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  withText?: boolean;
  withBadge?: boolean;
  className?: string;
  href?: string;
}

const SIZES = {
  xs: { box: "w-6 h-6", iconSize: 24, text: "text-sm", badge: "text-[8px] px-1 py-0.2" },
  sm: { box: "w-8 h-8", iconSize: 32, text: "text-base", badge: "text-[9px] px-1.5 py-0.5" },
  md: { box: "w-10 h-10", iconSize: 40, text: "text-xl", badge: "text-[10px] px-1.5 py-0.5" },
  lg: { box: "w-12 h-12", iconSize: 48, text: "text-2xl", badge: "text-[11px] px-2 py-0.5" },
  xl: { box: "w-16 h-16", iconSize: 64, text: "text-3xl", badge: "text-xs px-2 py-0.5" },
  "2xl": { box: "w-24 h-24", iconSize: 96, text: "text-4xl", badge: "text-sm px-2.5 py-1" },
};

/**
 * UniSwap Brand Icon & Emblem
 * Bespoke vector geometry:
 * - Dynamic letter "U" contour (UniSwap / University)
 * - Interlocking bidirectional kinetic swap arrows (Peer-to-Peer Exchange)
 * - Central golden nexus node (Verified Campus Handshake)
 * - Rich Sapphire-to-Cyan and Amber-to-Gold gradients on Deep Midnight Navy squircle
 */
export function UniSwapIcon({
  size = "md",
  className = "",
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}) {
  const s = SIZES[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#0a1931] via-[#0d2244] to-[#061224] p-[1.5px] shadow-lg shadow-blue-950/40 border border-white/15 select-none transition-transform hover:scale-105 duration-200 ${s.box} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1"
      >
        <defs>
          {/* Blue / Cyan Arc Gradient */}
          <linearGradient id="blueCyanGrad" x1="20" y1="20" x2="60" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="60%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Amber / Gold Arc Gradient */}
          <linearGradient id="amberGoldGrad" x1="80" y1="80" x2="40" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>

          {/* Core Hub Glow */}
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Inner Subtle Ring */}
        <circle cx="50" cy="50" r="38" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" strokeDasharray="3 3" />

        {/* --- Path 1: Primary "U" Left & Bottom Stream (Blue-Cyan) with Forward Arrow --- */}
        <path
          d="M 28 22 
             L 28 58 
             C 28 74, 40 82, 54 82 
             L 64 82"
          stroke="url(#blueCyanGrad)"
          strokeWidth="8.5"
          strokeLinecap="round"
        />
        {/* Forward Arrowhead on Blue Arc */}
        <path
          d="M 59 74 L 69 82 L 59 90 Z"
          fill="url(#blueCyanGrad)"
        />

        {/* --- Path 2: Primary "U" Right & Top Stream (Amber-Gold) with Return Arrow --- */}
        <path
          d="M 72 78 
             L 72 42 
             C 72 26, 60 18, 46 18 
             L 36 18"
          stroke="url(#amberGoldGrad)"
          strokeWidth="8.5"
          strokeLinecap="round"
        />
        {/* Return Arrowhead on Amber Arc */}
        <path
          d="M 41 26 L 31 18 L 41 10 Z"
          fill="url(#amberGoldGrad)"
        />

        {/* --- Center Dynamic Handshake Node (Golden Sparkle / Diamond) --- */}
        <g transform="translate(50, 50)">
          {/* Subtle glow aura */}
          <circle cx="0" cy="0" r="10" fill="url(#hubGlow)" />
          {/* 4-pointed kinetic star/diamond */}
          <path
            d="M 0 -6 Q 0 0 6 0 Q 0 0 0 6 Q 0 0 -6 0 Q 0 0 0 -6 Z"
            fill="#FFFFFF"
          />
          <circle cx="0" cy="0" r="2.5" fill="#FBBF24" />
        </g>
      </svg>
    </div>
  );
}

export default function UniSwapLogo({
  size = "md",
  withText = true,
  withBadge = true,
  className = "",
  href = "/",
}: UniSwapLogoProps) {
  const s = SIZES[size];

  const content = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      <UniSwapIcon size={size} />

      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span
              className={`font-black tracking-tight text-white group-hover:text-yellow-300 transition-colors ${s.text}`}
            >
              Uni<span className="text-yellow-400">Swap</span>
            </span>

            {withBadge && (
              <span
                className={`font-extrabold uppercase tracking-wider bg-yellow-400/15 text-yellow-300 border border-yellow-400/30 rounded-md font-mono ${s.badge}`}
              >
                VIT-AP
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-blue-200/80 tracking-normal block -mt-0.5">
            Campus Peer Marketplace
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}

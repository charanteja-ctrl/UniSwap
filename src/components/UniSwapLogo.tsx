"use client";

import React from "react";
import Link from "next/link";

interface UniSwapLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  withText?: boolean;
  withBadge?: boolean;
  className?: string;
  href?: string;
  theme?: "dark" | "light";
}

const SIZES = {
  xs: { box: "w-7 h-7", text: "text-sm", badge: "text-[8px] px-1 py-0.2" },
  sm: { box: "w-9 h-9", text: "text-base", badge: "text-[9px] px-1.5 py-0.5" },
  md: { box: "w-11 h-11", text: "text-xl", badge: "text-[10px] px-1.5 py-0.5" },
  lg: { box: "w-14 h-14", text: "text-2xl", badge: "text-[11px] px-2 py-0.5" },
  xl: { box: "w-20 h-20", text: "text-3xl", badge: "text-xs px-2 py-0.5" },
  "2xl": { box: "w-28 h-28", text: "text-4xl", badge: "text-sm px-2.5 py-1" },
};

/**
 * UniSwap Brand Icon & Emblem
 * Features the official UniSwap graduation cap + U-swap arrows logo
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
      className={`relative inline-flex items-center justify-center rounded-2xl bg-white p-1 shadow-md border border-slate-200/80 overflow-hidden select-none transition-transform hover:scale-105 duration-200 ${s.box} ${className}`}
    >
      <img
        src="/logo.png"
        alt="UniSwap Logo"
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  );
}

export default function UniSwapLogo({
  size = "md",
  withText = true,
  withBadge = true,
  className = "",
  href = "/",
  theme = "dark",
}: UniSwapLogoProps) {
  const s = SIZES[size];
  const isLight = theme === "light";

  const content = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      <div
        className={`relative inline-flex items-center justify-center rounded-2xl bg-white p-1 shadow-md border border-slate-200/80 overflow-hidden select-none transition-transform group-hover:scale-105 duration-200 ${s.box}`}
      >
        <img
          src="/logo.png"
          alt="UniSwap Logo"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight transition-colors ${s.text}`}>
              <span className={isLight ? "text-[#132247]" : "text-white"}>Uni</span>
              <span className="text-[#239867]">Swap</span>
            </span>

            {withBadge && (
              <span
                className={`font-extrabold uppercase tracking-wider rounded-md font-mono ${
                  isLight
                    ? "bg-[#239867]/10 text-[#239867] border border-[#239867]/30"
                    : "bg-[#239867]/20 text-[#34d399] border border-[#239867]/40"
                } ${s.badge}`}
              >
                VIT-AP
              </span>
            )}
          </div>
          <span
            className={`text-[10px] font-medium tracking-tight block -mt-0.5 ${
              isLight ? "text-slate-500" : "text-slate-300/90"
            }`}
          >
            Buy • Sell • Within Campus
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
